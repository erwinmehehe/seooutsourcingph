import Testimonials from "./Testimonials";
import extra0 from "./assets/glass.png";
import extra1 from "./assets/sunlover.svg";
import extra2 from "./assets/holdsworth.svg";
import extra3 from "./assets/newstead.svg";
import extra4 from "./assets/royal.png";
import extra5 from "./assets/endo.png";
import extra6 from "./assets/kiama.svg";
import extra7 from "./assets/lumina.png";
import extra8 from "./assets/madmiller.webp";
import extra9 from "./assets/mlr.webp";
import extra10 from "./assets/growers.png";
import brand1 from "./assets/maddens.svg";
import brand2 from "./assets/ivleague.svg";
import brand3 from "./assets/smile.png";
import brand4 from "./assets/katehill.png";
import brand5 from "./assets/lifestyle.png";
import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from "react";
import {
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

/* ---------- brand constants (all from seooutsourcingphilippines.com) ---------- */
const EMAIL = "info@seooutsourcingphilippines.com";
const CALENDLY = "https://calendly.com/discovery-call-with-erwin";
const CHECKED = "9 November 2026";

/* ---------- navigation ---------- */
const NAV = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/* ---------- hero chart (illustrative) ---------- */
type RangeKey = "3" | "6" | "12";
const RANGES: Record<RangeKey, { label: string; months: string[]; points: number[] }> = {
  "3": { label: "3 months", months: ["Oct", "Nov", "Dec"], points: [64, 70, 67, 76, 84, 81, 92, 103, 115] },
  "6": { label: "6 months", months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], points: [22, 31, 40, 37, 47, 52, 70, 67, 86, 96, 115] },
  "12": { label: "12 months", months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], points: [9, 11, 14, 13, 17, 20, 19, 24, 27, 26, 31, 36, 34, 41, 47, 52, 58, 66, 64, 78, 88, 97, 115] },
};
const BARS = [18, 26, 32, 40, 50, 60, 72, 86, 100];

/* ---------- services ---------- */
const SERVICES = [
  { title: "SEO strategy & keyword research", text: "Find the searches your customers use, compare competing pages and decide which pages to create or improve.", points: ["Keyword and topic research", "Competitor gap analysis", "Page and intent mapping"] },
  { title: "Technical SEO", text: "Identify the technical issues affecting how search engines find and understand your pages. Get prioritised fixes and implementation guidance.", points: ["Technical audits", "Indexation diagnostics", "Implementation guidance & retest"] },
  { title: "On-page SEO", text: "Improve existing pages with clearer titles, headings, copy and internal links, based on the searches each page should answer.", points: ["Page optimisation", "Internal linking", "Content refreshes"] },
  { title: "SEO content", text: "Plan, write or update service pages and articles. Briefs and reviews use your service details, audience and brand requirements.", points: ["Content briefs", "Service and landing pages", "Article optimisation"] },
  { title: "Local & international SEO", text: "Help customers find your business in the places you serve. Work can include local keyword research, location pages and business-profile recommendations.", points: ["Local search planning", "Location-page optimisation", "International SEO support"] },
  { title: "Authority & reporting", text: "Research relevant link opportunities and report on the work completed, changes in search performance and what to do next.", points: ["Link prospect research", "Performance reporting", "Executive summaries"] },
];

const MODELS = [
  { tag: "One-off work", title: "Project-based SEO", text: "For a website launch, migration, technical review or keyword plan. A defined piece of work with a start and finish.", points: ["Defined deliverables", "Clear start and finish", "Review the work before extending the engagement"] },
  { tag: "Monthly work", title: "Monthly SEO support", text: "For businesses that need regular page improvements, technical support, content and reporting.", points: ["Prioritised monthly roadmap", "Services agreed in the monthly scope", "Ongoing QA and reporting"] },
  { tag: "Agency support", title: "White-label SEO", text: "For agencies outsourcing client work. We use your templates and approval process; you manage the client relationship.", points: ["Agreed delivery capacity", "Your tools and review process", "Unbranded delivery if required"] },
];

/* ---------- approach ---------- */
const STEPS = [
  { title: "Tell us what you need", text: "Send your website, target market and priorities." },
  { title: "Review the quote", text: "Review the proposed work, price and schedule." },
  { title: "Get started", text: "Provide the access and information needed to begin." },
  { title: "Review progress", text: "See what was completed, what changed and what comes next." },
];

/* ---------- selected work, supplied portfolio, 9 November 2026 ---------- */
export const LOGOS: Record<string,string> = {"maddens.svg":brand1,"ivleague.svg":brand2,"smile.png":brand3,"katehill.png":brand4,"lifestyle.png":brand5,"glass.png":extra0,"sunlover.svg":extra1,"holdsworth.svg":extra2,"newstead.svg":extra3,"royal.png":extra4,"endo.png":extra5,"kiama.svg":extra6,"lumina.png":extra7,"madmiller.webp":extra8,"mlr.webp":extra9,"growers.png":extra10};

export const WORK = [
 {name:"Maddens Lawyers",asset:"maddens.svg",sector:"Professional services",place:"Victoria, Australia",tag:"Legal services",query:"personal injury lawyers ballarat",position:1,volume:"170",text:"Selected organic searches cover personal injury, compensation and local legal services in Victoria.",keywords:[["personal injury lawyers ballarat","1"],["compensation lawyers ballarat","1"],["lawyers warrnambool","2"]]},
 {name:"IV League Drips",asset:"ivleague.svg",sector:"Healthcare",place:"Sydney, Australia",tag:"Wellness services",query:"iv therapy sydney",position:1,volume:"390",text:"Selected organic searches cover IV therapy, drips and NAD infusions in Sydney.",keywords:[["iv therapy sydney","1"],["iv drips sydney","1"],["nad infusion sydney","1"]]},
 {name:"The Smile Spot",asset:"smile.png",sector:"Healthcare",place:"Sydney, Australia",tag:"Dental practice",query:"dentist in strathfield",position:1,volume:"390",text:"Selected organic searches include local dentists, implants and other treatments in Sydney suburbs.",keywords:[["dentist in strathfield","1"],["dental implant concord","1"],["dentist dulwich hill","3"]]},
 {name:"Kate Hill Flowers",asset:"katehill.png",sector:"Lifestyle",place:"Melbourne, Australia",tag:"Floristry & retail",query:"wedding bouquets melbourne",position:1,volume:"320",text:"Selected organic searches cover wedding bouquets and florists in Melbourne.",keywords:[["wedding bouquets melbourne","1"],["bridal bouquets melbourne","1"],["florist south melbourne","4"]]},
 {name:"Lifestyle Orthodontics",asset:"lifestyle.png",sector:"Healthcare",place:"Sydney, Australia",tag:"Orthodontics",query:"orthodontist woollahra",position:1,volume:"110",text:"Selected organic searches cover orthodontics, ceramic braces and Invisalign in Sydney suburbs.",keywords:[["orthodontist woollahra","1"],["ceramic braces bronte","1"],["invisalign woollahra","1"]]},
{"name": "Glass Tinting Solutions", "asset": "glass.png", "sector": "Trades", "place": "Brisbane, Australia", "tag": "Window tinting", "query": "glass tinting brisbane", "position": 1, "volume": "170", "keywords": [["glass tinting brisbane", "1"], ["window tinting brisbane", "5"], ["office window tinting brisbane", "5"]], "text": "Selected searches cover automotive, residential and commercial tinting in Brisbane."},
{"name": "Sunlover Heating", "asset": "sunlover.svg", "sector": "Trades", "place": "Australia", "tag": "Pool heating", "query": "pool covers melbourne", "position": 1, "volume": "320", "keywords": [["pool covers melbourne", "1"], ["pool heating melbourne", "2"], ["solar pool heaters", "2"]], "text": "Local installation searches and pool-heating product terms."},
{"name": "Holdsworth House Dental", "asset": "holdsworth.svg", "sector": "Healthcare", "place": "Sydney, Australia", "tag": "Dental practice", "query": "veneers darlinghurst", "position": 1, "volume": "90", "keywords": [["veneers darlinghurst", "1"], ["dental crowns darlinghurst", "1"], ["dentist darlinghurst", "3"]], "text": "Selected searches cover dental treatments in Darlinghurst and nearby suburbs."},
{"name": "Newstead Smiles", "asset": "newstead.svg", "sector": "Healthcare", "place": "Brisbane, Australia", "tag": "Dental practice", "query": "teeth whitening newstead", "position": 2, "volume": "110", "keywords": [["teeth whitening newstead", "2"], ["newstead dentist", "4"], ["teeth whitening brisbane", "8"]], "text": "Selected searches include local dentistry and teeth-whitening services in Newstead and Brisbane."},
{"name": "Royal Parade Dental Clinic", "asset": "royal.png", "sector": "Healthcare", "place": "Reservoir, Australia", "tag": "Dental practice", "query": "dental bridges reservoir", "position": 1, "volume": "260", "keywords": [["dental bridges reservoir", "1"], ["emergency dentist reservoir", "3"], ["dental implants reservoir", "4"]], "text": "Dental bridges, emergency care and implant searches in Reservoir."},
{"name": "Specialist Endo Sydney", "asset": "endo.png", "sector": "Healthcare", "place": "Sydney, Australia", "tag": "Endodontics", "query": "sydney endodontists", "position": 2, "volume": "390", "keywords": [["sydney endodontists", "2"], ["specialist endodontics", "2"], ["root canal specialist sydney", "4"]], "text": "Selected organic searches relate to specialist endodontic services in Sydney."},
{"name": "Kiama Dental Specialists", "asset": "kiama.svg", "sector": "Healthcare", "place": "Kiama & Wollongong, Australia", "tag": "Periodontics", "query": "gum graft before and after", "position": 1, "volume": "170", "keywords": [["gum graft before and after", "1"], ["gum graft kiama", "2"], ["periodontist wollongong", "7"]], "text": "Selected searches include gum-graft information and periodontic services in Kiama and Wollongong."},
{"name": "Lumina Dental", "asset": "lumina.png", "sector": "Healthcare", "place": "Sydney, Australia", "tag": "Dental practice", "query": "best whitening toothpaste", "position": 1, "volume": "1,600", "keywords": [["best whitening toothpaste", "1"], ["invisalign cost", "7"], ["teeth whitening sydney", "6"]], "text": "Patient information searches and dental services in Sydney."},
{"name": "Mad Miller", "asset": "madmiller.webp", "sector": "Trades", "place": "Toowoomba, Australia", "tag": "Cleaning services", "query": "bond cleaners in toowoomba", "position": 3, "volume": "70", "keywords": [["cleaners toowoomba", "6"], ["commercial cleaning toowoomba", "4"], ["bond cleaners in toowoomba", "3"]], "text": "Selected searches cover domestic, commercial and bond cleaning in Toowoomba."},
{"name": "MLR Plastering & Interiors", "asset": "mlr.webp", "sector": "Trades", "place": "Brisbane, Australia", "tag": "Plastering", "query": "commercial plastering brisbane", "position": 1, "volume": "90", "keywords": [["commercial plastering brisbane", "1"], ["commercial plasterers brisbane", "1"], ["plastering brisbane", "8"]], "text": "Selected organic searches cover commercial plastering and plasterers in Brisbane."},
{"name": "Growers Choice Seeds", "asset": "growers.png", "sector": "Retail", "place": "United States", "tag": "eCommerce", "query": "panama red seeds", "position": 1, "volume": "590", "keywords": [["white widow seeds", "2"], ["panama red seeds", "1"], ["autoflower seeds for sale", "1"]], "text": "Product and category searches in the US market."},
{"name": "Pacific Seed Bank", "asset": "", "sector": "Retail", "place": "United States", "tag": "eCommerce", "query": "cannabis seed bank", "position": 3, "volume": "1,900", "keywords": [["cannabis seed bank", "3"], ["weed seeds", "8"], ["cannabis seeds", "9"]], "text": "Category and product searches in the US market."}
];
const BRANDS = WORK.map(({name,asset})=>({name,asset}));
const SECTORS = ["All", "Healthcare", "Lifestyle", "Professional services", "Trades", "Retail"] as const;
type Sector = (typeof SECTORS)[number];

const PLANS = [
  { name: "SEO Essential", tag: "Core support", price: "700", desc: "Focus on one priority: technical fixes, keyword planning or improving existing pages.", features: ["One main SEO priority", "Keyword research and page recommendations", "Technical checks and fix guidance", "Review of completed changes", "Monthly performance report"] },
  { name: "SEO Growth", tag: "Ongoing growth", price: "1,000", popular: true, desc: "Combine technical and page improvements with regular content work.", features: ["Technical and on-page SEO", "Content briefs and existing-page updates", "Internal linking and local search", "Link opportunity research", "Monthly performance report"] },
  { name: "SEO Scale", tag: "Higher capacity", price: "1,500", desc: "Coordinate SEO across a larger website, several markets or agency accounts.", features: ["Technical, on-page and content support", "Work across multiple pages or markets", "Shared task tracking and review dates", "Unbranded reports for agency clients", "Delivery through your agency’s workflow"] },
];

/* ---------- FAQ ---------- */
const FAQS: [string,string][] = [
 ["What can I outsource?", "Technical SEO, keyword research, content briefs, writing and optimisation, on-page updates, local SEO, link research and reporting. You can request a single service or combine several."],
 ["Can you work with our agency?", "Yes. We can use your templates, tools and approval process for white-label delivery. Your agency remains the client contact unless we agree otherwise."],
 ["Do you implement technical changes?", "Implementation depends on the project. Your quote will specify the changes we handle, the work assigned to your developer and the approvals required."],
 ["How much does it cost?", "Monthly plans start at $700, $1,000 and $1,500 USD. Final pricing depends on the work involved. One-off projects and agency requirements are quoted separately."],
 ["Is a long-term contract required?", "Project-based and monthly options are available. The proposal confirms the contract term, payment schedule and cancellation arrangements."],
 ["How soon will we see results?", "Timing depends on the website, competition and work required. We report completed tasks separately from changes in rankings, traffic and enquiries. We do not guarantee a ranking or a fixed result date."],
 ["How will we track progress?", "Reports cover completed work, search performance, outstanding approvals and recommended next tasks. The reporting format and review schedule are agreed before work starts."],
 ["Can we keep some SEO work in-house?", "Yes. Keep the tasks your team already handles and outsource the rest. We agree responsibilities before starting so work is not duplicated."],
 ["How are revisions handled?", "Your proposal sets out the review process, included revisions and how changes to the agreed scope are priced."],
];

type Pt = { x: number; y: number };
function smoothPath(pts: Pt[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)},${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)},${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}
function barColor(t: number) {
  return `rgb(${Math.round(176 * t)},${Math.round(242 - 166 * t)},${Math.round(254 + t)})`;
}


/* ---------- brand ---------- */
function Mark() {
 return <svg className="mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="brand-spectrum"><stop stopColor="#00f2fe"/><stop offset="1" stopColor="#ae63ff"/></linearGradient></defs><g fill="none" stroke="url(#brand-spectrum)" strokeWidth="3.8" strokeLinecap="round"><path d="M8 33A19 19 0 1 1 42 20"/><path d="M38 32A15 15 0 0 1 12 16"/><path d="M17 12A13 13 0 0 1 29 36"/></g><circle cx="24" cy="24" r="3.6" fill="#fff"/></svg>;
}
function Logo() {
  return (
    <a href="#top" className="logo" aria-label="SEO Outsourcing Philippines — home">
      <span className="logo-tile"><Mark /></span>
      <span className="logo-text"><strong>SEO Outsourcing</strong><small>Philippines</small></span>
    </a>
  );
}

/* ---------- dashboard ---------- */
function RangeSelect({value,onChange}:{value:RangeKey;onChange:(v:RangeKey)=>void}) {
 return <label className="range"><span className="sr">Illustrative chart timeframe</span><select className="range-btn" value={value} onChange={e=>onChange(e.target.value as RangeKey)}>{(Object.keys(RANGES) as RangeKey[]).map(k=><option key={k} value={k}>{RANGES[k].label}</option>)}</select></label>;
}

function PerformanceChart({ range }: { range: RangeKey }) {
  const W = 560, H = 318, L = 58, R = 18, T = 20, B = 44;
  const data = RANGES[range];
  const pts: Pt[] = data.points.map((v, i) => ({ x: L + (i / (data.points.length - 1)) * (W - L - R), y: T + (1 - v / 120) * (H - T - B) }));
  const line = smoothPath(pts); const last = pts[pts.length - 1];
  const area = `${line} L${last.x.toFixed(1)},${H - B} L${pts[0].x.toFixed(1)},${H - B} Z`;
  return (
    <svg key={range} className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative organic search performance over ${data.label}, rising from ${data.points[0]}K to ${data.points[data.points.length - 1]}K.`}>
      <defs>
        <linearGradient id="line-grad" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#00f2fe" /><stop offset=".55" stopColor="#8a2be2" /><stop offset="1" stopColor="#ff4fd8" /></linearGradient>
        <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8a2be2" stopOpacity=".55" /><stop offset=".55" stopColor="#00f2fe" stopOpacity=".14" /><stop offset="1" stopColor="#00f2fe" stopOpacity="0" /></linearGradient>
        <filter id="line-blur" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>
      {[0, 20, 40, 60, 80, 100, 120].map((t) => { const y = T + (1 - t / 120) * (H - T - B); return (<g key={t} aria-hidden="true"><line x1={L} x2={W - R} y1={y} y2={y} className="grid-line" /><text x={L - 10} y={y + 4} className="axis" textAnchor="end">{t === 0 ? "0" : `${t}K`}</text></g>); })}
      {data.months.map((m, i) => { const x = L + (i / (data.months.length - 1)) * (W - L - R); return (<g key={m} aria-hidden="true"><line x1={x} x2={x} y1={T} y2={H - B} className="grid-line v" /><text x={x} y={H - 14} className="axis" textAnchor="middle">{m}</text></g>); })}
      <path d={area} fill="url(#area-grad)" className="area" />
      <path d={line} pathLength={1} className="line-glow" stroke="url(#line-grad)" filter="url(#line-blur)" />
      <path d={line} pathLength={1} className="line" stroke="url(#line-grad)" />
      <circle cx={last.x} cy={last.y} r="14" className="dot-halo" /><circle cx={last.x} cy={last.y} r="6" className="end-dot" />
    </svg>
  );
}

function MiniLine() {
  const values = [4, 12, 10, 20, 26, 24, 36, 44, 50, 62];
  const pts: Pt[] = values.map((v, i) => ({ x: 6 + (i / (values.length - 1)) * 148, y: 62 - (v / 62) * 52 }));
  const last = pts[pts.length - 1];
  return (
    <svg className="mini-line" viewBox="0 0 160 70" aria-hidden="true" focusable="false">
      <defs><linearGradient id="mini-grad" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#00f2fe" /><stop offset="1" stopColor="#b04cff" /></linearGradient></defs>
      <path d={smoothPath(pts)} pathLength={1} className="mini-path" stroke="url(#mini-grad)" /><circle cx={last.x} cy={last.y} r="4" className="end-dot" />
    </svg>
  );
}

/* ---------- stats ---------- */
function BrandAsset({asset,name,decorative=false}:{asset:string;name:string;decorative?:boolean}) {
 return LOGOS[asset]?<img src={LOGOS[asset]} alt={decorative?"":name} width="180" height="60"/>:<span className="brand-name-fallback" aria-hidden={decorative||undefined}>{name}</span>;
}
function BrandMarquee() {
 return <section className="brand-section" aria-label="Brands in the portfolio"><div className="wrap trust-heading"><h2>Selected work</h2></div><div className="brand-marquee"><div className="brand-track"><div className="brand-set">{BRANDS.map(b=><div className="brand-item" key={b.name}><BrandAsset asset={b.asset} name={b.name}/>{LOGOS[b.asset]&&<span className="brand-caption" aria-hidden="true">{b.name}</span>}</div>)}</div></div></div></section>;
}
function SelectedWork(){
 const [active,setActive]=useState(0),[sector,setSector]=useState<Sector>("All");const project=WORK[active];
 const visible=sector==="All"?WORK:WORK.filter(w=>w.sector===sector);
 return <section className="section selected-work" id="portfolio"><div className="wrap"><div className="work-spotlight"><div className="project-art"><BrandAsset asset={project.asset} name={project.name}/><div className="project-place">{project.place}</div><span className="project-orbit" aria-hidden="true"/></div><div className="project-story" key={project.name}><h3>{project.name}</h3><p>{project.tag} · {project.place}</p><div className="ranking-feature"><strong>#{project.position}</strong><div><span>Organic search position</span><b>{project.query}</b><small>{project.volume} estimated searches / month</small></div></div><table className="project-keywords"><caption>Selected organic searches</caption><thead><tr><th scope="col">Search term</th><th scope="col">Position</th></tr></thead><tbody>{project.keywords.map(([q,n])=><tr key={q}><td>{q}</td><td>#{n}</td></tr>)}</tbody></table></div></div><div className="project-picker" role="group" aria-label="Featured project">{WORK.slice(0,3).map((w,i)=><button key={w.name} aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span>{w.name}</button>)}</div><div className="work-subhead"><div className="filters" role="group" aria-label="Filter portfolio">{SECTORS.map(x=><button className={`chip${sector===x?" active":""}`} key={x} aria-pressed={sector===x} onClick={()=>setSector(x)}>{x}</button>)}</div></div><div className="portfolio-grid">{visible.map(w=><button className="portfolio-tile" key={w.name} onClick={()=>{setActive(WORK.indexOf(w));document.querySelector('.work-spotlight')?.scrollIntoView({behavior:'auto',block:'center'})}}><span className="tile-logo"><BrandAsset asset={w.asset} name={w.name} decorative/></span><span className="tile-info"><b>{w.name}</b><small>{w.tag} · {w.place.split(',')[0]}</small></span></button>)}</div><p className="evidence-note">Rankings recorded {CHECKED}. Google Australia or US, as applicable. Search volumes are estimates; positions may change.</p></div></section>;
}

function PlusIcon(){return <span className="service-plus" aria-hidden="true">+</span>}

/* ---------- contact modal ---------- */
type ModalMode = "quote";
function ContactModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const first = useRef<HTMLInputElement>(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  const [reference, setReference] = useState("");
  const [sending,setSending]=useState(false);
  const [error,setError]=useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if(e.key === "Escape") closeRef.current();
      if(e.key === "Tab") {
        const nodes=Array.from(document.querySelectorAll<HTMLElement>('.modal button,.modal input,.modal select,.modal textarea,.modal a[href]')).filter(el=>!el.hasAttribute('disabled'));
        const a=nodes[0],b=nodes[nodes.length-1];
        if(e.shiftKey&&document.activeElement===a){e.preventDefault();b?.focus()}
        else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a?.focus()}
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    const page = document.querySelector("main"); page?.setAttribute("inert", "");
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; page?.removeAttribute("inert"); (previous && previous.tagName !== "BODY" && previous.isConnected ? previous : document.querySelector<HTMLElement>(".hero-actions button"))?.focus(); };
  }, []);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form=e.currentTarget;
    if(!form.reportValidity() || sending)return;
    const d = new FormData(form);
    setSending(true);setError("");
    try {
      const session=await fetch('/api/session',{credentials:'same-origin',cache:'no-store'});
      if(!session.ok)throw new Error('The quote form is temporarily unavailable. Please email us or book a discovery call.');
      const token=await session.json();
      if(!token.csrf_token)throw new Error('The quote form is temporarily unavailable. Please email us or book a discovery call.');
      const response=await fetch('/api/inquiry',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        csrf_token:token.csrf_token,name:d.get('name'),email:d.get('email'),website:d.get('website'),company:d.get('company')||'',
        plan:d.get('interest')||'Not sure - recommend a scope',audience:d.get('audience'),
        details:[d.get('market')?`Target market: ${d.get('market')}`:'',String(d.get('message')||'')].filter(Boolean).join('\n\n'),
        consent:d.get('consent')==='on',phone_confirm:d.get('phone_confirm')||''
      })});
      const result=await response.json();
      if(!response.ok || !result.ok || !result.reference)throw new Error(result.error||'Your request could not be sent. Please try again or email us.');
      setReference(result.reference);
      window.dispatchEvent(new CustomEvent("sop:conversion",{detail:{event:"quote_request_success"}}));
    } catch(err){setError(err instanceof Error?err.message:'Your request could not be sent. Please try again or email us.')}
    finally{setSending(false)}
  };
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal glass" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={20} aria-hidden="true" /></button>

        <h2 id="modal-title">Request a quote</h2>
        <p className="modal-sub">Share your website, target market and the tasks you need help with. Include any deadlines or planned website changes.</p>
        {reference?<div className="quote-success" role="status"><h3>Quote request received.</h3><p>Thank you. We’ll review your requirements and reply to the email address you provided.</p><p>Reference: <strong>{reference}</strong></p><button type="button" className="btn-outline full" onClick={onClose}>Back to the website</button></div>:<form className="modal-form" onSubmit={submit}>
          <label>Website<input ref={first} name="website" maxLength={300} type="url" placeholder="https://yourdomain.com" required /></label>
          <div className="two">
            <label>Name<input name="name" maxLength={120} autoComplete="name" placeholder="Your name" required /></label>
            <label>Work email<input name="email" maxLength={254} type="email" autoComplete="email" placeholder="you@company.com" required /></label>
          </div>
          <label>Plan of interest
            <span className="select-wrap"><select name="interest" defaultValue={plan}><option value="">Not sure yet</option><option value="SEO Essential">SEO Essential — from $700/month</option><option value="SEO Growth">SEO Growth — from $1,000/month</option><option value="SEO Scale">SEO Scale — from $1,500/month</option><option value="Custom project / dedicated team">Project or white-label support</option></select><ChevronDown size={16} aria-hidden="true" /></span>
          </label>
          <label>I need SEO support for<select name="audience"><option value="business">My business</option><option value="agency">My agency’s client accounts</option></select></label>
          <div className="two"><label>Company or agency<input name="company" maxLength={160} autoComplete="organization" placeholder="Company name (optional)"/></label><label>Target market<input name="market" maxLength={150} placeholder="For example: Australia, Sydney"/></label></div>
          <label>What do you need help with?<textarea name="message" rows={3} minLength={20} maxLength={4500} required placeholder="Services you need, pages or websites involved, and any planned launch or migration." /></label>
          <div className="form-trap" aria-hidden="true"><label>Leave empty<input name="phone_confirm" tabIndex={-1} autoComplete="off"/></label></div>
          <label className="consent"><input name="consent" type="checkbox" required/><span>I agree to be contacted about this request under the <a href="privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span></label>
          <button className="btn-glow" type="submit" disabled={sending}>{sending?'Sending request…':'Send quote request'} </button>
          {error&&<p className="form-error" role="alert">{error}</p>}
          <p className="modal-note">Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        </form>}

      </div>
    </div>
  );
}

/* ---------- app ---------- */
export default function App() {
  const [menu, setMenu] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [range, setRange] = useState<RangeKey>("6");
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [quotePlan,setQuotePlan]=useState("");
  const quoteTrigger=useRef<HTMLElement|null>(null);
  function openQuote(plan=""){
    const destination=document.querySelector<HTMLMetaElement>('meta[name="sop-quote-url"]')?.content;
    if(destination){const url=new URL(destination,window.location.href);if(plan)url.searchParams.set('plan',plan);window.location.assign(url.href);return;}
    quoteTrigger.current=document.activeElement as HTMLElement;setQuotePlan(plan);setModal("quote");
  }
  function closeQuote(){setModal(null);requestAnimationFrame(()=>{const trigger=quoteTrigger.current; (trigger && trigger.tagName!=="BODY" ? trigger : document.querySelector<HTMLElement>(".hero-actions button"))?.focus()})}

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);



  return (
    <div className="page">
      <a href="#main" className="skip">Skip to content</a>

      <header className={`header${stuck || menu ? " stuck" : ""}`}>
        <div className="wrap header-in">
          <Logo />
          <nav className="nav" aria-label="Main">{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
          <div className="header-actions"><button className="header-quote" type="button" onClick={()=>openQuote()}>Get a Quote </button>
            <a className="pill-cta" href={CALENDLY} target="_blank" rel="noopener noreferrer">Book a call </a>
          </div>
          <button type="button" className="menu-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mnav" aria-label={menu ? "Close menu" : "Open menu"}>{menu ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
        </div>
      </header>
      <nav id="mnav" className={`mnav${menu ? " open" : ""}`} aria-label="Mobile" aria-hidden={!menu}>
        {NAV.map((n) => <a key={n.href} href={n.href} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>{n.label}</a>)}
        <button className="btn-glow" type="button" tabIndex={menu?0:-1} onClick={()=>{setMenu(false);openQuote()}}>Get a Quote </button>
        <a className="pill-cta" href={CALENDLY} target="_blank" rel="noopener noreferrer" tabIndex={menu ? 0 : -1}>Book a discovery call </a>
      </nav>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="top">
          <div className="wrap hero-in">
            <div className="hero-copy">

              <h1 className="rise d1">SEO outsourcing<br/>for <span className="grad">agencies<br/>and businesses.</span></h1>
              <p className="sub rise d2">Get technical SEO, keyword research, content and reporting support without hiring for every role. Work with us on a defined project, a monthly plan or your agency’s client accounts.</p>
              <div className="hero-actions rise d3">
                <button type="button" className="btn-glow" onClick={() => openQuote()}>Get a Quote </button>
                <a className="ghost-link" href="#portfolio">Explore our work</a>
              </div>

            </div>
            <div className="scene">
              <div className="dash-wrap">
                <div className="dash">
                  <div className="dash-card glass">
                    <div className="dash-head"><h2>Organic search performance</h2><RangeSelect value={range} onChange={setRange} /></div>
                    <PerformanceChart range={range} />
                  </div>
                  <div className="dash-stand" aria-hidden="true"><span /></div>
                </div>
                <div className="minis">
                  <div className="mini glass"><h3>Keyword visibility</h3><div className="bars" aria-hidden="true">{BARS.map((h, i) => { const t = i / (BARS.length - 1); return <span key={i} style={{ height: `${h}%`, "--i": i, background: `linear-gradient(180deg, ${barColor(t)}, ${barColor(Math.max(0, t - 0.25))})` } as CSSProperties} />; })}</div></div>
                  <div className="mini glass d2"><h3>Organic traffic</h3><MiniLine /></div>
                  <p className="illustrative">Illustrative analytics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <BrandMarquee />
        <SelectedWork />

        {/* SERVICES */}
        <section className="section" id="services">
          <div className="wrap">
            <div className="heading reveal"><h2>SEO services</h2><p>Choose the services you need help with.</p></div>
            <div className="service-editorial">
              {SERVICES.map(({title,text,points},i)=><details className="service-row" key={title} open={i===0}><summary><h3>{title}</h3><PlusIcon/></summary><div className="service-content"><p>{text}</p><ul className="ticks">{points.map(p=><li key={p}>{p}</li>)}</ul><button type="button" className="link-arrow" onClick={()=>openQuote()}>Get a Quote </button></div></details>)}
            </div>
            <div className="models">
              <div className="heading tight reveal"><h2>Ways to work with us</h2></div>
              <div className="cards">
                {MODELS.map((m, i) => (
                  <div className={`reveal d${i + 1}`} key={m.title}>
                    <article className="card model">

                      <h3>{m.title}</h3>
                      <p>{m.text}</p>
                      
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="section work-sample"><div className="wrap sample-in"><div><h2>See a sample deliverable</h2><p>Review an example technical issue log, content brief or reporting format before discussing your project.</p><p className="sample-context">Examples show document structure. They do not contain confidential client work.</p></div><a className="btn-outline" href="samples/">View sample deliverables </a></div></section>

        {/* APPROACH */}
        <section className="section" id="approach">
          <div className="wrap">
            <div className="heading reveal"><h2>How we work</h2><p>From your first enquiry to ongoing work.</p></div>
            <ol className="steps">
              {STEPS.map((s, i) => (<li className={`step reveal d${i + 1}`} key={s.title}><span className="step-n">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>))}
            </ol>

          </div>
        </section>

        <Testimonials />

        {/* PRICING */}
        <section className="section" id="pricing">
          <div className="wrap">
            <div className="heading reveal"><h2>Monthly SEO plans</h2><p>Compare the focus of each plan. These are starting prices; your quote specifies the work included.</p></div>
            <div className="plans">
              {PLANS.map((p, i) => (
                <article className={`plan glass reveal d${i + 1}${p.popular ? " popular" : ""}`} key={p.name}>


                  <h3>{p.name}</h3>
                  <p className="plan-desc">{p.desc}</p>
                  <div className="price"><span>from</span><strong>${p.price}</strong><span>USD / month</span></div>
                  <ul className="ticks">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <button type="button" className={p.popular ? "btn-glow full" : "btn-outline full"} onClick={() => openQuote(p.name)}>Get a Quote </button>
                </article>
              ))}
            </div>
            <p className="plan-terms">Monthly quantities and implementation work are confirmed in your quote. Third-party costs are listed separately. Search outcomes are not guaranteed.</p>
            <p className="fine reveal">One-off projects and agency requirements are quoted separately.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="wrap faq-wrap">
            <div className="heading reveal"><h2>Questions before we start</h2></div>
            <div className="faq reveal">{FAQS.map(([q, a]) => (<details className="glass" key={q}><summary>{q}<ChevronDown size={20} aria-hidden="true" /></summary><p>{a}</p></details>))}</div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" id="contact">
          <div className="wrap cta glass reveal">
            <div className="cta-copy">

              <h2>Tell us what you need.</h2>
              <p>Send your website, target market and the work you need help with. We’ll review the requirements and prepare a quote. Prefer to talk it through? Book a discovery call.</p>

            </div>
            <div className="cta-actions">
              <button type="button" className="btn-glow full" onClick={() => openQuote()}>Get a Quote </button>
              <a className="btn-outline full" href={CALENDLY} target="_blank" rel="noopener noreferrer"> Book a discovery call</a>
              <a className="mail-link" href={`mailto:${EMAIL}`}> {EMAIL}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-in">
          <div className="footer-brand"><Logo /><p>Technical SEO, content, local search and reporting for agencies and businesses.</p></div>
          <div><h4>Explore</h4>{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</div>
          <div><h4>Resources</h4><a href="about/" target="_blank" rel="noopener noreferrer">About</a><a href="results/">Our work</a><a href="samples/" target="_blank" rel="noopener noreferrer">Sample deliverables</a><a href="blog/" target="_blank" rel="noopener noreferrer">Blog</a><a href="privacy-policy/">Privacy policy</a><a href="terms-of-service/">Terms of service</a><a href="cookie-policy/">Cookie policy</a></div>
          <div><h4>Contact</h4><a href={CALENDLY} target="_blank" rel="noopener noreferrer">Book a discovery call</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><p>Available for US, UK, Canadian, Australian and New Zealand campaigns.</p></div>
        </div>
        <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} SEO Outsourcing Philippines.</span><span>Technical SEO · Content · Local search · Reporting</span></div>
      </footer>

      <div className="fixed-actions"><a className="fixed-discovery" href={CALENDLY} target="_blank" rel="noopener noreferrer"><span>Book a Discovery Call</span><span className="sr"> (opens in a new tab)</span></a>
      </div>
      {modal && <ContactModal plan={quotePlan} onClose={closeQuote} />}
    </div>
  );
}
