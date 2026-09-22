import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  MapPin, 
  Users, 
  Flame, 
  Cigarette, 
  Wine, 
  HeartHandshake,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  areaOptions: string[];
  totalRecords: number;
  filteredCount: number;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  areaOptions,
  totalRecords,
  filteredCount,
}) => {
  const isFiltered = 
    filters.search !== '' ||
    filters.area !== 'all' ||
    filters.gender !== 'all' ||
    filters.ageRange !== 'all' ||
    filters.riskLevel !== 'all' ||
    filters.smoking !== 'all' ||
    filters.alcohol !== 'all' ||
    filters.exercise !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-rose-100/90 p-4 sm:p-5 shadow-xs shadow-rose-100/50 mb-6">
      {/* Filters Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-rose-100/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>ระบบคัดกรองข้อมูล (Control Filters)</span>
              <span className="text-xs font-normal text-slate-500">
                (แสดง {filteredCount} จาก {totalRecords} ราย)
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}

          {/* Quick Search */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="ค้นหารหัสบุคคล / พื้นที่..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3.5">
        {/* 1. Area */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>พื้นที่ (Area)</span>
          </label>
          <div className="relative">
            <select
              value={filters.area}
              onChange={(e) => onFilterChange('area', e.target.value)}
              className="w-full appearance-none text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl px-3 py-2 pr-7 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition"
            >
              <option value="all">ทุกพื้นที่</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 2. Gender */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-rose-500" />
            <span>เพศ (Gender)</span>
          </label>
          <div className="relative">
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange('gender', e.target.value)}
              className="w-full appearance-none text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl px-3 py-2 pr-7 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition"
            >
              <option value="all">ทุกเพศ</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 3. Age Range */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <HeartHandshake className="w-3 h-3 text-rose-500" />
            <span>ช่วงอายุ (Age)</span>
          </label>
          <div className="relative">
            <select
              value={filters.ageRange}
              onChange={(e) => onFilterChange('ageRange', e.target.value)}
              className="w-full appearance-none text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl px-3 py-2 pr-7 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition"
            >
              <option value="all">ทุกช่วงอายุ</option>
              <option value="<35">&lt; 35 ปี</option>
              <option value="35-49">35 - 49 ปี</option>
              <option value="50-59">50 - 59 ปี</option>
              <option value="60+">60 ปีขึ้นไป</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 4. Risk Level */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-500" />
            <span>ระดับเสี่ยง (Risk)</span>
          </label>
          <div className="relative">
            <select
              value={filters.riskLevel}
              onChange={(e) => onFilterChange('riskLevel', e.target.value)}
              className="w-full appearance-none text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl px-3 py-2 pr-7 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition font-medium"
            >
              <option value="all">ทุกระดับเสี่ยง</option>
              <option value="ต่ำ">🟢 เสี่ยงต่ำ (Low)</option>
              <option value="ปานกลาง">🟡 เสี่ยงปานกลาง (Medium)</option>
              <option value="สูง">🔴 เสี่ยงสูง (High)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 5. Smoking */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Cigarette className="w-3 h-3 text-rose-500" />
            <span>สูบบุหรี่ (Smoking)</span>
          </label>
          <div className="relative">
            <select
              value={filters.smoking}
              onChange={(e) => onFilterChange('smoking', e.target.value)}
              className="w-full appearance-none text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl px-3 py-2 pr-7 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition"
            >
              <option value="all">ทั้งหมด</option>
              <option value="สูบ">สูบ</option>
              <option value="ไม่สูบ">ไม่สูบ</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* 6. Alcohol */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Wine className="w-3 h-3 text-rose-500" />
            <span>ดื่มแอลกอฮอล์ (Alcohol)</span>
          </label>
          <div className="relative">
            <select
              value={filters.alcohol}
              onChange={(e) => onFilterChange('alcohol', e.target.value)}
              className="w-full appearance-none text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-rose-200/80 rounded-xl px-3 py-2 pr-7 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition"
            >
              <option value="all">ทั้งหมด</option>
              <option value="ดื่ม">ดื่ม</option>
              <option value="ไม่ดื่ม">ไม่ดื่ม</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      {/* Active Quick Filter Chips */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-rose-50 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">ตัวกรองที่เลือก:</span>
          {filters.area !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              พื้นที่: {filters.area}
              <button onClick={() => onFilterChange('area', 'all')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
          {filters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              เพศ: {filters.gender}
              <button onClick={() => onFilterChange('gender', 'all')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
          {filters.ageRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              อายุ: {filters.ageRange}
              <button onClick={() => onFilterChange('ageRange', 'all')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
          {filters.riskLevel !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              เสี่ยง: {filters.riskLevel}
              <button onClick={() => onFilterChange('riskLevel', 'all')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
          {filters.smoking !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              บุหรี่: {filters.smoking}
              <button onClick={() => onFilterChange('smoking', 'all')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
          {filters.alcohol !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              แอลกอฮอล์: {filters.alcohol}
              <button onClick={() => onFilterChange('alcohol', 'all')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[11px]">
              ค้นหา: "{filters.search}"
              <button onClick={() => onFilterChange('search', '')} className="hover:text-rose-950 font-bold ml-0.5 cursor-pointer">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
