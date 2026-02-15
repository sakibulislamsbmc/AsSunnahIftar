
export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  category: string; // শ্রেণী (e.g., বিধবা, হতদরিদ্র)
  profession: string; // পেশা
  income: string; // দৈনিক আয় (with ৳ symbol)
  union: string; // ইউনিয়ন
  village: string; // গ্রাম
}

export interface SearchFilters {
  phone: string;
  union: string;
  village: string;
}
