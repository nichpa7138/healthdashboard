/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { KPICards } from './components/KPICards';
import { RiskCharts } from './components/RiskCharts';
import { TrendBehaviorCharts } from './components/TrendBehaviorCharts';
import { DataTable } from './components/DataTable';
import { fetchHealthRecords, DEFAULT_SHEET_ID } from './services/sheetService';
import { HealthRecord, FilterState } from './types';
import { calculateKPIs } from './utils/healthCalculations';
import { FALLBACK_RECORDS } from './data/initialData';
import { Activity, ShieldCheck, AlertCircle, FileSpreadsheet } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  area: 'all',
  gender: 'all',
  ageRange: 'all',
  riskLevel: 'all',
  smoking: 'all',
  alcohol: 'all',
  exercise: 'all',
  diabetes: 'all',
  hypertension: 'all',
};

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(FALLBACK_RECORDS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [source, setSource] = useState<string>('initializing');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [activeSection, setActiveSection] = useState<string>('overview-section');

  // Load data from Google Sheet
  const loadData = useCallback(async (force = false) => {
    setIsSyncing(true);
    try {
      const result = await fetchHealthRecords(DEFAULT_SHEET_ID, force);
      if (result.records && result.records.length > 0) {
        setRecords(result.records);
        setLastUpdated(result.lastUpdated);
        setSource(result.source);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Real-time polling timer (every 30 seconds when enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Unique areas from current dataset
  const areaOptions = useMemo(() => {
    const set = new Set(records.map((r) => r.area));
    return Array.from(set).filter(Boolean).sort();
  }, [records]);

  // Filter handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesId = r.id.toLowerCase().includes(query);
        const matchesArea = r.area.toLowerCase().includes(query);
        const matchesRisk = r.riskLevel.toLowerCase().includes(query);
        if (!matchesId && !matchesArea && !matchesRisk) return false;
      }

      // Area
      if (filters.area !== 'all' && r.area !== filters.area) {
        return false;
      }

      // Gender
      if (filters.gender !== 'all' && r.gender !== filters.gender) {
        return false;
      }

      // Age Range
      if (filters.ageRange !== 'all') {
        if (filters.ageRange === '<35' && r.age >= 35) return false;
        if (filters.ageRange === '35-49' && (r.age < 35 || r.age > 49)) return false;
        if (filters.ageRange === '50-59' && (r.age < 50 || r.age > 59)) return false;
        if (filters.ageRange === '60+' && r.age < 60) return false;
      }

      // Risk Level
      if (filters.riskLevel !== 'all' && r.riskLevel !== filters.riskLevel) {
        return false;
      }

      // Smoking
      if (filters.smoking !== 'all') {
        const isSmoker = r.smoking.includes('สูบ') && !r.smoking.includes('ไม่');
        if (filters.smoking === 'สูบ' && !isSmoker) return false;
        if (filters.smoking === 'ไม่สูบ' && isSmoker) return false;
      }

      // Alcohol
      if (filters.alcohol !== 'all') {
        const isDrinker = r.alcohol.includes('ดื่ม') && !r.alcohol.includes('ไม่');
        if (filters.alcohol === 'ดื่ม' && !isDrinker) return false;
        if (filters.alcohol === 'ไม่ดื่ม' && isDrinker) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(filteredRecords);
  }, [filteredRecords]);

  // Export filtered data to CSV
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) return;

    const headers = [
      'ลำดับ',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน',
    ];

    const rows = filteredRecords.map((r, index) => [
      index + 1,
      `"${r.date}"`,
      `"${r.area}"`,
      `"${r.gender}"`,
      r.age,
      r.height,
      r.weight,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.fbs,
      `"${r.smoking}"`,
      `"${r.alcohol}"`,
      `"${r.exercise}"`,
      `"${r.diabetesScreen}"`,
      `"${r.hypertensionScreen}"`,
      r.riskScore,
      `"${r.riskLevel}"`,
      `"${r.month}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `health_screening_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Smooth scroll navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      const yOffset = -120;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-800 font-['Prompt',sans-serif]">
      {/* 1. Header & Navigation Controls */}
      <Header
        sheetId={DEFAULT_SHEET_ID}
        lastUpdated={lastUpdated}
        isSyncing={isSyncing}
        onRefresh={() => loadData(true)}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
        source={source}
        totalRecords={records.length}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Filters */}
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          areaOptions={areaOptions}
          totalRecords={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* 2. KPI Summary Cards */}
        <KPICards kpis={kpis} />

        {/* 3. Visualizations / Charts - Part 1: Health Risk */}
        <RiskCharts records={filteredRecords} />

        {/* 3. Visualizations / Charts - Part 2: Trend & Health Behavior */}
        <TrendBehaviorCharts records={filteredRecords} />

        {/* 4. Detail View / Data Table */}
        <DataTable
          records={filteredRecords}
          onExportCsv={handleExportCsv}
        />
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-rose-100 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">
              Dashboard รายงานสรุปผลคัดกรองสุขภาพ
            </span>
            <span>• เชื่อมโยงข้อมูล Google Sheets ID 1pgK6yyaLxknSt_p1j0nY88lMMxbfkS7kyty4ltl_R7Y</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>สถานะระบบ: เชื่อมต่อ Real-time สมบูรณ์</span>
            <span>•</span>
            <a
              href={`https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>เปิด Google Sheet</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
