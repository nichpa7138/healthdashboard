import React, { useState, useMemo } from 'react';
import { 
  TableProperties, 
  Download, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { HealthRecord } from '../types';
import { PatientDetailModal } from './PatientDetailModal';

interface DataTableProps {
  records: HealthRecord[];
  onExportCsv: () => void;
}

type SortField = 'id' | 'date' | 'area' | 'gender' | 'age' | 'bmi' | 'sbp' | 'fbs' | 'riskScore' | 'riskLevel';
type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ records, onExportCsv }) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [quickRiskFilter, setQuickRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<HealthRecord | null>(null);

  // Quick risk tab filter
  const filteredRecords = useMemo(() => {
    if (quickRiskFilter === 'all') return records;
    return records.filter(r => r.riskLevel === quickRiskFilter);
  }, [records, quickRiskFilter]);

  // Sorting
  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB, 'th') 
          : valB.localeCompare(valA, 'th');
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [filteredRecords, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-rose-600" />
      : <ArrowDown className="w-3 h-3 text-rose-600" />;
  };

  // Row color strip and styling based on risk level
  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'สูง':
        return {
          rowBorder: 'border-l-4 border-l-rose-500 hover:bg-rose-50/50',
          badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
          label: 'เสี่ยงสูง (High)',
        };
      case 'ปานกลาง':
        return {
          rowBorder: 'border-l-4 border-l-amber-500 hover:bg-amber-50/40',
          badge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
          icon: <Shield className="w-3.5 h-3.5 text-amber-600" />,
          label: 'เสี่ยงปานกลาง (Medium)',
        };
      default:
        return {
          rowBorder: 'border-l-4 border-l-emerald-500 hover:bg-emerald-50/30',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'เสี่ยงต่ำ (Low)',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-xs p-4 sm:p-5 mb-10" id="table-section">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TableProperties className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-['Prompt']">
                ตารางแสดงรายละเอียดข้อมูลคัดกรองรายบุคคล (Data Table)
              </h2>
              <p className="text-xs text-slate-500">
                จำแนกแถบสีตามระดับกลุ่มเสี่ยง แดง (สูง) เหลือง (ปานกลาง) เขียว (ต่ำ)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Risk Filter Tabs */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 text-xs">
            <button
              onClick={() => { setQuickRiskFilter('all'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                quickRiskFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({records.length})
            </button>
            <button
              onClick={() => { setQuickRiskFilter('สูง'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                quickRiskFilter === 'สูง'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              เสี่ยงสูง ({records.filter(r => r.riskLevel === 'สูง').length})
            </button>
            <button
              onClick={() => { setQuickRiskFilter('ปานกลาง'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                quickRiskFilter === 'ปานกลาง'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              เสี่ยงปานกลาง ({records.filter(r => r.riskLevel === 'ปานกลาง').length})
            </button>
            <button
              onClick={() => { setQuickRiskFilter('ต่ำ'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                quickRiskFilter === 'ต่ำ'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              เสี่ยงต่ำ ({records.filter(r => r.riskLevel === 'ต่ำ').length})
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-rose-50 border border-rose-200 transition shadow-2xs cursor-pointer"
            title="ส่งออกไฟล์ข้อมูลเป็น CSV"
          >
            <Download className="w-3.5 h-3.5 text-rose-500" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto mt-4 rounded-xl border border-slate-200/80">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50/90 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
            <tr>
              <th scope="col" className="px-3.5 py-3 text-left">
                <button 
                  onClick={() => handleSort('id')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  รหัสบุคคล {getSortIcon('id')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('date')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  วันที่ {getSortIcon('date')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('area')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  พื้นที่ {getSortIcon('area')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('gender')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  เพศ / อายุ {getSortIcon('gender')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('bmi')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  BMI {getSortIcon('bmi')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('sbp')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  ความดัน (SBP/DBP) {getSortIcon('sbp')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('fbs')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  น้ำตาล (FBS) {getSortIcon('fbs')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">พฤติกรรม</th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('riskScore')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  คะแนน {getSortIcon('riskScore')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left">
                <button 
                  onClick={() => handleSort('riskLevel')} 
                  className="flex items-center gap-1 hover:text-rose-600 cursor-pointer"
                >
                  ระดับความเสี่ยง {getSortIcon('riskLevel')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-center">ดูข้อมูล</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลคัดกรองตามเงื่อนไขตัวกรองปัจจุบัน
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => {
                const riskStyles = getRiskStyles(record.riskLevel);
                return (
                  <tr 
                    key={record.id}
                    onClick={() => setSelectedPatient(record)}
                    className={`transition-colors cursor-pointer ${riskStyles.rowBorder}`}
                  >
                    {/* ID */}
                    <td className="px-3.5 py-3 font-semibold text-slate-900 font-['Plus_Jakarta_Sans'] whitespace-nowrap">
                      {record.id}
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-['Plus_Jakarta_Sans']">
                      {record.date}
                    </td>

                    {/* Area */}
                    <td className="px-3 py-3 text-slate-700 whitespace-nowrap font-medium">
                      {record.area}
                    </td>

                    {/* Gender & Age */}
                    <td className="px-3 py-3 text-slate-800 whitespace-nowrap">
                      <span className="font-medium">{record.gender}</span>, {record.age} ปี
                    </td>

                    {/* BMI */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`font-semibold font-['Plus_Jakarta_Sans'] ${
                        record.bmi >= 25 ? 'text-rose-600' : 'text-slate-800'
                      }`}>
                        {record.bmi}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {record.height}cm / {record.weight}kg
                      </span>
                    </td>

                    {/* Blood Pressure */}
                    <td className="px-3 py-3 whitespace-nowrap font-['Plus_Jakarta_Sans']">
                      <span className={`font-semibold ${
                        record.sbp >= 140 || record.dbp >= 90 ? 'text-rose-600' : 'text-slate-800'
                      }`}>
                        {record.sbp}/{record.dbp}
                      </span>
                      <span className="text-[10px] text-slate-400 block">ชีพจร {record.pulse}</span>
                    </td>

                    {/* FBS */}
                    <td className="px-3 py-3 whitespace-nowrap font-['Plus_Jakarta_Sans']">
                      <span className={`font-semibold ${
                        record.fbs >= 126 ? 'text-rose-600 font-bold' : record.fbs >= 100 ? 'text-amber-600' : 'text-slate-800'
                      }`}>
                        {record.fbs}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">mg/dL</span>
                    </td>

                    {/* Behaviors */}
                    <td className="px-3 py-3 whitespace-nowrap text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          record.smoking === 'สูบ' ? 'bg-rose-100 text-rose-700 font-medium' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {record.smoking === 'สูบ' ? 'บุหรี่' : 'ไม่สูบ'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          record.alcohol === 'ดื่ม' ? 'bg-rose-100 text-rose-700 font-medium' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {record.alcohol === 'ดื่ม' ? 'สุรา' : 'ไม่ดื่ม'}
                        </span>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="px-3 py-3 whitespace-nowrap text-center font-bold font-['Plus_Jakarta_Sans'] text-slate-800">
                      {record.riskScore}
                    </td>

                    {/* Risk Level Badge */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${riskStyles.badge}`}>
                        {riskStyles.icon}
                        <span>{riskStyles.label}</span>
                      </span>
                    </td>

                    {/* View Button */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(record);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        title="ดูรายละเอียดผลการคัดกรอง"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>แสดง</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden"
          >
            <option value={10}>10 รายการ</option>
            <option value={20}>20 รายการ</option>
            <option value={30}>30 รายการ</option>
            <option value={50}>50 รายการ</option>
          </select>
          <span>จากทั้งหมด {sortedRecords.length} รายการ</span>
        </div>

        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-medium text-slate-700 font-['Plus_Jakarta_Sans']">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        record={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
};
