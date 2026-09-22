import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  LabelList 
} from 'recharts';
import { HealthRecord } from '../types';
import { Flame, PieChart as PieIcon, BarChart2, MapPin, Users } from 'lucide-react';

interface RiskChartsProps {
  records: HealthRecord[];
}

const RISK_COLORS = {
  ต่ำ: '#10b981', // Emerald
  ปานกลาง: '#f59e0b', // Amber
  สูง: '#f43f5e', // Rose/Red
};

export const RiskCharts: React.FC<RiskChartsProps> = ({ records }) => {
  const total = records.length || 1;

  // 1. Overall Risk Breakdown for Donut Chart
  const riskCounts = records.reduce((acc, r) => {
    acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'กลุ่มเสี่ยงต่ำ', key: 'ต่ำ', value: riskCounts['ต่ำ'] || 0, color: RISK_COLORS['ต่ำ'] },
    { name: 'กลุ่มเสี่ยงปานกลาง', key: 'ปานกลาง', value: riskCounts['ปานกลาง'] || 0, color: RISK_COLORS['ปานกลาง'] },
    { name: 'กลุ่มเสี่ยงสูง', key: 'สูง', value: riskCounts['สูง'] || 0, color: RISK_COLORS['สูง'] },
  ];

  // 2. Risk by Age Groups
  const ageBuckets = [
    { label: '< 35 ปี', filter: (age: number) => age < 35 },
    { label: '35-49 ปี', filter: (age: number) => age >= 35 && age <= 49 },
    { label: '50-59 ปี', filter: (age: number) => age >= 50 && age <= 59 },
    { label: '60+ ปี', filter: (age: number) => age >= 60 },
  ];

  const riskByAgeData = ageBuckets.map(b => {
    const subset = records.filter(r => b.filter(r.age));
    const low = subset.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = subset.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = subset.filter(r => r.riskLevel === 'สูง').length;
    return {
      group: b.label,
      total: subset.length,
      ต่ำ: low,
      ปานกลาง: med,
      สูง: high,
    };
  });

  // 3. Risk by Gender
  const genders = ['ชาย', 'หญิง'];
  const riskByGenderData = genders.map(g => {
    const subset = records.filter(r => r.gender === g);
    const low = subset.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = subset.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = subset.filter(r => r.riskLevel === 'สูง').length;
    return {
      gender: g,
      total: subset.length,
      ต่ำ: low,
      ปานกลาง: med,
      สูง: high,
    };
  });

  // 4. Risk by Area
  const areaList = Array.from(new Set(records.map(r => r.area))).filter(Boolean);
  // Sort areas nicely
  areaList.sort();

  const riskByAreaData = areaList.map(area => {
    const subset = records.filter(r => r.area === area);
    const low = subset.filter(r => r.riskLevel === 'ต่ำ').length;
    const med = subset.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = subset.filter(r => r.riskLevel === 'สูง').length;
    return {
      area,
      total: subset.length,
      ต่ำ: low,
      ปานกลาง: med,
      สูง: high,
    };
  });

  // Custom Pie Label with visible numbers
  const renderCustomizedPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percent = Math.round((value / total) * 100);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[12px] font-bold drop-shadow-sm font-['Plus_Jakarta_Sans']"
      >
        {`${value} (${percent}%)`}
      </text>
    );
  };

  return (
    <div className="space-y-6 mb-8" id="risk-section">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-pink-500 rounded-full"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-['Prompt']">
              การวิเคราะห์กลุ่มเสี่ยงสุขภาพ (Health Risk Analysis)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์สัดส่วนระดับความเสี่ยงตามปัจจัยเสี่ยง อายุ เพศ และพื้นที่
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> เสี่ยงต่ำ
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> เสี่ยงปานกลาง
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> เสี่ยงสูง
          </span>
        </div>
      </div>

      {/* Grid of 4 Risk Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Donut Chart - Overall Risk */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                สัดส่วนกลุ่มเสี่ยงสุขภาพ (ต่ำ / ปานกลาง / สูง)
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500">ทั้งหมด {records.length} ราย</span>
          </div>

          <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const val = Number(data.value);
                      const pct = ((val / total) * 100).toFixed(1);
                      return (
                        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700">
                          <p className="font-semibold text-rose-300">{data.name}</p>
                          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] font-medium">
                            จำนวน: <span className="font-bold text-white">{val} คน</span> ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedPieLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Donut Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">ประชากร</span>
              <span className="text-2xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans']">
                {records.length}
              </span>
              <span className="text-[10px] text-slate-500">คัดกรอง</span>
            </div>
          </div>

          {/* Detailed summary boxes below Donut */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-rose-50 text-center">
            {pieData.map((item) => {
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={item.key} className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 mb-0.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <div className="text-base font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
                    {item.value} <span className="text-xs font-normal text-slate-500">คน</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-500">{pct}% ของทั้งหมด</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Stacked Bar - Risk by Age Group */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                กลุ่มเสี่ยงตามกลุ่มอายุ (Health Risk by Age)
              </h3>
            </div>
            <span className="text-xs text-slate-400">แสดงจำนวนคน</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByAgeData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="group" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700">
                          <p className="font-semibold text-rose-300 border-b border-slate-700 pb-1 mb-1">
                            ช่วงอายุ: {label}
                          </p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center justify-between gap-3 text-[11px] py-0.5">
                              <span style={{ color: entry.color }}>● เสี่ยง{entry.name}:</span>
                              <span className="font-bold font-['Plus_Jakarta_Sans']">{entry.value} คน</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="ต่ำ" name="เสี่ยงต่ำ" stackId="a" fill={RISK_COLORS['ต่ำ']}>
                  <LabelList dataKey="ต่ำ" position="center" fill="#ffffff" fontSize={10} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="ปานกลาง" name="เสี่ยงปานกลาง" stackId="a" fill={RISK_COLORS['ปานกลาง']}>
                  <LabelList dataKey="ปานกลาง" position="center" fill="#ffffff" fontSize={10} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="สูง" name="เสี่ยงสูง" stackId="a" fill={RISK_COLORS['สูง']}>
                  <LabelList dataKey="สูง" position="center" fill="#ffffff" fontSize={10} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            * ตัวเลขในแท่งกราฟแสดงจำนวนผู้คัดกรองในแต่ละระดับเสี่ยงของกลุ่มอายุนั้น
          </p>
        </div>

        {/* Chart 3: Grouped Bar - Risk by Gender */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                กลุ่มเสี่ยงตามเพศ (ชาย vs หญิง)
              </h3>
            </div>
            <span className="text-xs text-slate-400">เปรียบเทียบสัดส่วน</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByGenderData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="gender" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700">
                          <p className="font-semibold text-rose-300 border-b border-slate-700 pb-1 mb-1">
                            เพศ: {label}
                          </p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center justify-between gap-3 text-[11px] py-0.5">
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
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="ต่ำ" name="เสี่ยงต่ำ" fill={RISK_COLORS['ต่ำ']} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="ต่ำ" position="top" fill="#334155" fontSize={11} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="ปานกลาง" name="เสี่ยงปานกลาง" fill={RISK_COLORS['ปานกลาง']} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="ปานกลาง" position="top" fill="#334155" fontSize={11} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="สูง" name="เสี่ยงสูง" fill={RISK_COLORS['สูง']} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="สูง" position="top" fill="#334155" fontSize={11} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            * ตัวเลขบนแท่งกราฟระบุจำนวนคนในแต่ละระดับความเสี่ยง
          </p>
        </div>

        {/* Chart 4: Risk by Area */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                กลุ่มเสี่ยงตามพื้นที่ (Health Risk by Area)
              </h3>
            </div>
            <span className="text-xs text-slate-400">{riskByAreaData.length} พื้นที่</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByAreaData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="area" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-700">
                          <p className="font-semibold text-rose-300 border-b border-slate-700 pb-1 mb-1">
                            พื้นที่: {label}
                          </p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center justify-between gap-3 text-[11px] py-0.5">
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
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="ต่ำ" name="เสี่ยงต่ำ" stackId="area" fill={RISK_COLORS['ต่ำ']}>
                  <LabelList dataKey="ต่ำ" position="center" fill="#ffffff" fontSize={10} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="ปานกลาง" name="เสี่ยงปานกลาง" stackId="area" fill={RISK_COLORS['ปานกลาง']}>
                  <LabelList dataKey="ปานกลาง" position="center" fill="#ffffff" fontSize={10} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="สูง" name="เสี่ยงสูง" stackId="area" fill={RISK_COLORS['สูง']}>
                  <LabelList dataKey="สูง" position="center" fill="#ffffff" fontSize={10} fontWeight="bold" formatter={(v: any) => v > 0 ? v : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            * การกระจายตัวของกลุ่มเสี่ยงในแต่ละพื้นที่เพื่อวางแผนลงตรวจสุขภาพเฉพาะจุด
          </p>
        </div>
      </div>
    </div>
  );
};
