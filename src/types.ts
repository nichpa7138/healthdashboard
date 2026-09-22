export interface HealthRecord {
  id: string;
  date: string;
  area: string;
  gender: 'ชาย' | 'หญิง' | string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  sbp: number;
  dbp: number;
  pulse: number;
  fbs: number;
  smoking: 'สูบ' | 'ไม่สูบ' | string;
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string;
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string;
  diabetesScreen: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  hypertensionScreen: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  riskScore: number;
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string;
  month: string;
}

export interface FilterState {
  search: string;
  area: string;
  gender: string;
  ageRange: string;
  riskLevel: string;
  smoking: string;
  alcohol: string;
  exercise: string;
  diabetes: string;
  hypertension: string;
}

export interface KPISummary {
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  malePercent: number;
  femalePercent: number;
  avgAge: number;
  avgBmi: number;
  avgSbp: number;
  avgDbp: number;
  avgFbs: number;
  highRiskCount: number;
  highRiskPercent: number;
  mediumRiskCount: number;
  mediumRiskPercent: number;
  lowRiskCount: number;
  lowRiskPercent: number;
  dmRiskCount: number;
  dmRiskPercent: number;
  htRiskCount: number;
  htRiskPercent: number;
}
