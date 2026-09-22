import React from 'react';
import { 
  Activity, 
  RefreshCw, 
  Clock, 
  ShieldCheck,
  BarChart3,
  TrendingUp,
  TableProperties
} from 'lucide-react';

interface HeaderProps {
  sheetId: string;
  lastUpdated: string;
  isSyncing: boolean;
  onRefresh: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  source: string;
  totalRecords: number;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  sheetId,
  lastUpdated,
  isSyncing,
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
  source,
  totalRecords,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-500 via-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-['Prompt']">
                  Dashboard รายงานสรุปผลคัดกรองสุขภาพ
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200">
                  Real-time Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                <span>เชื่อมโยงระบบข้อมูลสุขภาพเชิงรุกและคัดกรองโรคเรื้อรัง</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 font-medium">บันทึกทั้งหมด {totalRecords} ราย</span>
              </p>
            </div>
          </div>

          {/* Sync Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Real-time Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden md:inline">สถานะ: </span>
              <Clock className="w-3 h-3 text-emerald-600 ml-0.5" />
              <span>{lastUpdated || 'กำลังเชื่อมต่อ'}</span>
            </div>

            {/* Auto-Refresh Toggle */}
            <button
              onClick={onToggleAutoRefresh}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                autoRefresh
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="เปิด/ปิด การซิงค์ข้อมูลอัตโนมัติทุก 30 วินาที"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-rose-500' : 'bg-slate-400'}`} />
              <span>ซิงค์อัตโนมัติ {autoRefresh ? '30s' : 'ปิด'}</span>
            </button>

            {/* Manual Sync Button */}
            <button
              onClick={onRefresh}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:opacity-60 transition shadow-xs shadow-rose-200 cursor-pointer"
              title="ดึงข้อมูลล่าสุดจาก Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังซิงค์...' : 'รีเฟรชข้อมูล'}</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs (Single Page Anchor Navigation) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-2 border-t border-rose-100/80 text-xs sm:text-sm no-scrollbar">
          <button
            onClick={() => onNavigate('overview-section')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'overview-section'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. ภาพรวมตัวชี้วัด (KPIs)</span>
          </button>

          <button
            onClick={() => onNavigate('risk-section')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'risk-section'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. การวิเคราะห์กลุ่มเสี่ยง (Risk)</span>
          </button>

          <button
            onClick={() => onNavigate('trend-section')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'trend-section'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. แนวโน้ม & พฤติกรรมสุขภาพ</span>
          </button>

          <button
            onClick={() => onNavigate('table-section')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'table-section'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>4. รายละเอียดข้อมูลเชิงลึก ({totalRecords})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
