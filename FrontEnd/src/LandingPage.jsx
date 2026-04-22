import { useState, useEffect, useRef } from "react";
import {
   Download, ChevronDown, ChevronUp, Menu, X,
  Activity, Layers, Zap, BarChart2, Cpu,
  Mail, User, MessageSquare, ExternalLink, Car, Map
} from "lucide-react";

import axios from "axios";
import { Link, useNavigate } from "react-router";

// ── Theme tokens (logo-matched) ───────────────────────────────────────────────
const T = {
  bg:         "#F5F0E8",
  bgMid:      "#EDE8DE",
  bgDark:     "#E3DDD3",
  ink:        "#1A1A1A",
  inkMid:     "#4A4440",
  inkFaint:   "#8C8070",
  accentWarm: "#5C4A3A",
  line:       "rgba(26,26,26,0.1)",
  lineHover:  "rgba(26,26,26,0.3)",
  card:       "rgba(26,26,26,0.03)",
  cardHover:  "rgba(26,26,26,0.07)",
};

// ── Utility: scroll-reveal ────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useReveal();
  useEffect(() => {
    if (!vis) return;
    let n = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      n = Math.min(n + step, to);
      setVal(n);
      if (n >= to) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [vis, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Flowing parallel lines (echoes logo motif) ────────────────────────────────
function FlowLines({ opacity = 0.06, color = T.ink, vertical = false }) {
  const positions = vertical ? [8, 20, 32, 44, 56, 68, 80, 92] : [12, 25, 38, 51, 64, 77];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      {positions.map((pos, i) =>
        vertical ? (
          <line key={i} x1={`${pos}%`} y1="0" x2={`${pos}%`} y2="100%"
            stroke={color} strokeWidth="1.5" />
        ) : (
          <line key={i} x1="0" y1={`${pos}%`} x2="100%" y2={`${pos}%`}
            stroke={color} strokeWidth="1" />
        )
      )}
    </svg>
  );
}

// ── Logo SVG mark ─────────────────────────────────────────────────────────────
function LogoMark({ size = 28, color = T.ink }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M10 12 Q10 88 50 88 Q90 88 90 50" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M21 12 Q21 76 50 76 Q79 76 79 50" stroke={color} strokeWidth="7.5" strokeLinecap="round" fill="none"/>
      <path d="M32 12 Q32 64 50 64 Q68 64 68 50" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M56 12 L90 12 Q90 30 73 30 L56 30" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M56 30 L87 30 Q87 48 70 48 L56 48" stroke={color} strokeWidth="7.5" strokeLinecap="round" fill="none"/>
      <path d="M56 48 L84 48 Q84 66 67 66 L56 66" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function Logo({ dark = false }) {
  const c = dark ? T.bg : T.ink;
  return (
    <span className="select-none flex items-center gap-2.5">
      <LogoMark size={30} color={c} />
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.02em", color: c }}>
        Urban<span style={{ color: dark ? "rgba(245,240,232,0.55)" : T.accentWarm }}>Flow</span>
      </span>
    </span>
  );
}

// ── Links ─────────────────────────────────────────────────────────────────────
const LINKS = {
  github:   "https://github.com/TOY-ruki/UrbanFlow",
  mapng:    "https://www.mapng.com/",
  sumo:     "https://eclipse.dev/sumo/",
  download: "#",
};

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({user}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [logout,setlogout] = useState(false);
      const navigate = useNavigate();
  const host = import.meta.env.VITE_LOCAL_HOST;
    const logoutUser=async ()=>{
    await axios.get(host+"/user/logoutUser",{withCredentials:true})
    .then(res=> navigate(res.data.path))
    .catch(err => console.log(err))
  }
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const navLinks = ["Features", "Demo", "Docs", "Download", "About", "Contact"];
  const scroll = (id) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
      style={{
        background: scrolled ? "rgba(245,240,232,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.line}` : "none"
      }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <button key={l} onClick={() => scroll(l)}
              className="text-sm font-medium transition-colors"
              style={{ fontFamily: "'Space Mono', monospace", color: T.inkMid }}
              onMouseEnter={e => e.currentTarget.style.color = T.ink}
              onMouseLeave={e => e.currentTarget.style.color = T.inkMid}>{l}</button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href={LINKS.github} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ fontFamily: "'Space Mono', monospace", color: T.inkMid, border: `1px solid ${T.line}` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.ink; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.inkMid; }}>
          GitHub
          </a>
          
          
           {!user && <Link 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
            style={{ background: T.ink, color: T.bg, fontFamily: "'Space Mono', monospace" }}
           to="/login">Login</Link>}
           {user && <div onClick={()=>{setlogout(!logout)}} className="max-lg:hidden cursor-pointer rounded-full grid place-items-center text-xl h-10 aspect-square" style={{background:T.ink,color:T.bg}}><h1>{user.firstName[0]}</h1></div>}
      <div className={`${logout ? "block":"hidden"} absolute top-16 max-lg:hidden w-fit p-4 bg-gray-100`}>
        <ul className="flex flex-col gap-3">
          <li>{user && user.firstName}</li>
          <li><button onClick={()=>{logoutUser()}} className="bg-red-400 cursor-pointer px-2 text-white rounded-md  py-1">Log Out</button></li>
        </ul>
      </div>
       

        </div>
        <button className="md:hidden" style={{ color: T.ink }} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pt-4 pb-6 flex flex-col gap-3"
          style={{ background: T.bg, borderTop: `1px solid ${T.line}` }}>
          {navLinks.map(l => (
            <button key={l} onClick={() => scroll(l)} className="text-left py-2.5 transition-colors"
              style={{ color: T.inkMid, borderBottom: `1px solid ${T.line}`, fontFamily: "'Space Mono', monospace", fontSize: "0.875rem" }}>{l}</button>
          ))}
          <div className="flex gap-3 pt-2">
            <a href={LINKS.github} target="_blank" rel="noreferrer"
              className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold"
              style={{ border: `1px solid ${T.ink}`, color: T.ink, fontFamily: "'Space Mono', monospace" }}>GitHub</a>
                    {!user ?  <Link 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
            style={{ background: T.ink, color: T.bg, fontFamily: "'Space Mono', monospace" }}
           to="/login">Login</Link>:<button onClick={()=>{logoutUser() }} className="bg-red-400 px-2 text-white rounded-md  py-1">Log Out</button>}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: T.bg }}>
      <FlowLines opacity={0.055} vertical />
      {/* Faint giant UF watermark */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.035 }}>
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "38vw", fontWeight: 900, color: T.ink, lineHeight: 1 }}>UF</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10 text-xs font-bold tracking-widest"
          style={{ background: T.cardHover, border: `1px solid ${T.line}`, color: T.inkMid, fontFamily: "'Space Mono', monospace", animation: "fadeInDown 0.8s ease both" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.ink }} />
          MICROSCOPIC TRAFFIC SIMULATION ENGINE
        </div>

        {/* Large logo mark */}
        <div className="flex justify-center mb-8" style={{ animation: "fadeInUp 0.9s 0.15s ease both", opacity: 0 }}>
          <LogoMark size={96} color={T.ink} />
        </div>

        <h1 className="font-black leading-none mb-5"
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2.8rem,7vw,5.5rem)", color: T.ink, animation: "fadeInUp 0.9s 0.28s ease both", opacity: 0 }}>
          Urban<span style={{ color: T.accentWarm }}>Flow</span>
        </h1>

        <p className="text-lg md:text-xl mb-4 font-normal tracking-wide"
          style={{ color: T.inkMid, fontFamily: "'Space Mono', monospace", animation: "fadeInUp 0.9s 0.4s ease both", opacity: 0 }}>
          Traffic Simulation for Infrastructure Planning &amp; Analysis
        </p>
        <p className="max-w-2xl mx-auto mb-12 text-base leading-relaxed"
          style={{ color: T.inkFaint, animation: "fadeInUp 0.9s 0.52s ease both", opacity: 0 }}>
          A high-fidelity microscopic simulation engine that models vehicle-level behavior,
          shockwave propagation, and real-time traffic dynamics — built for urban infrastructure
          research and analysis.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
          style={{ animation: "fadeInUp 0.9s 0.63s ease both", opacity: 0 }}>
          <a href={LINKS.github}
             target="_blank"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 w-full sm:w-auto justify-center"
            style={{ background: T.ink, color: T.bg, fontFamily: "'Space Mono', monospace", boxShadow: "4px 4px 0 rgba(26,26,26,0.18)" }}>
            <Download size={19} className="group-hover:-translate-y-0.5 transition-transform" />
            Download Now
          </a>
          <a href={LINKS.github} target="_blank" rel="noreferrer"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 w-full sm:w-auto justify-center"
            style={{ border: `2px solid ${T.ink}`, color: T.ink, background: "transparent", fontFamily: "'Space Mono', monospace" }}>
          
            View on GitHub
          </a>
        </div>

        {/* Tool buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3"
          style={{ animation: "fadeInUp 0.9s 0.75s ease both", opacity: 0 }}>
          <span className="text-xs" style={{ color: T.inkFaint, fontFamily: "'Space Mono', monospace" }}>Built with:</span>
          <a href={LINKS.mapng} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: T.cardHover, border: `1px solid ${T.line}`, color: T.inkMid, fontFamily: "'Space Mono', monospace" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.bg; e.currentTarget.style.borderColor = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.cardHover; e.currentTarget.style.color = T.inkMid; e.currentTarget.style.borderColor = T.line; }}>
            <Map size={13} /> MapNG <ExternalLink size={10} />
          </a>
          <a href={LINKS.sumo} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: T.cardHover, border: `1px solid ${T.line}`, color: T.inkMid, fontFamily: "'Space Mono', monospace" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.bg; e.currentTarget.style.borderColor = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.cardHover; e.currentTarget.style.color = T.inkMid; e.currentTarget.style.borderColor = T.line; }}>
            <Car size={13} /> SUMO Simulator <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce"
        style={{ color: T.inkFaint }}>
        <span className="text-xs tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>SCROLL</span>
        <ChevronDown size={15} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        html { scroll-behavior:smooth; }
        *    { box-sizing:border-box; }
        body { background:${T.bg}; margin:0; }
        ::placeholder { color:${T.inkFaint}; opacity:1; }
      `}</style>
    </section>
  );
}

// ── Stats banner (inverted / ink background) ──────────────────────────────────
function StatsBanner() {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref}
      className={`py-16 px-6 relative overflow-hidden transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ background: T.ink }}>
      <FlowLines opacity={0.07} color={T.bg} />
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
        {[["1000","+","Vehicles / Sim"],["60","fps","Simulation Rate"],["6","+","Output Metrics"],["1",".0","Stable Release"]].map(([n,s,l]) => (
          <div key={l}>
            <div className="text-4xl font-black mb-1" style={{ fontFamily:"'Orbitron',sans-serif", color:T.bg }}>
              <Counter to={parseInt(n)} suffix={s} />
            </div>
            <div className="text-xs tracking-widest" style={{ color:"rgba(245,240,232,0.42)", fontFamily:"'Space Mono',monospace" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon:Car,       title:"Microscopic Vehicle Simulation",  desc:"Models each vehicle independently — acceleration, braking, spacing, and lane decisions at the individual agent level." },
  { icon:Activity,  title:"Shockwave Detection",             desc:"Identifies and tracks traffic shockwaves in real-time, revealing how congestion propagates and dissolves across the network." },
  { icon:Zap,       title:"Real-Time Flow Analysis",         desc:"Computes flow, density, and speed metrics per road segment as the simulation runs, enabling live performance monitoring." },
  { icon:Layers,    title:"Lane-Based Vehicle Tracking",     desc:"Tracks every vehicle per lane with positional precision for multi-lane highways and complex urban arterial scenarios." },
  { icon:BarChart2, title:"Data-Driven Insights",            desc:"Exports structured logs for post-processing, chart generation, and infrastructure decision support pipelines." },
  { icon:Cpu,       title:"C++ Simulation Engine",           desc:"A high-performance C++ core enables fast execution across large networks with thousands of concurrent vehicles." },
];

function Features() {
  const [ref, vis] = useReveal();
  return (
    <section id="features" className="py-28 px-6 relative overflow-hidden" style={{ background:T.bgMid }}>
      <FlowLines opacity={0.045} />
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest mb-3 block" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>// CAPABILITIES</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Core Features</h2>
          <p style={{ color:T.inkMid }} className="max-w-xl mx-auto">Everything you need to model, analyze, and understand complex urban traffic systems.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon:Icon, title, desc }, i) => {
            const [r, v] = useReveal();
            return (
              <div key={title} ref={r}
                className={`group p-7 rounded-2xl transition-all duration-700 cursor-default ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}
                style={{ transitionDelay:`${i*75}ms`, background:T.bg, border:`1px solid ${T.line}`, boxShadow:"0 1px 4px rgba(26,26,26,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.ink; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="5px 5px 0 rgba(26,26,26,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.line; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 1px 4px rgba(26,26,26,0.05)"; }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ background:T.ink }}>
                  <Icon size={19} style={{ color:T.bg }} />
                </div>
                <h3 className="font-bold mb-3" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink, fontSize:"0.87rem" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:T.inkMid }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const SCREENSHOTS = [
  { label:"Vehicle Trajectory Visualization",  accent:T.ink },
  { label:"Shockwave Detection Output",        accent:"#7C5C3A" },
  { label:"Traffic Density Mapping",           accent:"#2E5C42" },
  { label:"Lane Occupancy Analysis",           accent:"#3A3A6C" },
  { label:"Flow–Speed Fundamental Diagram",    accent:"#6C2E2E" },
];

function Demo() {
  const [ref, vis] = useReveal();
  return (
    <section id="demo" className="py-28 px-6" style={{ background:T.bg }}>
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest mb-3 block" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>// VISUALIZATIONS</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Simulation Output</h2>
          <p style={{ color:T.inkMid }} className="max-w-xl mx-auto">Representative output visualizations from UrbanFlow's analysis pipeline.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCREENSHOTS.map(({ label, accent }, i) => {
            const [r, v] = useReveal();
            return (
              <div key={label} ref={r}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-700 cursor-pointer ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}
                style={{ transitionDelay:`${i*90}ms`, aspectRatio:"16/10", border:`1px solid ${T.line}` }}
                onMouseEnter={e => { e.currentTarget.style.transform="scale(1.025)"; e.currentTarget.style.boxShadow=`5px 5px 0 ${T.bgDark}`; e.currentTarget.style.borderColor=T.ink; }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor=T.line; }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  style={{ background:T.bgMid }}>
                  <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity:0.18 }}>
                    {[...Array(9)].map((_,j) => (
                      <rect key={j} x={`${j*13-4}%`} y="42%" width="8%" height="14%" rx="3" fill={accent} opacity="0.75">
                        <animate attributeName="x" from={`${j*13-4}%`} to={`${j*13+9}%`} dur={`${1.3+j*0.12}s`} repeatCount="indefinite" />
                      </rect>
                    ))}
                    <line x1="0" y1="49%" x2="100%" y2="49%" stroke={accent} strokeWidth="1.5" />
                    <line x1="0" y1="56%" x2="100%" y2="56%" stroke={accent} strokeWidth="1" strokeDasharray="8 5" />
                  </svg>
                  <div className="w-13 h-13 rounded-xl flex items-center justify-center z-10 p-3"
                    style={{ background:accent }}>
                    <BarChart2 size={22} style={{ color:T.bg }} />
                  </div>
                  <span className="text-xs font-bold tracking-widest z-10" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>PREVIEW</span>
                </div>
                {/* Static caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 group-hover:translate-y-full transition-transform duration-300"
                  style={{ background:T.bg, borderTop:`1px solid ${T.line}` }}>
                  <p className="text-xs font-bold" style={{ color:T.ink, fontFamily:"'Space Mono',monospace" }}>{label}</p>
                </div>
                {/* Hover caption */}
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-bold text-sm" style={{ color:T.ink, fontFamily:"'Space Mono',monospace" }}>{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Docs ──────────────────────────────────────────────────────────────────────
const DOCS = [
  { title:"How the Simulation Works",  content:`UrbanFlow uses a car-following model at its core. Each vehicle agent evaluates the distance and speed of the vehicle ahead, then applies acceleration or braking based on a configurable headway policy. At every simulation tick (0.1–1.0 s), all vehicles update simultaneously. Lane-change decisions use gap-acceptance logic, allowing vehicles to shift lanes when safe spacing thresholds are met.` },
  { title:"Input / Output Structure",  content:`INPUT: A road network definition (nodes, links, lanes), initial vehicle placement, and simulation parameters (duration, timestep, vehicle types). Provided as structured configuration files — compatible with MapNG and SUMO network formats.\n\nOUTPUT: Per-tick CSV/text logs containing vehicle ID, position, speed, lane, and status. Aggregate metrics include flow rate (veh/hr), density (veh/km), mean speed, and shockwave event timestamps.` },
  { title:"Use Cases",                 content:`• Urban Infrastructure Planning — evaluate road designs, intersections, and signal timings before construction.\n• Congestion Analysis — identify bottlenecks and understand how shockwaves emerge and dissolve.\n• Academic Research — study traffic flow theory, test new car-following models, or validate against real datasets.\n• Policy Simulation — model the impact of speed limits, lane restrictions, or demand management strategies.` },
  { title:"System Requirements",       content:`• OS: Windows 10 / 11 (64-bit)\n• CPU: Intel Core i5 or equivalent (multi-core recommended)\n• RAM: 4 GB minimum · 8 GB recommended\n• Storage: ~150 MB\n• Runtime: Visual C++ Redistributable (bundled in installer)\n• No GPU required for base simulations` },
];

function DocItem({ title, content, i }) {
  const [open, setOpen] = useState(false);
  const [ref, vis] = useReveal();
  return (
    <div ref={ref}
      className={`rounded-xl overflow-hidden transition-all duration-500 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}
      style={{ transitionDelay:`${i*90}ms`, border:`1px solid ${T.line}`, background:T.bg }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors"
        style={{ background:open ? T.bgMid : T.bg }}
        onMouseEnter={e => e.currentTarget.style.background=T.bgMid}
        onMouseLeave={e => e.currentTarget.style.background=open ? T.bgMid : T.bg}>
        <span className="font-bold" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink, fontSize:"0.88rem" }}>{title}</span>
        <span style={{ color:T.inkFaint, flexShrink:0, marginLeft:"1rem" }}>{open ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}</span>
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open?"max-h-96":"max-h-0"}`}>
        <div className="px-6 pb-6 text-sm leading-relaxed whitespace-pre-line"
          style={{ color:T.inkMid, borderTop:`1px solid ${T.line}`, paddingTop:"1.25rem" }}>{content}</div>
      </div>
    </div>
  );
}

function Docs() {
  const [ref, vis] = useReveal();
  return (
    <section id="docs" className="py-28 px-6" style={{ background:T.bgMid }}>
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest mb-3 block" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>// DOCUMENTATION</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Technical Docs</h2>
          <p style={{ color:T.inkMid }} className="max-w-xl mx-auto">Everything you need to understand, configure, and extend UrbanFlow.</p>
        </div>
        <div className="flex flex-col gap-3">
          {DOCS.map((d,i) => <DocItem key={d.title} {...d} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ── Download ──────────────────────────────────────────────────────────────────
function DownloadSection() {
  const [ref, vis] = useReveal();
  return (
    <section id="download" className="py-28 px-6 relative overflow-hidden" style={{ background:T.ink }}>
      <FlowLines opacity={0.065} color={T.bg} vertical />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div ref={ref} className={`transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest mb-3 block" style={{ color:"rgba(245,240,232,0.38)", fontFamily:"'Space Mono',monospace" }}>// RELEASE</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Orbitron',sans-serif", color:T.bg }}>Get UrbanFlow</h2>
          <p className="mb-12" style={{ color:"rgba(245,240,232,0.5)" }}>Download the latest stable release or explore the source on GitHub.</p>

          <div className="rounded-2xl p-10 mb-8"
            style={{ border:"1px solid rgba(245,240,232,0.1)", background:"rgba(245,240,232,0.03)" }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background:"rgba(245,240,232,0.08)", color:T.bg, border:"1px solid rgba(245,240,232,0.18)", fontFamily:"'Space Mono',monospace" }}>v1.0.0</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background:"rgba(76,175,80,0.12)", color:"#81C784", border:"1px solid rgba(76,175,80,0.22)", fontFamily:"'Space Mono',monospace" }}>STABLE</span>
            </div>
            <div className="text-5xl font-black mb-3" style={{ fontFamily:"'Orbitron',sans-serif", color:T.bg }}>UrbanFlow</div>
            <p className="mb-8 text-sm" style={{ color:"rgba(245,240,232,0.38)" }}>Windows 64-bit · ~45 MB · Includes sample datasets</p>

            {/* Primary buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a href={LINKS.github}
                  target="_blank"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
                style={{ background:T.bg, color:T.ink, fontFamily:"'Space Mono',monospace", boxShadow:"4px 4px 0 rgba(245,240,232,0.08)" }}>
                <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" /> Download .exe
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
                style={{ border:"2px solid rgba(245,240,232,0.28)", color:T.bg, background:"transparent", fontFamily:"'Space Mono',monospace" }}>
                View Source
                </a>
            </div>

            {/* Tool resource buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-5"
              style={{ borderTop:"1px solid rgba(245,240,232,0.08)" }}>
              <span className="text-xs w-full mb-1"
                style={{ color:"rgba(245,240,232,0.3)", fontFamily:"'Space Mono',monospace" }}>EXTERNAL RESOURCES</span>
              <a href={LINKS.mapng} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background:"rgba(245,240,232,0.07)", border:"1px solid rgba(245,240,232,0.16)", color:T.bg, fontFamily:"'Space Mono',monospace" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(245,240,232,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(245,240,232,0.07)"}>
                <Map size={16} /> MapNG <ExternalLink size={11} style={{ opacity:0.45 }} />
              </a>
              <a href={LINKS.sumo} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background:"rgba(245,240,232,0.07)", border:"1px solid rgba(245,240,232,0.16)", color:T.bg, fontFamily:"'Space Mono',monospace" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(245,240,232,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(245,240,232,0.07)"}>
                <Car size={16} /> SUMO Simulator <ExternalLink size={11} style={{ opacity:0.45 }} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[["~45 MB","Download Size"],["Windows 10/11","Platform"],["MIT License","Open Source"]].map(([v,l]) => (
              <div key={l} className="p-4 rounded-xl"
                style={{ background:"rgba(245,240,232,0.04)", border:"1px solid rgba(245,240,232,0.07)" }}>
                <div className="font-bold text-sm mb-1" style={{ color:T.bg, fontFamily:"'Space Mono',monospace" }}>{v}</div>
                <div className="text-xs" style={{ color:"rgba(245,240,232,0.3)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name:"Raghvendra Pratap Singh", role:"Simulation Core" },
   { name:"Anurag Verma",   role:"Frontend & Backend" },
  { name:"Awnish Yadav",  role:"Researcher" },
 
];

function About() {
  const [ref, vis] = useReveal();
  return (
    <section id="about" className="py-28 px-6" style={{ background:T.bg }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest mb-3 block" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>// THE TEAM</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>About UrbanFlow</h2>
          <p style={{ color:T.inkMid }} className="max-w-2xl mx-auto">An academic team project bridging traffic flow theory with practical infrastructure planning tooling.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-8 rounded-2xl" style={{ background:T.bgMid, border:`1px solid ${T.line}` }}>
            <h3 className="font-bold mb-4 text-lg" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>The Project</h3>
            <p className="text-sm leading-relaxed" style={{ color:T.inkMid }}>UrbanFlow bridges academic traffic flow theory and practical infrastructure planning. The C++ core delivers performance at scale — thousands of individual vehicles — while capturing emergent phenomena like traffic waves and bottleneck formation. Network input is compatible with MapNG and SUMO formats.</p>
          </div>
          <div className="p-8 rounded-2xl" style={{ background:T.bgMid, border:`1px solid ${T.line}` }}>
            <h3 className="font-bold mb-5 text-lg" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Mentor</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                style={{ background:T.ink, color:T.bg, fontFamily:"'Orbitron',sans-serif" }}>NA</div>
              <div>
                <div className="font-bold text-lg" style={{ color:T.ink }}>Mrs. Neha Anand</div>
                <div className="text-sm font-bold" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>Project Mentor &amp; Guide</div>
                <p className="text-xs mt-1" style={{ color:T.inkFaint }}>Faculty Advisor, Department of Computer Science</p>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-center font-bold mb-8 text-xl" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Team Members</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map(({ name, role }, i) => {
            const [r, v] = useReveal();
            const bgs = [T.ink,"#3A2E1A","#1A3028","#2A1A3A"];
            const initials = name.split(" ").map(w=>w[0]).join("");
            return (
              <div key={name} ref={r}
                className={`p-6 rounded-2xl text-center transition-all duration-500 ${v?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}
                style={{ transitionDelay:`${i*80}ms`, background:T.bgMid, border:`1px solid ${T.line}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.ink; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.line; e.currentTarget.style.transform=""; }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mx-auto mb-4"
                  style={{ background:bgs[i], color:T.bg, fontFamily:"'Orbitron',sans-serif" }}>{initials}</div>
                <div className="font-bold text-sm mb-1" style={{ color:T.ink }}>{name}</div>
                <div className="text-xs" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>{role}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const [ref, vis] = useReveal();
  const handle = e => setForm(f => ({ ...f, [e.target.name]:e.target.value }));
  const submit = e => { e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),3500); setForm({name:"",email:"",message:""}); };
  const rowSt = { background:T.bgMid, border:`1px solid ${T.line}`, borderRadius:"0.75rem", display:"flex", alignItems:"center", gap:"0.75rem", padding:"1rem" };
  return (
    <section id="contact" className="py-28 px-6" style={{ background:T.bgMid }}>
      <div className="max-w-2xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest mb-3 block" style={{ color:T.inkFaint, fontFamily:"'Space Mono',monospace" }}>// GET IN TOUCH</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Contact</h2>
          <p style={{ color:T.inkMid }}>Questions, collaboration requests, or bug reports — we'd love to hear from you.</p>
        </div>
        <div className="p-8 md:p-10 rounded-2xl" style={{ background:T.bg, border:`1px solid ${T.line}` }}>
          {sent ? (
            <div className="text-center py-14">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4"
                style={{ background:T.ink, color:T.bg }}>✓</div>
              <p className="font-black text-xl mb-2" style={{ fontFamily:"'Orbitron',sans-serif", color:T.ink }}>Message Sent!</p>
              <p className="text-sm" style={{ color:T.inkFaint }}>We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div style={rowSt}>
                <User size={15} style={{ color:T.inkFaint, flexShrink:0 }} />
                <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handle} required
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontFamily:"'Space Mono',monospace", fontSize:"0.875rem", color:T.ink }} />
              </div>
              <div style={rowSt}>
                <Mail size={15} style={{ color:T.inkFaint, flexShrink:0 }} />
                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handle} required
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontFamily:"'Space Mono',monospace", fontSize:"0.875rem", color:T.ink }} />
              </div>
              <div style={{ ...rowSt, alignItems:"flex-start" }}>
                <MessageSquare size={15} style={{ color:T.inkFaint, flexShrink:0, marginTop:"2px" }} />
                <textarea name="message" placeholder="Your message..." value={form.message} onChange={handle} required rows={5}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", resize:"none", fontFamily:"'Space Mono',monospace", fontSize:"0.875rem", color:T.ink }} />
              </div>
              <button type="submit"
                className="py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02]"
                style={{ background:T.ink, color:T.bg, fontFamily:"'Space Mono',monospace", boxShadow:"4px 4px 0 rgba(26,26,26,0.12)" }}>
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const scroll = id => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" });
  return (
    <footer style={{ background:T.ink, borderTop:"1px solid rgba(245,240,232,0.07)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo dark />
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {["Features","Demo","Docs","Download","About","Contact"].map(l => (
              <button key={l} onClick={() => scroll(l)}
                className="text-xs transition-colors hidden md:block"
                style={{ fontFamily:"'Space Mono',monospace", color:"rgba(245,240,232,0.38)" }}
                onMouseEnter={e => e.currentTarget.style.color=T.bg}
                onMouseLeave={e => e.currentTarget.style.color="rgba(245,240,232,0.38)"}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <a href={LINKS.mapng} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ border:"1px solid rgba(245,240,232,0.13)", color:"rgba(245,240,232,0.45)", fontFamily:"'Space Mono',monospace" }}
              onMouseEnter={e => { e.currentTarget.style.color=T.bg; e.currentTarget.style.borderColor="rgba(245,240,232,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="rgba(245,240,232,0.45)"; e.currentTarget.style.borderColor="rgba(245,240,232,0.13)"; }}>
              <Map size={12}/> MapNG
            </a>
            <a href={LINKS.sumo} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ border:"1px solid rgba(245,240,232,0.13)", color:"rgba(245,240,232,0.45)", fontFamily:"'Space Mono',monospace" }}
              onMouseEnter={e => { e.currentTarget.style.color=T.bg; e.currentTarget.style.borderColor="rgba(245,240,232,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="rgba(245,240,232,0.45)"; e.currentTarget.style.borderColor="rgba(245,240,232,0.13)"; }}>
              <Car size={12}/> SUMO
            </a>
            <a href={LINKS.github} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg transition-all"
              style={{ border:"1px solid rgba(245,240,232,0.13)", color:"rgba(245,240,232,0.45)" }}
              onMouseEnter={e => { e.currentTarget.style.color=T.bg; e.currentTarget.style.borderColor="rgba(245,240,232,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="rgba(245,240,232,0.45)"; e.currentTarget.style.borderColor="rgba(245,240,232,0.13)"; }}>
             Github
            </a>
            <button onClick={() => scroll("download")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background:T.bg, color:T.ink, fontFamily:"'Space Mono',monospace" }}>
              <Download size={12}/> Download
            </button>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-xs"
          style={{ borderTop:"1px solid rgba(245,240,232,0.07)", color:"rgba(245,240,232,0.2)", fontFamily:"'Space Mono',monospace" }}>
          © 2024 UrbanFlow Team · Academic Project · Guided by Mrs. Neha Anand · github.com/TOY-ruki/UrbanFlow
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  
  const [user,setuser] = useState("");
  const host = import.meta.env.VITE_LOCAL_HOST;
  const navigate = useNavigate();

  const fetchUser= async()=>{

   await axios.get(host+"/user/fetchUser",{withCredentials:true})
   .then(res=>{
  
    setuser(res.data.user)
    if(res.data.path){
      navigate(res.data.path)
    }
  })
   .catch(err => console.log(err))

  }
  useEffect(()=>{
    fetchUser();
  },[])
  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <Navbar user={user}/>
      <Hero />
      <StatsBanner />
      <Features />
      <Demo />
      <Docs />
      <DownloadSection />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
