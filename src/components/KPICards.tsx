import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Scale, 
  HeartPulse, 
  Droplet,
  AlertTriangle,
  ShieldCheck,
  Info
} from 'lucide-react';
import { KPISummary } from '../types';
import { getBmiCategory, getBpCategory, getFbsCategory } from '../utils/healthCalculations';

interface KPICardsProps {
  kpis: KPISummary;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const bmiInfo = getBmiCategory(kpis.avgBmi);
  const bpInfo = getBpCategory(kpis.avgSbp, kpis.avgDbp);
  const fbsInfo = getFbsCategory(kpis.avgFbs);

  return (
    <div className="space-y-4 mb-8" id="overview-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-rose-500 rounded-full"></div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-['Prompt']">
            ภาพรวมสุขภาพและตัวชี้วัดสำคัญ (Health Overview KPIs)
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-rose-50/60 px-3 py-1 rounded-full border border-rose-100">
          <Info className="w-3.5 h-3.5 text-rose-500" />
          <span>คำนวณแบบ Real-time ตามเงื่อนไขตัวกรองปัจจุบัน</span>
        </div>
      </div>

      {/* 6 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Total Population */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">ประชากรคัดกรอง</span>
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                {kpis.totalCount}
              </span>
              <span className="text-xs font-medium text-slate-500">คน</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>100% กลุ่มเป้าหมายคัดกรอง</span>
            </div>
          </div>
        </div>

        {/* 2. Gender Ratio */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">สัดส่วน ชาย / หญิง</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {kpis.malePercent}% / {kpis.femalePercent}%
              </span>
            </div>
            {/* Visual ratio bar */}
            <div className="mt-2 w-full h-1.5 bg-pink-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-400 h-full" 
                style={{ width: `${kpis.malePercent}%` }}
                title={`ชาย ${kpis.maleCount} คน (${kpis.malePercent}%)`}
              />
              <div 
                className="bg-rose-400 h-full" 
                style={{ width: `${kpis.femalePercent}%` }}
                title={`หญิง ${kpis.femaleCount} คน (${kpis.femalePercent}%)`}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
              <span className="text-blue-600 font-medium">ชาย {kpis.maleCount}</span>
              <span className="text-rose-600 font-medium">หญิง {kpis.femaleCount}</span>
            </div>
          </div>
        </div>

        {/* 3. Average Age */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">อายุเฉลี่ย</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {kpis.avgAge}
              </span>
              <span className="text-xs font-medium text-slate-500">ปี</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>ประชากรวัยแรงงานและผู้สูงอายุ</span>
            </div>
          </div>
        </div>

        {/* 4. Average BMI */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">BMI เฉลี่ย</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {kpis.avgBmi}
              </span>
              <span className="text-xs font-medium text-slate-500">kg/m²</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-medium border ${bmiInfo.color}`}>
                {bmiInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Average SBP / DBP */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">ความดันเฉลี่ย (SBP/DBP)</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {kpis.avgSbp} / {kpis.avgDbp}
              </span>
              <span className="text-[11px] font-medium text-slate-500">mmHg</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-medium border ${bpInfo.color}`}>
                {bpInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Average Blood Sugar */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">น้ำตาลในเลือดเฉลี่ย</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {kpis.avgFbs}
              </span>
              <span className="text-[11px] font-medium text-slate-500">mg/dL</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-medium border ${fbsInfo.color}`}>
                {fbsInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Risk Overview Banner */}
      <div className="bg-linear-to-r from-pink-500 via-rose-500 to-rose-600 rounded-2xl p-4 text-white shadow-sm shadow-rose-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">สรุปสถานะความเสี่ยงรวมของประชากร</h3>
              <p className="text-xs text-rose-100">
                จำแนกตามคะแนนประเมินความเสี่ยงและภาวะคัดกรองเบาหวาน-ความดันโลหิตสูง
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-3 text-center sm:text-right">
            {/* Low Risk */}
            <div className="bg-white/15 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20">
              <div className="text-xs text-emerald-200 font-medium">🟢 เสี่ยงต่ำ</div>
              <div className="text-lg font-bold font-['Plus_Jakarta_Sans']">
                {kpis.lowRiskCount} <span className="text-xs font-normal text-white/80">({kpis.lowRiskPercent}%)</span>
              </div>
            </div>

            {/* Medium Risk */}
            <div className="bg-white/15 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/20">
              <div className="text-xs text-amber-200 font-medium">🟡 เสี่ยงปานกลาง</div>
              <div className="text-lg font-bold font-['Plus_Jakarta_Sans']">
                {kpis.mediumRiskCount} <span className="text-xs font-normal text-white/80">({kpis.mediumRiskPercent}%)</span>
              </div>
            </div>

            {/* High Risk */}
            <div className="bg-white/20 backdrop-blur-xs rounded-xl px-3.5 py-2 border border-rose-200/50">
              <div className="text-xs text-rose-200 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-200" />
                <span>🔴 เสี่ยงสูง</span>
              </div>
              <div className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-white">
                {kpis.highRiskCount} <span className="text-xs font-normal text-rose-100">({kpis.highRiskPercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
