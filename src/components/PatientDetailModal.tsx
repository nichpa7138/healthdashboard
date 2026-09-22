import React from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Calendar, 
  Scale, 
  HeartPulse, 
  Droplet, 
  Cigarette, 
  Wine, 
  Dumbbell, 
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { HealthRecord } from '../types';
import { getBmiCategory, getBpCategory, getFbsCategory } from '../utils/healthCalculations';

interface PatientDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const bmiInfo = getBmiCategory(record.bmi);
  const bpInfo = getBpCategory(record.sbp, record.dbp);
  const fbsInfo = getFbsCategory(record.fbs);

  const getRiskBadge = (level: string) => {
    if (level === 'สูง') {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeBg: 'bg-rose-600',
        label: '🔴 กลุ่มเสี่ยงสูง (High Risk)',
        advice: 'ควรส่งต่อพบแพทย์เพื่อตรวจยืนยันและรับการรักษาต่อเนื่อง พร้อมปรับเปลี่ยนพฤติกรรมด่วน',
      };
    }
    if (level === 'ปานกลาง') {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeBg: 'bg-amber-500',
        label: '🟡 กลุ่มเสี่ยงปานกลาง (Moderate Risk)',
        advice: 'ควรได้รับการติดตามระดับน้ำตาลและความดันโลหิตซ้ำภายใน 3-6 เดือน พร้อมคำปรึกษาโภชนาการ',
      };
    }
    return {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeBg: 'bg-emerald-500',
      label: '🟢 กลุ่มเสี่ยงต่ำ (Low Risk)',
      advice: 'สุขภาพอยู่ในเกณฑ์ดี แนะนำรักษาวิถีชีวิตสุขภาพดี ออกกำลังกายสม่ำเสมอ และตรวจซ้ำประจำปี',
    };
  };

  const riskBadge = getRiskBadge(record.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-rose-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold font-['Plus_Jakarta_Sans']">
              {record.id.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  รหัสบุคคล: {record.id}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${riskBadge.bg}`}>
                  {record.riskLevel === 'สูง' ? 'เสี่ยงสูง' : record.riskLevel === 'ปานกลาง' ? 'เสี่ยงปานกลาง' : 'เสี่ยงต่ำ'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>วันที่คัดกรอง: {record.date}</span>
                <span>•</span>
                <span>พื้นที่: {record.area}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Risk Level Highlight Box */}
          <div className={`p-4 rounded-2xl border ${riskBadge.bg}`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <span>{riskBadge.label}</span>
              <span className="text-xs font-normal opacity-80 font-['Plus_Jakarta_Sans']">
                (คะแนนความเสี่ยง: {record.riskScore} คะแนน)
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {riskBadge.advice}
            </p>
          </div>

          {/* Demographic Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">เพศ</span>
              <span className="text-sm font-bold text-slate-800">{record.gender}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">อายุ</span>
              <span className="text-sm font-bold text-slate-800 font-['Plus_Jakarta_Sans']">{record.age} ปี</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">ส่วนสูง / น้ำหนัก</span>
              <span className="text-sm font-bold text-slate-800 font-['Plus_Jakarta_Sans']">{record.height} cm / {record.weight} kg</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">พื้นที่คัดกรอง</span>
              <span className="text-sm font-bold text-slate-800">{record.area}</span>
            </div>
          </div>

          {/* Clinical Measurements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              ผลการตรวจวัดทางกายภาพและผลเลือด
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* BMI */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-rose-500" /> BMI</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${bmiInfo.color}`}>{bmiInfo.label}</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  {record.bmi} <span className="text-xs font-normal text-slate-500">kg/m²</span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><HeartPulse className="w-3.5 h-3.5 text-rose-500" /> ความดันโลหิต</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${bpInfo.color}`}>{bpInfo.label}</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  {record.sbp}/{record.dbp} <span className="text-xs font-normal text-slate-500">mmHg</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">ชีพจร: {record.pulse} bpm</div>
              </div>

              {/* FBS */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-purple-500" /> น้ำตาลในเลือด</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${fbsInfo.color}`}>{fbsInfo.label}</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  {record.fbs} <span className="text-xs font-normal text-slate-500">mg/dL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior & Disease Screening */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              พฤติกรรมและการคัดกรองโรคเรื้อรัง
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Behaviors */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Cigarette className="w-3.5 h-3.5 text-slate-400" /> การสูบบุหรี่:
                  </span>
                  <span className={`font-semibold ${record.smoking === 'สูบ' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {record.smoking}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5 text-slate-400" /> การดื่มแอลกอฮอล์:
                  </span>
                  <span className={`font-semibold ${record.alcohol === 'ดื่ม' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {record.alcohol}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-slate-400" /> การออกกำลังกาย:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {record.exercise}
                  </span>
                </div>
              </div>

              {/* Disease Screen */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">คัดกรองเบาหวาน:</span>
                  <span className={`font-semibold ${record.diabetesScreen.includes('เสี่ยง') ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {record.diabetesScreen}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">คัดกรองความดันโลหิตสูง:</span>
                  <span className={`font-semibold ${record.hypertensionScreen.includes('เสี่ยง') ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {record.hypertensionScreen}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">รอบเดือนที่คัดกรอง:</span>
                  <span className="font-semibold text-slate-800 font-['Plus_Jakarta_Sans']">
                    {record.month}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
