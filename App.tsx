
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout.tsx';
import { beneficiaries } from './data/beneficiaries.ts';
import { Beneficiary, SearchFilters } from './types.ts';
import StatsCard from './components/StatsCard.tsx';
import { 
  Search, Phone, Map, MapPin, ChevronRight, 
  UserCircle, SearchX, Printer, Image as ImageIcon, 
  Download, Share2, Smartphone, ShieldCheck, BadgeCheck 
} from 'lucide-react';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    phone: '',
    union: '',
    village: ''
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Extract unique unions and villages
  const unions = useMemo(() => Array.from(new Set(beneficiaries.map(b => b.union))).sort(), []);
  const villages = useMemo(() => {
    const filteredVillages = filters.union 
      ? beneficiaries.filter(b => b.union === filters.union).map(b => b.village)
      : beneficiaries.map(b => b.village);
    return Array.from(new Set(filteredVillages.map(v => v.trim().replace(/[।]/g, '')))).sort();
  }, [filters.union]);

  // Filtering Logic
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      const cleanInput = filters.phone.replace(/\D/g, '');
      const cleanData = b.phone.replace(/\D/g, '');
      
      const matchPhone = cleanInput === '' || cleanData.includes(cleanInput);
      const matchUnion = filters.union === '' || b.union === filters.union;
      const matchVillage = filters.village === '' || b.village.includes(filters.village);
      return matchPhone && matchUnion && matchVillage;
    });
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'union') next.village = ''; 
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJPG = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);
    try {
      window.scrollTo(0, 0);
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Assunnah-Beneficiary-Report.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('ইমেজ জেনারেট করতে সমস্যা হয়েছে।');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
          <StatsCard label="মোট আবেদনকারী" value={beneficiaries.length} type="users" />
          <StatsCard label="খুঁজে পাওয়া গেছে" value={filteredBeneficiaries.length} type="users" />
          <StatsCard label="মোট ইউনিয়ন" value={unions.length} type="union" />
          <StatsCard label="মোট গ্রাম" value={villages.length} type="village" />
        </div>

        {/* Search & Filter Section */}
        <motion.div 
          whileHover={{ boxShadow: "0 10px 30px -10px rgb(16 185 129 / 0.1)" }}
          className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-100 p-8 no-print transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <Search size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">তথ্য সন্ধান করুন</h2>
                <p className="text-slate-500 font-bold text-sm">দুর্গাপুর উপজেলা, রাজশাহী</p>
              </div>
            </div>
            
            {(filters.phone || filters.union || filters.village) && (
              <button
                onClick={() => setFilters({ phone: '', union: '', village: '' })}
                className="text-xs font-black text-red-500 hover:bg-red-500 hover:text-white bg-red-50 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-red-100 uppercase tracking-widest"
              >
                <SearchX size={14} /> রিসেট ফিল্টার
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">মোবাইল নম্বর</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="017xxxxxxxx"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                  value={filters.phone}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ইউনিয়ন</label>
              <div className="relative">
                <select
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 appearance-none"
                  value={filters.union}
                  onChange={(e) => handleFilterChange('union', e.target.value)}
                >
                  <option value="">সকল ইউনিয়ন</option>
                  {unions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">গ্রাম / পাড়া</label>
              <div className="relative">
                <select
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 appearance-none"
                  value={filters.village}
                  onChange={(e) => handleFilterChange('village', e.target.value)}
                >
                  <option value="">সকল গ্রাম</option>
                  {villages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 no-print bg-emerald-900 p-6 rounded-[2rem] shadow-xl">
          <div className="text-white">
            <h3 className="text-lg font-bold">উপকারভোগীর তালিকা ২০২৬</h3>
            <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest opacity-80">নির্বাচিত সদস্য: {filteredBeneficiaries.length}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="px-6 py-3 bg-white text-emerald-900 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <Printer size={18} /> প্রিন্ট
            </button>
            <button 
              onClick={handleDownloadJPG}
              disabled={isExporting}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
              <ImageIcon size={18} /> {isExporting ? 'অপেক্ষা করুন...' : 'JPG ডাউনলোড'}
            </button>
          </div>
        </div>

        {/* Main Results Container */}
        <div ref={tableRef} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-10 border-b-2 border-slate-50 flex justify-between items-center print-only">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-emerald-700 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={40} />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-emerald-900 uppercase tracking-tighter">আস-সুন্নাহ ফাউন্ডেশন</h2>
                   <p className="text-slate-500 font-bold text-lg">ইফতার বিতরণ প্রকল্প - ২০২৬ | দুর্গাপুর, রাজশাহী</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Generated on: {new Date().toLocaleDateString()}</p>
                <p className="text-4xl font-black text-slate-800 mt-2">{filteredBeneficiaries.length} জন</p>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-left">আইডি</th>
                  <th className="px-8 py-6 text-left">নাম</th>
                  <th className="px-8 py-6 text-left">মোবাইল</th>
                  <th className="px-8 py-6 text-left">পেশা</th>
                  <th className="px-8 py-6 text-left">ইউনিয়ন ও গ্রাম</th>
                  <th className="px-8 py-6 text-left">আয়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredBeneficiaries.map((b) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={b.id} 
                      className="group hover:bg-emerald-50/40 transition-colors"
                    >
                      <td className="px-8 py-6 font-mono text-[10px] text-slate-400">#{b.id.slice(-6)}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black no-print">
                            {b.name.charAt(0)}
                          </div>
                          <span className="font-black text-slate-800 text-lg leading-none">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-emerald-700 text-lg">0{b.phone}</td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500">{b.profession}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-700">{b.union}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{b.village}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900">{b.income}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="p-12 bg-slate-50/80 border-t-4 border-emerald-600">
             <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-white shrink-0">
                      <img 
                        src="https://raw.githubusercontent.com/Anisur-07/Assunnah-Foundation/main/IMG_20250221_112028.png" 
                        alt="Volunteer" 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div className="text-left">
                      <h4 className="text-2xl font-black text-slate-800">Sakibul Islam Sabbir</h4>
                      <p className="text-emerald-700 font-black flex items-center gap-2">
                        <ShieldCheck size={18} /> Assunnah Volunteer
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Durgapur Representative | Area: 204</p>
                   </div>
                </div>
                <div className="text-right flex flex-col items-end gap-6">
                   <div className="w-48 h-0.5 bg-slate-300 mb-2"></div>
                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Official Signature & Seal</p>
                   <p className="text-emerald-900 font-black text-xs">PROJECT CODE: ASF-204-DGP</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default App;
