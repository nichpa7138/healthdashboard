import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LabelList,
  BarChart
} from 'recharts';
import { HealthRecord } from '../types';
import { 
  TrendingUp, 
  Heart, 
  Cigarette, 
  Wine, 
  Dumbbell, 
  ActivitySquare,
  AlertCircle
} from 'lucide-react';

interface TrendBehaviorChartsProps {
  records: HealthRecord[];
}

export const TrendBehaviorCharts: React.FC<TrendBehaviorChartsProps> = ({ records }) => {
  const total = records.length || 1;

  // 1. Monthly Trends
  const months = Array.from(new Set(records.map(r => r.month))).filter(Boolean);
  months.sort();

  const monthlyTrendData = months.map(m => {
    const subset = records.filter(r => r.month === m);
    const low = subset.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = subset.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = subset.filter(r => r.riskLevel === 'สูง').length;
    
    // Thai month display
    const monthNames: Record<string, string> = {
      '2026-01': 'ม.ค. 2026',
      '2026-02': 'ก.พ. 2026',
      '2026-03': 'มี.ค. 2026',
      '2026-04': 'เม.ย. 2026',
    };

    return {
      monthKey: m,
      month: monthNames[m] || m,
      ผู้คัดกรองทั้งหมด: subset.length,
      เสี่ยงต่ำ: low,
      เสี่ยงปานกลาง: med,
      เสี่ยงสูง: high,
    };
  });

  // 2. Health Behaviors Breakdown
  const smokingYes = records.filter(r => r.smoking.includes('สูบ') && !r.smoking.includes('ไม่')).length;
  const smokingNo = records.length - smokingYes;

  const alcoholYes = records.filter(r => r.alcohol.includes('ดื่ม') && !r.alcohol.includes('ไม่')).length;
  const alcoholNo = records.length - alcoholYes;

  const exerciseRegular = records.filter(r => r.exercise.includes('สม่ำเสมอ')).length;
  const exerciseSometimes = records.filter(r => r.exercise.includes('บางครั้ง')).length;
  const exerciseNone = records.filter(r => r.exercise.includes('ไม่ออกกำลังกาย')).length;

  const behaviorData = [
    { category: 'สูบบุหรี่', ใช่: smokingYes, ไม่ใช่: smokingNo },
    { category: 'ดื่มแอลกอฮอล์', ใช่: alcoholYes, ไม่ใช่: alcoholNo },
  ];

  const exerciseData = [
    { name: 'สม่ำเสมอ', value: exerciseRegular, color: '#10b981' },
    { name: 'บางครั้ง', value: exerciseSometimes, color: '#f59e0b' },
    { name: 'ไม่ออกกำลังกาย', value: exerciseNone, color: '#f43f5e' },
  ];

  // 3. Chronic Disease Screening (DM and HT)
  const dmRisk = records.filter(r => r.diabetesScreen.includes('เสี่ยง') || r.fbs >= 126).length;
  const dmNormal = records.length - dmRisk;

  const htRisk = records.filter(r => r.hypertensionScreen.includes('เสี่ยง') || r.sbp >= 140 || r.dbp >= 90).length;
  const htNormal = records.length - htRisk;

  const chronicScreenData = [
    {
      disease: 'คัดกรองเบาหวาน',
      มีแนวโน้มเสี่ยง: dmRisk,
      ผลปกติ: dmNormal,
      percent: Math.round((dmRisk / total) * 100),
    },
    {
      disease: 'คัดกรองความดันโลหิต',
      มีแนวโน้มเสี่ยง: htRisk,
      ผลปกติ: htNormal,
      percent: Math.round((htRisk / total) * 100),
    },
  ];

  return (
    <div className="space-y-6 mb-8" id="trend-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-rose-500 rounded-full"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-['Prompt']">
              แนวโน้มและพฤติกรรมสุขภาพ (Health Trends & Behaviors)
            </h2>
            <p className="text-xs text-slate-500">
              ติดตามปริมาณคัดกรองรายเดือน และพฤติกรรมเสี่ยง (บุหรี่/สุรา/ออกกำลังกาย/โรคเรื้อรัง)
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-rose-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                จำนวนผู้คัดกรองรายเดือน & แนวโน้มกลุ่มเสี่ยง (Monthly Health Screening Trends)
              </h3>
              <p className="text-xs text-slate-400">
                เปรียบเทียบจำนวนผู้คัดกรองรวมและแนวโน้มกลุ่มเสี่ยงสูง/ปานกลาง/ต่ำ ในแต่ละเดือน
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> แท่ง: ยอดรวม
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span> เส้น: เสี่ยงสูง
            </span>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyTrendData} margin={{ top: 25, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700">
                        <p className="font-semibold text-rose-300 border-b border-slate-700 pb-1 mb-1.5">
                          เดือน: {label}
                        </p>
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4 text-[11px] py-0.5">
                            <span style={{ color: entry.color }}>● {entry.name}:</span>
                            <span className="font-bold font-['Plus_Jakarta_Sans']">{entry.value} คน</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="ผู้คัดกรองทั้งหมด" fill="#fed7e2" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="ผู้คัดกรองทั้งหมด" position="top" fill="#be185d" fontSize={11} fontWeight="bold" />
              </Bar>
              <Line type="monotone" dataKey="เสี่ยงต่ำ" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }}>
                <LabelList dataKey="เสี่ยงต่ำ" position="top" fill="#10b981" fontSize={10} fontWeight="bold" offset={6} />
              </Line>
              <Line type="monotone" dataKey="เสี่ยงปานกลาง" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }}>
                <LabelList dataKey="เสี่ยงปานกลาง" position="top" fill="#f59e0b" fontSize={10} fontWeight="bold" offset={6} />
              </Line>
              <Line type="monotone" dataKey="เสี่ยงสูง" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }}>
                <LabelList dataKey="เสี่ยงสูง" position="top" fill="#e11d48" fontSize={11} fontWeight="bold" offset={8} />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Behaviors & Chronic Conditions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Substance Behaviors (Smoking & Alcohol) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Cigarette className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                พฤติกรรมสูบบุหรี่ & ดื่มสุรา
              </h3>
            </div>
            <Wine className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 pt-1">
            {/* Smoking */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Cigarette className="w-3.5 h-3.5 text-rose-500" />
                  สูบบุหรี่
                </span>
                <span className="text-xs font-bold text-rose-600 font-['Plus_Jakarta_Sans']">
                  {smokingYes} คน ({Math.round((smokingYes / total) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full" style={{ width: `${(smokingYes / total) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(smokingNo / total) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="text-rose-600 font-medium">สูบ {smokingYes} คน</span>
                <span className="text-emerald-700 font-medium">ไม่สูบ {smokingNo} คน</span>
              </div>
            </div>

            {/* Alcohol */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-rose-500" />
                  ดื่มแอลกอฮอล์
                </span>
                <span className="text-xs font-bold text-rose-600 font-['Plus_Jakarta_Sans']">
                  {alcoholYes} คน ({Math.round((alcoholYes / total) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full" style={{ width: `${(alcoholYes / total) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(alcoholNo / total) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="text-rose-600 font-medium">ดื่ม {alcoholYes} คน</span>
                <span className="text-emerald-700 font-medium">ไม่ดื่ม {alcoholNo} คน</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Physical Exercise */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                การออกกำลังกาย (Exercise)
              </h3>
            </div>
            <Heart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-1">
            {exerciseData.map((item) => {
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={item.name} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
                      {item.value} คน <span className="font-normal text-slate-500">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Chronic Disease Screening (DM / HT) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ActivitySquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                คัดกรองเบาหวาน & ความดันโลหิต
              </h3>
            </div>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-1">
            {/* Diabetes */}
            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-800">เบาหวาน (DM Screen)</span>
                <span className="text-xs font-bold text-rose-600 font-['Plus_Jakarta_Sans']">
                  เสี่ยง {dmRisk} คน ({Math.round((dmRisk / total) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full" style={{ width: `${(dmRisk / total) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(dmNormal / total) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="text-rose-600 font-medium">มีแนวโน้ม/เสี่ยง: {dmRisk}</span>
                <span className="text-emerald-700 font-medium">ปกติ: {dmNormal}</span>
              </div>
            </div>

            {/* Hypertension */}
            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-800">ความดันโลหิต (HT Screen)</span>
                <span className="text-xs font-bold text-rose-600 font-['Plus_Jakarta_Sans']">
                  เสี่ยง {htRisk} คน ({Math.round((htRisk / total) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full" style={{ width: `${(htRisk / total) * 100}%` }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: `${(htNormal / total) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="text-rose-600 font-medium">มีแนวโน้ม/เสี่ยง: {htRisk}</span>
                <span className="text-emerald-700 font-medium">ปกติ: {htNormal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
