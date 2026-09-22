import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Papa from 'papaparse';

const PORT = 3000;
const DEFAULT_SHEET_ID = '1pgK6yyaLxknSt_p1j0nY88lMMxbfkS7kyty4ltl_R7Y';

function parseNum(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const str = String(val).replace(/,/g, '').trim();
  const n = parseFloat(str);
  return isNaN(n) ? fallback : n;
}

function parseCsv(csvText: string) {
  const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
  if (!parsed.data || parsed.data.length < 2) return [];

  const rows = parsed.data;
  const headers = rows[0].map(h => (h || '').trim().replace(/^"|"$/g, ''));

  const getColIdx = (names: string[]): number => {
    const exact = headers.findIndex(h => names.some(name => h === name));
    if (exact !== -1) return exact;
    return headers.findIndex(h => names.some(name => h.includes(name)));
  };

  const idIdx = getColIdx(['รหัสบุคคล', 'รหัส', 'ID', 'id']);
  const dateIdx = getColIdx(['วันที่คัดกรอง', 'วันที่', 'date']);
  const areaIdx = getColIdx(['พื้นที่', 'เขต', 'area']);
  const genderIdx = getColIdx(['เพศ', 'gender']);
  const ageIdx = getColIdx(['อายุ', 'age']);
  const heightIdx = getColIdx(['ส่วนสูง_cm', 'ส่วนสูง', 'height']);
  const weightIdx = getColIdx(['น้ำหนัก_kg', 'น้ำหนัก', 'weight']);
  const bmiIdx = getColIdx(['BMI', 'bmi']);
  const sbpIdx = getColIdx(['SBP_mmHg', 'SBP', 'sbp', 'ความดันตัวบน']);
  const dbpIdx = getColIdx(['DBP_mmHg', 'DBP', 'dbp', 'ความดันตัวล่าง']);
  const pulseIdx = getColIdx(['ชีพจร_bpm', 'ชีพจร', 'pulse']);
  const fbsIdx = getColIdx(['น้ำตาล_mg_dL', 'น้ำตาล', 'FBS', 'fbs']);
  const smokingIdx = getColIdx(['สูบบุหรี่', 'บุหรี่']);
  const alcoholIdx = getColIdx(['ดื่มแอลกอฮอล์', 'แอลกอฮอล์', 'สุรา']);
  const exerciseIdx = getColIdx(['การออกกำลังกาย', 'ออกกำลังกาย']);
  const dmIdx = getColIdx(['เบาหวาน_คัดกรอง', 'เบาหวาน']);
  const htIdx = getColIdx(['ความดันโลหิตสูง_คัดกรอง', 'ความดันโลหิตสูง', 'ความดัน']);
  const scoreIdx = getColIdx(['คะแนนความเสี่ยง', 'คะแนน']);
  const riskIdx = getColIdx(['ระดับความเสี่ยง', 'ระดับเสี่ยง']);
  const monthIdx = getColIdx(['เดือน', 'month']);

  const records = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawId = (row[idIdx !== -1 ? idIdx : 0] || '').trim().replace(/^"|"$/g, '');
    if (!rawId && !row[1]) continue;

    const rawRisk = (row[riskIdx !== -1 ? riskIdx : 18] || '').trim().replace(/^"|"$/g, '');
    let normalizedRisk = 'ต่ำ';
    if (rawRisk.includes('สูง')) normalizedRisk = 'สูง';
    else if (rawRisk.includes('ปานกลาง')) normalizedRisk = 'ปานกลาง';
    else if (rawRisk.includes('ต่ำ')) normalizedRisk = 'ต่ำ';

    records.push({
      id: rawId || `H${String(i).padStart(4, '0')}`,
      date: (row[dateIdx !== -1 ? dateIdx : 1] || '').trim().replace(/^"|"$/g, ''),
      area: (row[areaIdx !== -1 ? areaIdx : 2] || 'ทั่วไป').trim().replace(/^"|"$/g, ''),
      gender: (row[genderIdx !== -1 ? genderIdx : 3] || 'ไม่ระบุ').trim().replace(/^"|"$/g, ''),
      age: parseNum(row[ageIdx !== -1 ? ageIdx : 4], 40),
      height: parseNum(row[heightIdx !== -1 ? heightIdx : 5], 160),
      weight: parseNum(row[weightIdx !== -1 ? weightIdx : 6], 65),
      bmi: parseNum(row[bmiIdx !== -1 ? bmiIdx : 7], 24),
      sbp: parseNum(row[sbpIdx !== -1 ? sbpIdx : 8], 120),
      dbp: parseNum(row[dbpIdx !== -1 ? dbpIdx : 9], 80),
      pulse: parseNum(row[pulseIdx !== -1 ? pulseIdx : 10], 75),
      fbs: parseNum(row[fbsIdx !== -1 ? fbsIdx : 11], 100),
      smoking: (row[smokingIdx !== -1 ? smokingIdx : 12] || 'ไม่สูบ').trim().replace(/^"|"$/g, ''),
      alcohol: (row[alcoholIdx !== -1 ? alcoholIdx : 13] || 'ไม่ดื่ม').trim().replace(/^"|"$/g, ''),
      exercise: (row[exerciseIdx !== -1 ? exerciseIdx : 14] || 'บางครั้ง').trim().replace(/^"|"$/g, ''),
      diabetesScreen: (row[dmIdx !== -1 ? dmIdx : 15] || 'ไม่มี').trim().replace(/^"|"$/g, ''),
      hypertensionScreen: (row[htIdx !== -1 ? htIdx : 16] || 'ไม่มี').trim().replace(/^"|"$/g, ''),
      riskScore: parseNum(row[scoreIdx !== -1 ? scoreIdx : 17], 0),
      riskLevel: normalizedRisk,
      month: (row[monthIdx !== -1 ? monthIdx : 19] || '').trim().replace(/^"|"$/g, ''),
    });
  }

  return records;
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API: Real-time Google Sheet data
  app.get('/api/health-data', async (req, res) => {
    const sheetId = (req.query.sheetId as string) || DEFAULT_SHEET_ID;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Google Sheets responded with HTTP ${response.status}`);
      }
      const csv = await response.text();
      const records = parseCsv(csv);

      res.json({
        success: true,
        sheetId,
        count: records.length,
        syncedAt: new Date().toISOString(),
        records,
      });
    } catch (err: any) {
      console.error('Error fetching sheet data:', err);
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to fetch Google Sheet data',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
