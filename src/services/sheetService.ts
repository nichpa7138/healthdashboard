import Papa from 'papaparse';
import { HealthRecord } from '../types';
import { FALLBACK_RECORDS } from '../data/initialData';

export const DEFAULT_SHEET_ID = '1pgK6yyaLxknSt_p1j0nY88lMMxbfkS7kyty4ltl_R7Y';

export interface FetchResult {
  records: HealthRecord[];
  source: 'api' | 'google-direct' | 'cache' | 'fallback';
  lastUpdated: string;
  error?: string;
  totalRawRows: number;
}

// Helper to normalize Thai text or numbers
function parseNum(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const str = String(val).replace(/,/g, '').trim();
  const n = parseFloat(str);
  return isNaN(n) ? fallback : n;
}

export function parseCsvToRecords(csvText: string): HealthRecord[] {
  const parsed = Papa.parse<string[]>(csvText, {
    skipEmptyLines: true,
  });

  if (!parsed.data || parsed.data.length < 2) {
    return [];
  }

  const rows = parsed.data;
  // First row is header
  const headers = rows[0].map(h => (h || '').trim().replace(/^"|"$/g, ''));

  // Header index lookup
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

  const records: HealthRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Check if row has valid ID or age or any content
    const rawId = (row[idIdx !== -1 ? idIdx : 0] || '').trim().replace(/^"|"$/g, '');
    if (!rawId && !row[1]) continue;

    const rawRisk = (row[riskIdx !== -1 ? riskIdx : 18] || '').trim().replace(/^"|"$/g, '');
    let normalizedRisk: 'ต่ำ' | 'ปานกลาง' | 'สูง' = 'ต่ำ';
    if (rawRisk.includes('สูง')) normalizedRisk = 'สูง';
    else if (rawRisk.includes('ปานกลาง')) normalizedRisk = 'ปานกลาง';
    else if (rawRisk.includes('ต่ำ')) normalizedRisk = 'ต่ำ';

    const rawSmoking = (row[smokingIdx !== -1 ? smokingIdx : 12] || '').trim().replace(/^"|"$/g, '');
    const rawAlcohol = (row[alcoholIdx !== -1 ? alcoholIdx : 13] || '').trim().replace(/^"|"$/g, '');
    const rawExercise = (row[exerciseIdx !== -1 ? exerciseIdx : 14] || '').trim().replace(/^"|"$/g, '');
    const rawDm = (row[dmIdx !== -1 ? dmIdx : 15] || '').trim().replace(/^"|"$/g, '');
    const rawHt = (row[htIdx !== -1 ? htIdx : 16] || '').trim().replace(/^"|"$/g, '');

    const record: HealthRecord = {
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
      smoking: rawSmoking || 'ไม่สูบ',
      alcohol: rawAlcohol || 'ไม่ดื่ม',
      exercise: rawExercise || 'บางครั้ง',
      diabetesScreen: rawDm || 'ไม่มี',
      hypertensionScreen: rawHt || 'ไม่มี',
      riskScore: parseNum(row[scoreIdx !== -1 ? scoreIdx : 17], 0),
      riskLevel: normalizedRisk,
      month: (row[monthIdx !== -1 ? monthIdx : 19] || '').trim().replace(/^"|"$/g, ''),
    };

    records.push(record);
  }

  return records;
}

export async function fetchHealthRecords(sheetId = DEFAULT_SHEET_ID, force = false): Promise<FetchResult> {
  const timestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1. Try our internal server endpoint first
  try {
    const res = await fetch(`/api/health-data?sheetId=${encodeURIComponent(sheetId)}&t=${Date.now()}`, {
      cache: force ? 'no-store' : 'default',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.records && Array.isArray(data.records) && data.records.length > 0) {
        return {
          records: data.records,
          source: 'api',
          lastUpdated: timestamp,
          totalRawRows: data.records.length,
        };
      }
    }
  } catch {
    // If running in client-only mode or server not ready, proceed to direct fetch
  }

  // 2. Try direct Google Sheets export / gviz CSV
  const directUrls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&t=${Date.now()}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&t=${Date.now()}`
  ];

  for (const url of directUrls) {
    try {
      const directRes = await fetch(url, {
        cache: 'no-store',
        mode: 'cors',
      });
      if (directRes.ok) {
        const csv = await directRes.text();
        const records = parseCsvToRecords(csv);
        if (records.length > 0) {
          return {
            records,
            source: 'google-direct',
            lastUpdated: timestamp,
            totalRawRows: records.length,
          };
        }
      }
    } catch {
      // Continue to next
    }
  }

  // 3. Fallback to bundled dataset
  return {
    records: FALLBACK_RECORDS,
    source: 'fallback',
    lastUpdated: timestamp,
    totalRawRows: FALLBACK_RECORDS.length,
    error: 'ไม่สามารถดึงข้อมูลสดผ่าน Browser CORS ได้ กำลังแสดงข้อมูลสำรองล่าสุดจาก Sheet',
  };
}
