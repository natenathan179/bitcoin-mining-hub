// Shared article types — safe to import from client code (types only, no data).
export interface BlogSection {
  h2: string;
  paras: string[];
}
export interface BlogFaq {
  q: string;
  a: string;
}
export interface BlogMatch {
  brands?: string[];
  condition?: string;
  terms?: string[];
  maxPrice?: number;
}
export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  categoryId: string;
  date: string;
  description: string;
  keywords: string[];
  intro: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
  match: BlogMatch;
  readMinutes: number;
}
