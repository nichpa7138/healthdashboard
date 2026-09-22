import { HealthRecord, KPISummary } from '../types';

export function calculateKPIs(records: HealthRecord[]): KPISummary {
  const total = records.length;
  if (total === 0) {
    return {
      totalCount: 0,
      maleCount: 0,
      femaleCount: 0,
      malePercent: 0,
      femalePercent: 0,
      avgAge: 0,
      avgBmi: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgFbs: 0,
      highRiskCount: 0,
      highRiskPercent: 0,
      mediumRiskCount: 0,
      mediumRiskPercent: 0,
      lowRiskCount: 0,
      lowRiskPercent: 0,
      dmRiskCount: 0,
      dmRiskPercent: 0,
      htRiskCount: 0,
      htRiskPercent: 0,
    };
  }

  let maleCount = 0;
  let femaleCount = 0;
  let sumAge = 0;
  let sumBmi = 0;
  let sumSbp = 0;
  let sumDbp = 0;
  let sumFbs = 0;
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let dmRiskCount = 0;
  let htRiskCount = 0;

  for (const r of records) {
    if (r.gender === 'ชาย') maleCount++;
    else if (r.gender === 'หญิง') femaleCount++;

    sumAge += r.age;
    sumBmi += r.bmi;
    sumSbp += r.sbp;
    sumDbp += r.dbp;
    sumFbs += r.fbs;

    if (r.riskLevel === 'สูง') highRiskCount++;
    else if (r.riskLevel === 'ปานกลาง') mediumRiskCount++;
    else lowRiskCount++;

    if (r.diabetesScreen.includes('เสี่ยง') || r.fbs >= 126) dmRiskCount++;
    if (r.hypertensionScreen.includes('เสี่ยง') || r.sbp >= 140 || r.dbp >= 90) htRiskCount++;
  }

  return {
    totalCount: total,
    maleCount,
    femaleCount,
    malePercent: Math.round((maleCount / total) * 100),
    femalePercent: Math.round((femaleCount / total) * 100),
    avgAge: +(sumAge / total).toFixed(1),
    avgBmi: +(sumBmi / total).toFixed(1),
    avgSbp: +(sumSbp / total).toFixed(1),
    avgDbp: +(sumDbp / total).toFixed(1),
    avgFbs: +(sumFbs / total).toFixed(1),
    highRiskCount,
    highRiskPercent: Math.round((highRiskCount / total) * 100),
    mediumRiskCount,
    mediumRiskPercent: Math.round((mediumRiskCount / total) * 100),
    lowRiskCount,
    lowRiskPercent: Math.round((lowRiskCount / total) * 100),
    dmRiskCount,
    dmRiskPercent: Math.round((dmRiskCount / total) * 100),
    htRiskCount,
    htRiskPercent: Math.round((htRiskCount / total) * 100),
  };
}

export function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'น้ำหนักน้อย', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  if (bmi <= 22.9) return { label: 'สมส่วน ปกติ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (bmi <= 24.9) return { label: 'น้ำหนักเกิน (ท้วม)', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
  if (bmi <= 29.9) return { label: 'อ้วนระดับ 1', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  return { label: 'อ้วนอันตราย', color: 'text-red-700 bg-red-100 border-red-300' };
}

export function getBpCategory(sbp: number, dbp: number): { label: string; color: string } {
  if (sbp < 120 && dbp < 80) return { label: 'ปกติ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (sbp <= 139 || dbp <= 89) return { label: 'เสี่ยงความดันสูง (Pre-HT)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'ความดันโลหิตสูง', color: 'text-rose-700 bg-rose-50 border-rose-200' };
}

export function getFbsCategory(fbs: number): { label: string; color: string } {
  if (fbs < 100) return { label: 'ปกติ (<100)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (fbs <= 125) return { label: 'เสี่ยงเบาหวาน (100-125)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'เบาหวาน (≥126)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
}
