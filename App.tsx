
import React, { useState, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import { beneficiaries } from './data/beneficiaries';
import { Beneficiary, SearchFilters } from './types';
import StatsCard from './components/StatsCard';
import { Search, Phone, Map, MapPin, ChevronRight, UserCircle, SearchX, Printer, Image as ImageIcon, Download, Share2, Smartphone, ShieldCheck, BadgeCheck } from 'lucide-react';
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
    return Array.from(new Set(filteredVillages)).sort();
  }, [filters.union]);

  // Filtering Logic
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      const cleanInput = filters.phone.replace(/\D/g, '');
      const cleanData = b.phone.replace(/\D/g, '');
      
      const matchPhone = cleanInput === '' || cleanData.includes(cleanInput);
      const matchUnion = filters.union === '' || b.union === filters.union;
      const matchVillage = filters.village === '' || b.village === filters.village;
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
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Assunnah-Beneficiary-List-${new Date().getTime()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('ইমেজ জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 fade-in">
        {/* Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
          <StatsCard label="মোট আবেদনকারী" value={beneficiaries.length} type="users" />
          <StatsCard label="খুঁজে পাওয়া গেছে" value={filteredBeneficiaries.length} type="users" />
          <StatsCard label="মোট ইউনিয়ন" value={unions.length} type="union" />
          <StatsCard label="মোট গ্রাম" value={villages.length} type="village" />
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-100 p-8 no-print hover-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Search size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">তথ্য সন্ধান করুন</h2>
                <p className="text-slate-500 font-medium text-sm">উপজেলাঃ দুর্গাপুর, জেলাঃ রাজশাহী</p>
              </div>
            </div>
            
            {(filters.phone || filters.union || filters.village) && (
              <button
                onClick={() => setFilters({ phone: '', union: '', village: '' })}
                className="text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-full transition-colors flex items-center gap-2 self-start md:self-center"
              >
                <SearchX size={16} /> সকল ফিল্টার মুছুন
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Search */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                <Phone size={16} className="text-emerald-600" /> মোবাইল নম্বর
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="উদাঃ 01700000000"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
                  value={filters.phone}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Union Filter */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                <Map size={16} className="text-blue-600" /> ইউনিয়ন
              </label>
              <select
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                value={filters.union}
                onChange={(e) => handleFilterChange('union', e.target.value)}
              >
                <option value="">সকল ইউনিয়ন</option>
                {unions.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            {/* Village Filter */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                <MapPin size={16} className="text-orange-600" /> গ্রাম / পাড়া
              </label>
              <select
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                value={filters.village}
                onChange={(e) => handleFilterChange('village', e.target.value)}
              >
                <option value="">সকল গ্রাম</option>
                {villages.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 no-print bg-emerald-900 p-6 rounded-3xl shadow-lg">
          <div className="text-white">
            <h3 className="text-xl font-bold">উপকারভোগীর তালিকা ২০২৬</h3>
            <p className="text-emerald-200 text-xs font-semibold opacity-80">বর্তমান সিলেকশনে মোট {filteredBeneficiaries.length} জন সদস্য পাওয়া গেছে</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-900 rounded-2xl hover:bg-emerald-50 transition-all font-black shadow-md active:scale-95"
            >
              <Printer size={18} /> প্রিন্ট / PDF
            </button>
            <button 
              onClick={handleDownloadJPG}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-black shadow-md active:scale-95 disabled:opacity-50"
            >
              <ImageIcon size={18} /> {isExporting ? 'তৈরি হচ্ছে...' : 'JPG ডাউনলোড'}
            </button>
          </div>
        </div>

        {/* Results Table Section */}
        <div ref={tableRef} className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden fade-in relative">
          {/* Print Header */}
          <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center print-only">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-emerald-900 uppercase">আস-সুন্নাহ ফাউন্ডেশন</h2>
                <p className="text-slate-600 font-bold text-lg">ইফতার বিতরণ প্রকল্প - ২০২৬ | দুর্গাপুর, রাজশাহী</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm font-bold">তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
              <p className="text-2xl font-black text-slate-800 mt-1">মোট সদস্য: {filteredBeneficiaries.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredBeneficiaries.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50/80 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-left">আইডি</th>
                    <th className="px-8 py-5 text-left">সদস্যের নাম</th>
                    <th className="px-8 py-5 text-left">মোবাইল নম্বর</th>
                    <th className="px-8 py-5 text-left">শ্রেণী ও পেশা</th>
                    <th className="px-8 py-5 text-left">ইউনিয়ন ও গ্রাম</th>
                    <th className="px-8 py-5 text-left">দৈনিক আয়</th>
                    <th className="px-8 py-5 no-print text-center">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {filteredBeneficiaries.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-emerald-50/40 transition-all duration-300 group cursor-default">
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter bg-slate-50 px-2 py-1 rounded">#{b.id.split('-').pop()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-sm no-print group-hover:rotate-6 transition-transform">
                            {b.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-black text-slate-800 text-lg block leading-none">{b.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 inline-block no-print">উপকারভোগী</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-emerald-700 font-black text-lg flex items-center gap-2">
                           <Phone size={14} className="opacity-40 no-print" /> 0{b.phone}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase w-fit">
                            {b.category}
                          </span>
                          <span className="text-slate-500 text-sm font-bold">{b.profession}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-700">{b.union}</span>
                          <span className="text-slate-500 text-xs font-bold flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-emerald-500" /> {b.village}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 no-print"></span>
                          <span className="font-black text-slate-900 text-lg">{b.income}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 no-print text-center">
                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all active:scale-90">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-slate-400 no-print">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <SearchX size={48} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-700 mb-2">কোন তথ্য খুঁজে পাওয়া যায়নি!</h3>
                <p className="text-slate-500 font-bold">অনুগ্রহ করে মোবাইল নম্বর বা ইউনিয়ন ফিল্টার পরিবর্তন করুন।</p>
                <button 
                  onClick={() => setFilters({ phone: '', union: '', village: '' })}
                  className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  পুনরায় শুরু করুন
                </button>
              </div>
            )}
          </div>
          
          {/* Export Footer - Volunteer Authentication */}
          <div className="p-12 bg-slate-50/80 border-t-4 border-emerald-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl border-4 border-white overflow-hidden shadow-2xl bg-white shrink-0 relative">
                  <img 
                    src="https://raw.githubusercontent.com/Anisur-07/Assunnah-Foundation/main/IMG_20250221_112028.png" 
                    alt="Sakibul Islam Sabbir" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-emerald-500 p-1 rounded-lg text-white">
                    <BadgeCheck size={14} />
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <h4 className="text-2xl font-black text-slate-800">Sakibul Islam Sabbir</h4>
                  <p className="text-emerald-700 font-black text-lg flex items-center gap-2">
                    <ShieldCheck size={18} className="fill-emerald-100" /> Assunnah Volunteer
                  </p>
                  <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                    <MapPin size={14} /> Project Area: Durgapur, Rajshahi
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-end gap-3">
                <div className="flex gap-4">
                  <div className="bg-white px-5 py-3 rounded-2xl border-2 border-slate-100 shadow-sm text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Area Code</p>
                    <p className="text-2xl font-black text-slate-800">204</p>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl border-2 border-slate-100 shadow-sm text-right min-w-[180px]">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Designation</p>
                    <p className="text-lg font-black text-emerald-800">Upazila Representative</p>
                  </div>
                </div>
                <div className="text-right mt-2 no-print">
                   <p className="text-[10px] text-slate-400 font-bold">Verified by As-Sunnah Foundation Compliance</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-10 border-t-2 border-slate-200/50 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="text-left">
                <div className="w-48 h-1 bg-slate-200 mb-3 rounded-full"></div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Volunteer Signature</p>
                <p className="text-slate-800 font-bold text-sm mt-1">S. I. Sabbir</p>
              </div>
              <div className="text-center pb-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2">Authenticated Digital Document</p>
                <div className="flex items-center justify-center gap-4 text-slate-200">
                  <MapPin size={24} />
                  <Smartphone size={24} />
                  <ShieldCheck size={24} />
                </div>
              </div>
              <div className="text-right">
                <div className="w-48 h-1 bg-slate-200 mb-3 rounded-full ml-auto"></div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Official Authority Seal</p>
                <p className="text-emerald-900 font-black text-sm mt-1 uppercase">ASF Project-204</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid with New Muslim Boy Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 no-print">
          <div className="lg:col-span-2 bg-emerald-900 text-white p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center gap-12">
            {/* Custom SVG Vector Illustration: Muslim Boy with iPhone */}
            <div className="shrink-0 w-full md:w-72 aspect-square relative group cursor-pointer">
               <div className="absolute inset-0 bg-emerald-800 rounded-[3rem] transform rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl"></div>
               <div className="absolute inset-0 bg-white rounded-[3rem] p-6 flex items-center justify-center shadow-lg border-2 border-emerald-100 overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Stylized Modern Muslim Boy Character SVG */}
                    <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xl">
                      {/* Face Shape */}
                      <circle cx="100" cy="80" r="50" fill="#fbcfe8" />
                      {/* Beard Style */}
                      <path d="M50 80 Q50 140 100 145 Q150 140 150 80" fill="#1f2937" />
                      {/* Face Inner */}
                      <circle cx="100" cy="75" r="42" fill="#ffedd5" />
                      {/* Eyes */}
                      <circle cx="85" cy="70" r="3" fill="#1f2937" />
                      <circle cx="115" cy="70" r="3" fill="#1f2937" />
                      {/* Prayer Cap (Kufi) */}
                      <path d="M50 70 Q50 30 100 30 Q150 30 150 70" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                      <path d="M60 45 L140 45" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 2" />
                      {/* Body */}
                      <path d="M40 140 Q40 190 100 190 Q160 190 160 140 L160 200 L40 200 Z" fill="#10b981" />
                      {/* iPhone Representation */}
                      <g transform="translate(110, 110) rotate(10)">
                        <rect x="0" y="0" width="40" height="75" rx="6" fill="#1f2937" />
                        <rect x="3" y="3" width="34" height="69" rx="3" fill="#0f172a" />
                        <circle cx="20" cy="65" r="4" fill="#334155" /> {/* Home button area style */}
                        {/* iPhone Screen Content */}
                        <rect x="8" y="10" width="24" height="4" rx="1" fill="#10b981" opacity="0.8" />
                        <rect x="8" y="18" width="18" height="4" rx="1" fill="#ffffff" opacity="0.4" />
                      </g>
                    </svg>
                    {/* Glowing effect around phone */}
                    <div className="absolute bottom-10 right-10 w-20 h-20 bg-emerald-400/20 blur-xl animate-pulse"></div>
                  </div>
               </div>
               <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest border-2 border-white">
                  Smart Tech
               </div>
            </div>

            <div className="relative z-10 text-center md:text-left flex-1">
              <span className="inline-block px-4 py-1.5 bg-emerald-700 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">Digital Muslim Community</span>
              <h3 className="text-5xl font-black mb-8 leading-[1.1]">ডিজিটাল প্রযুক্তিতে <br/> আধুনিক সেবামূলক সেবা</h3>
              <p className="text-emerald-100 text-xl font-medium max-w-xl mb-10 leading-relaxed opacity-95">
                আমরা বিশ্বাস করি আধুনিক প্রযুক্তি ব্যবহারের মাধ্যমে আস-সুন্নাহ ফাউন্ডেশনের প্রতিটি কার্যক্রম আরও স্বচ্ছ এবং দ্রুততর হবে। একজন আদর্শ মুসলিম হিসেবে আমরা প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে মানবতার সেবা করছি।
              </p>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="bg-white/10 backdrop-blur-xl px-8 py-5 rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all">
                  <p className="text-3xl font-black tracking-tighter">Verified</p>
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mt-1">Smart Tracking</p>
                </div>
                <div className="bg-emerald-500 shadow-2xl shadow-emerald-400 px-8 py-5 rounded-[2rem] border border-emerald-400 transition-all hover:scale-105 active:scale-95">
                  <p className="text-3xl font-black tracking-tighter">Modern</p>
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">Social Impact</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-50 p-12 rounded-[3.5rem] shadow-xl hover-glow flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-10 border-b border-slate-100 pb-6 flex items-center gap-3">
                <Smartphone size={28} className="text-emerald-500" /> ডিজিটাল গাইড
              </h3>
              <ul className="space-y-8">
                {[
                  "উপকারভোগীর তথ্য যাচাই করার সময় অত্যন্ত ধৈর্য ও বিনয়ের সাথে কথা বলুন।",
                  "স্মার্টফোনের মাধ্যমে কিউআর কোড বা মোবাইল নম্বর দ্রুত সার্চ করে সঠিক ব্যক্তি নিশ্চিত করুন।",
                  "যেকোনো অসঙ্গতি দেখা দিলে ডিজিটাল পোর্টালের মাধ্যমে তাৎক্ষণিক ফিডব্যাক প্রদান করুন।"
                ].map((text, idx) => (
                  <li key={idx} className="flex gap-6 group">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      {idx + 1}
                    </div>
                    <p className="text-slate-600 text-lg font-bold leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <button className="mt-12 w-full py-5 bg-emerald-50 text-emerald-700 rounded-3xl font-black hover:bg-emerald-100 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm shadow-sm">
              <Share2 size={20} /> ডিজিটাল গাইড বুক
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
