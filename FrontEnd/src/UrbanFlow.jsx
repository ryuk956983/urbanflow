import { useState, useEffect, useRef } from "react";
import { Github, Download, ChevronDown, ChevronUp, Menu, X, Activity, Layers, Zap, Navigation, BarChart2, Cpu, Mail, User, MessageSquare, ExternalLink, Car } from "lucide-react";

// ── Utility: simple scroll-reveal hook ──────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useReveal();
  useEffect(() => {
    if (!vis) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [vis, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = "md" }) {
  const cls = size === "lg" ? "text-3xl" : "text-xl";
  return (
    <span className={`font-black tracking-tight ${cls} select-none`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
      <span style={{ color: "#38BDF8" }}>Urban</span><span className="text-white">Flow</span>
    </span>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Features", "Demo", "Docs", "Download", "About", "Contact"];
  const scroll = (id) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
      style={{ background: scrolled ? "rgba(6,12,28,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(56,189,248,0.12)" : "none" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l} onClick={() => scroll(l)} className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors tracking-wide"
              style={{ fontFamily: "'Space Mono', monospace" }}>{l}</button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-slate-600 hover:border-sky-400 hover:text-sky-400 transition-all"
            style={{ fontFamily: "'Space Mono', monospace" }}>
            <Github size={15} /> GitHub
          </a>
          <a href="#download"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-900 transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", fontFamily: "'Space Mono', monospace" }}
            onClick={e => { e.preventDefault(); scroll("download"); }}>
            <Download size={15} /> Download
          </a>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pt-4 pb-6 flex flex-col gap-4" style={{ background: "rgba(6,12,28,0.98)" }}>
          {links.map(l => <button key={l} onClick={() => scroll(l)} className="text-left text-slate-200 py-2 border-b border-slate-800 hover:text-sky-400 transition-colors">{l}</button>)}
          <div className="flex gap-3 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex-1 text-center py-2 border border-slate-600 rounded-lg text-sm text-white">GitHub</a>
            <a href="#" className="flex-1 text-center py-2 rounded-lg text-sm font-bold text-slate-900" style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)" }}>Download</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated grid bg */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#060C1C 0%,#0A1628 60%,#060C1C 100%)" }} />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(56,189,248,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.3) 1px,transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      {/* Glowing orbs */}
      <div className="absolute" style={{ top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.12),transparent 70%)" }} />
      <div className="absolute" style={{ bottom: "15%", right: "8%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,0.1),transparent 70%)" }} />
      {/* Animated road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" style={{ pointerEvents: "none" }}>
        {[...Array(6)].map((_, i) => (
          <line key={i} x1={`${10 + i * 16}%`} y1="0" x2={`${50}%`} y2="100%"
            stroke="#38BDF8" strokeWidth="1" strokeDasharray="8 16">
            <animate attributeName="stroke-dashoffset" from="0" to="48" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-widest text-sky-300 border border-sky-400/30"
          style={{ background: "rgba(56,189,248,0.08)", fontFamily: "'Space Mono', monospace", animation: "fadeInDown 0.8s ease both" }}>
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          MICROSCOPIC TRAFFIC SIMULATION ENGINE
        </div>

        <h1 className="font-black leading-none mb-6 text-white"
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2.4rem,6vw,5rem)", animation: "fadeInUp 0.9s 0.2s ease both", opacity: 0 }}>
          <span style={{ color: "#38BDF8" }}>Urban</span>Flow
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light tracking-wide"
          style={{ fontFamily: "'Space Mono', monospace", animation: "fadeInUp 0.9s 0.4s ease both", opacity: 0 }}>
          Traffic Simulation for Infrastructure Planning
        </p>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-base leading-relaxed"
          style={{ animation: "fadeInUp 0.9s 0.55s ease both", opacity: 0 }}>
          A high-fidelity microscopic simulation engine that models vehicle-level behavior, shockwave propagation, and real-time traffic dynamics for urban infrastructure research and planning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeInUp 0.9s 0.7s ease both", opacity: 0 }}>
          <a href="#download" onClick={e => { e.preventDefault(); document.getElementById("download")?.scrollIntoView({ behavior: "smooth" }); }}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-slate-900 text-lg transition-all hover:scale-105 hover:shadow-2xl w-full sm:w-auto justify-center"
            style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", boxShadow: "0 0 30px rgba(56,189,248,0.3)", fontFamily: "'Space Mono', monospace" }}>
            <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            Download Now
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 border w-full sm:w-auto justify-center"
            style={{ border: "1px solid rgba(56,189,248,0.4)", background: "rgba(56,189,248,0.06)", fontFamily: "'Space Mono', monospace" }}>
            <Github size={20} className="group-hover:rotate-12 transition-transform" />
            View on GitHub
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-20"
          style={{ animation: "fadeInUp 0.9s 0.85s ease both", opacity: 0 }}>
          {[["C++ Engine", "High Performance"], ["v1.0", "Stable Release"], ["Open Source", "Academic Project"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-black text-sky-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>{v}</div>
              <div className="text-xs text-slate-500 tracking-widest mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
        <span className="text-xs tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>SCROLL</span>
        <ChevronDown size={16} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        html { scroll-behavior: smooth; }
        body { background: #060C1C; }
      `}</style>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Car, title: "Microscopic Vehicle Simulation", desc: "Models each vehicle individually — acceleration, deceleration, lane-change decisions, and spacing behaviors at the agent level." },
  { icon: Activity, title: "Shockwave Detection", desc: "Identifies and propagates traffic shockwaves in real-time, revealing congestion onset and dissolution patterns across the network." },
  { icon: Zap, title: "Real-Time Traffic Flow Analysis", desc: "Computes flow, density, and speed metrics per road segment as simulation runs, enabling live performance monitoring." },
  { icon: Layers, title: "Lane-Based Vehicle Tracking", desc: "Tracks every vehicle per lane with positional accuracy, supporting multi-lane highway and urban arterial scenarios." },
  { icon: BarChart2, title: "Data-Driven Insights", desc: "Exports structured simulation data for post-processing, chart generation, and infrastructure decision support." },
  { icon: Cpu, title: "C++ Simulation Engine", desc: "Built on a high-performance C++ core for fast execution even on large-scale networks with thousands of concurrent vehicles." },
];

function Features() {
  const [ref, vis] = useReveal();
  return (
    <section id="features" className="py-28 px-6" style={{ background: "linear-gradient(180deg,#060C1C,#080F20)" }}>
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest text-sky-400 mb-3 block" style={{ fontFamily: "'Space Mono', monospace" }}>// CAPABILITIES</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>Core Features</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Everything you need to model, analyze, and understand complex urban traffic systems.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => {
            const [r, v] = useReveal();
            return (
              <div key={title} ref={r}
                className={`group p-7 rounded-2xl border transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl cursor-default ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms`, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(56,189,248,0.1)", backdropFilter: "blur(8px)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(56,189,248,0.1)"}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.2),rgba(14,165,233,0.08))", border: "1px solid rgba(56,189,248,0.25)" }}>
                  <Icon size={22} style={{ color: "#38BDF8" }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem" }}>{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Demo / Screenshots ────────────────────────────────────────────────────────
const SCREENSHOTS = [
  { label: "Vehicle Trajectory Visualization", color: "#0EA5E9", icon: Navigation },
  { label: "Shockwave Detection Output", color: "#F59E0B", icon: Activity },
  { label: "Traffic Density Mapping", color: "#10B981", icon: BarChart2 },
  { label: "Lane Occupancy Analysis", color: "#8B5CF6", icon: Layers },
  { label: "Flow-Speed Fundamental Diagram", color: "#EF4444", icon: Zap },
];

function Demo() {
  const [ref, vis] = useReveal();
  return (
    <section id="demo" className="py-28 px-6" style={{ background: "#060C1C" }}>
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest text-sky-400 mb-3 block" style={{ fontFamily: "'Space Mono', monospace" }}>// VISUALIZATIONS</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>Simulation Output</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Screenshots and output visualizations from UrbanFlow's analysis pipeline.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCREENSHOTS.map(({ label, color, icon: Icon }, i) => {
            const [r, v] = useReveal();
            return (
              <div key={label} ref={r}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-700 hover:scale-[1.03] cursor-pointer ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms`, aspectRatio: "16/10" }}>
                {/* Placeholder simulation visual */}
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4"
                  style={{ background: `linear-gradient(135deg,#080F20,#0A1628)`, border: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* Mini road animation */}
                  <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
                    {[...Array(8)].map((_, j) => (
                      <rect key={j} x={`${j * 14}%`} y="45%" width="10%" height="10%" rx="4"
                        fill={color} opacity={0.4 + (j % 3) * 0.2}>
                        <animate attributeName="x" from={`${j * 14}%`} to={`${j * 14 + 14}%`}
                          dur={`${1.2 + j * 0.15}s`} repeatCount="indefinite" />
                      </rect>
                    ))}
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke={color} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
                    <line x1="0" y1="55%" x2="100%" y2="55%" stroke={color} strokeWidth="1" strokeDasharray="6 4" opacity="0.15" />
                  </svg>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center z-10 transition-transform group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg,${color}30,${color}10)`, border: `1px solid ${color}50` }}>
                    <Icon size={28} style={{ color }} />
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase z-10" style={{ color, fontFamily: "'Space Mono', monospace" }}>Preview</span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end p-5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(0deg,${color}30,transparent)` }}>
                  <p className="text-white font-bold text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>{label}</p>
                </div>
                {/* Caption bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 group-hover:translate-y-full"
                  style={{ background: "rgba(6,12,28,0.85)", borderTop: `1px solid ${color}30` }}>
                  <p className="text-slate-300 text-xs font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Documentation ─────────────────────────────────────────────────────────────
const DOCS = [
  {
    title: "How the Simulation Works",
    content: `UrbanFlow uses a car-following model at its core. Each vehicle agent evaluates the distance and speed of the vehicle ahead, then applies acceleration or braking logic based on a configurable headway policy. At every simulation tick (typically 0.1–1.0 seconds), all vehicles update their positions simultaneously. Lane-change decisions are modeled using gap-acceptance logic, allowing vehicles to shift lanes when safe spacing thresholds are met.`
  },
  {
    title: "Input / Output Structure",
    content: `INPUT: A road network definition (nodes, links, lanes), initial vehicle placement, and simulation parameters (duration, timestep, vehicle types). Input is provided as structured configuration files.

OUTPUT: Per-tick CSV/text logs containing vehicle ID, position, speed, lane, and status. Aggregate metrics include flow rate (veh/hr), density (veh/km), mean speed, and shockwave event timestamps. Outputs feed directly into post-processing scripts or visualization tools.`
  },
  {
    title: "Use Cases",
    content: `• Urban Infrastructure Planning: Evaluate proposed road designs, intersection layouts, and signal timings before construction.
• Congestion Analysis: Identify bottlenecks and understand how shockwaves emerge and dissolve under different demand scenarios.
• Academic Research: Study fundamental traffic flow theory, test new car-following models, or validate against real-world datasets.
• Policy Simulation: Model the impact of speed limits, lane restrictions, or demand management strategies.`
  },
  {
    title: "System Requirements",
    content: `• Operating System: Windows 10 / 11 (64-bit)
• Processor: Intel Core i5 or equivalent (multi-core recommended)
• RAM: 4 GB minimum, 8 GB recommended
• Storage: 150 MB for installation
• Runtime: Visual C++ Redistributable (bundled in installer)
• No GPU required for base simulations`
  },
];

function DocItem({ title, content, i }) {
  const [open, setOpen] = useState(false);
  const [ref, vis] = useReveal();
  return (
    <div ref={ref}
      className={`rounded-xl border overflow-hidden transition-all duration-500 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${i * 100}ms`, border: "1px solid rgba(56,189,248,0.15)", background: "rgba(255,255,255,0.02)" }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-sky-400/5 transition-colors group">
        <span className="font-bold text-white group-hover:text-sky-400 transition-colors" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.95rem" }}>{title}</span>
        <span className="text-sky-400 flex-shrink-0 ml-4">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="px-6 pb-6 border-t text-slate-400 text-sm leading-relaxed whitespace-pre-line"
          style={{ borderColor: "rgba(56,189,248,0.1)" }}>{content}</div>
      </div>
    </div>
  );
}

function Docs() {
  const [ref, vis] = useReveal();
  return (
    <section id="docs" className="py-28 px-6" style={{ background: "linear-gradient(180deg,#060C1C,#080F20)" }}>
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest text-sky-400 mb-3 block" style={{ fontFamily: "'Space Mono', monospace" }}>// DOCUMENTATION</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>Technical Docs</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Everything you need to understand, configure, and extend UrbanFlow.</p>
        </div>
        <div className="flex flex-col gap-4">
          {DOCS.map((d, i) => <DocItem key={d.title} {...d} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ── Download ──────────────────────────────────────────────────────────────────
function DownloadSection() {
  const [ref, vis] = useReveal();
  return (
    <section id="download" className="py-28 px-6" style={{ background: "#060C1C" }}>
      <div className="max-w-3xl mx-auto text-center">
        <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest text-sky-400 mb-3 block" style={{ fontFamily: "'Space Mono', monospace" }}>// RELEASE</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>Get UrbanFlow</h2>
          <p className="text-slate-400 mb-12">Ready to simulate traffic? Download the latest stable release or explore the source code.</p>

          <div className="rounded-2xl p-10 mb-8 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.08),rgba(14,165,233,0.04))", border: "1px solid rgba(56,189,248,0.2)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ background: "radial-gradient(circle,#38BDF8,transparent)", borderRadius: "50%", transform: "translate(30%,-30%)" }} />

            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-sky-300 border border-sky-400/30"
                style={{ background: "rgba(56,189,248,0.1)", fontFamily: "'Space Mono', monospace" }}>v1.0.0</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-300 border border-emerald-400/30"
                style={{ background: "rgba(16,185,129,0.1)", fontFamily: "'Space Mono', monospace" }}>STABLE</span>
            </div>

            <div className="text-5xl mb-4" style={{ fontFamily: "'Orbitron', sans-serif", color: "#38BDF8", fontWeight: 900 }}>UrbanFlow</div>
            <p className="text-slate-400 mb-8 text-sm">Windows 64-bit · ~45 MB · Includes sample datasets</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-slate-900 text-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", boxShadow: "0 0 40px rgba(56,189,248,0.25)", fontFamily: "'Space Mono', monospace" }}>
                <Download size={22} className="group-hover:-translate-y-1 transition-transform" />
                Download .exe
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 border"
                style={{ border: "1px solid rgba(56,189,248,0.35)", background: "rgba(56,189,248,0.06)", fontFamily: "'Space Mono', monospace" }}>
                <Github size={22} className="group-hover:rotate-12 transition-transform" />
                View Source
                <ExternalLink size={14} className="text-slate-500" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[["~45 MB", "Download Size"], ["Windows 10/11", "Platform"], ["MIT License", "Open Source"]].map(([v, l]) => (
              <div key={l} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(56,189,248,0.08)" }}>
                <div className="text-sky-400 font-bold text-sm mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>{v}</div>
                <div className="text-slate-500 text-xs">{l}</div>
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
  { name: "Alex Sharma", role: "Simulation Core" },
  { name: "Priya Mehta", role: "Data Analytics" },
  { name: "Rohan Verma", role: "Visualization" },
  { name: "Neha Singh", role: "Frontend & UI" },
];

function About() {
  const [ref, vis] = useReveal();
  return (
    <section id="about" className="py-28 px-6" style={{ background: "linear-gradient(180deg,#060C1C,#080F20)" }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest text-sky-400 mb-3 block" style={{ fontFamily: "'Space Mono', monospace" }}>// THE TEAM</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>About UrbanFlow</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">UrbanFlow was developed as an academic team project, combining expertise in simulation engineering, data analysis, and software development to address real-world urban mobility challenges.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-2xl" style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)" }}>
            <h3 className="text-white font-bold mb-4 text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>The Project</h3>
            <p className="text-slate-400 text-sm leading-relaxed">UrbanFlow was built to bridge the gap between academic traffic flow theory and practical infrastructure planning tools. Using C++ at its core for performance, the engine simulates thousands of individual vehicles while capturing emergent phenomena like traffic waves and bottleneck formation.</p>
          </div>
          <div className="p-8 rounded-2xl" style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)" }}>
            <h3 className="text-white font-bold mb-4 text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>Mentor</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-slate-900"
                style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", fontFamily: "'Orbitron', sans-serif" }}>NA</div>
              <div>
                <div className="text-white font-bold text-lg">Mrs. Neha Anand</div>
                <div className="text-sky-400 text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>Project Mentor & Guide</div>
                <p className="text-slate-500 text-xs mt-1">Faculty Advisor, Department of Computer Science</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-center text-white font-bold mb-8 text-xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>Team Members</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(({ name, role }, i) => {
            const [r, v] = useReveal();
            const initials = name.split(" ").map(w => w[0]).join("");
            const colors = ["#38BDF8", "#10B981", "#F59E0B", "#8B5CF6"];
            return (
              <div key={name} ref={r}
                className={`p-6 rounded-2xl text-center transition-all duration-600 hover:scale-[1.03] ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms`, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mx-auto mb-4 text-slate-900"
                  style={{ background: `linear-gradient(135deg,${colors[i]},${colors[i]}99)`, fontFamily: "'Orbitron', sans-serif" }}>{initials}</div>
                <div className="text-white font-bold text-sm mb-1">{name}</div>
                <div className="text-xs" style={{ color: colors[i], fontFamily: "'Space Mono', monospace" }}>{role}</div>
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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [ref, vis] = useReveal();
  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); setForm({ name: "", email: "", message: "" }); };
  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:ring-2 focus:ring-sky-400/50";
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(56,189,248,0.15)", fontFamily: "'Space Mono', monospace" };
  return (
    <section id="contact" className="py-28 px-6" style={{ background: "#060C1C" }}>
      <div className="max-w-2xl mx-auto">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-bold tracking-widest text-sky-400 mb-3 block" style={{ fontFamily: "'Space Mono', monospace" }}>// GET IN TOUCH</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>Contact</h2>
          <p className="text-slate-400">Have questions about UrbanFlow, want to collaborate, or report an issue? Reach out.</p>
        </div>

        <div className="p-8 md:p-10 rounded-2xl" style={{ background: "rgba(56,189,248,0.03)", border: "1px solid rgba(56,189,248,0.12)" }}>
          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Message Sent!</p>
              <p className="text-slate-400 text-sm">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(56,189,248,0.1)" }}>
                <User size={16} className="text-sky-400 flex-shrink-0" />
                <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handle} required
                  className={inputClass} style={{ ...inputStyle, background: "transparent", border: "none" }} />
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(56,189,248,0.1)" }}>
                <Mail size={16} className="text-sky-400 flex-shrink-0" />
                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handle} required
                  className={inputClass} style={{ ...inputStyle, background: "transparent", border: "none" }} />
              </div>
              <div className="flex gap-3 p-4 rounded-xl items-start" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(56,189,248,0.1)" }}>
                <MessageSquare size={16} className="text-sky-400 flex-shrink-0 mt-1" />
                <textarea name="message" placeholder="Your message..." value={form.message} onChange={handle} required rows={5}
                  className={inputClass + " resize-none"} style={{ ...inputStyle, background: "transparent", border: "none" }} />
              </div>
              <button type="submit"
                className="py-4 rounded-xl font-bold text-slate-900 text-base transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", fontFamily: "'Space Mono', monospace", boxShadow: "0 0 25px rgba(56,189,248,0.2)" }}>
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
  return (
    <footer style={{ background: "#040912", borderTop: "1px solid rgba(56,189,248,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Logo />
            <p className="text-slate-500 text-xs mt-2" style={{ fontFamily: "'Space Mono', monospace" }}>Microscopic Traffic Simulation Engine · v1.0</p>
          </div>
          <div className="flex items-center gap-6">
            {["Features", "Demo", "Docs", "Download", "About", "Contact"].map(l => (
              <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                className="text-slate-500 text-xs hover:text-sky-400 transition-colors hidden md:block"
                style={{ fontFamily: "'Space Mono', monospace" }}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-all border border-slate-800 hover:border-sky-400/30">
              <Github size={18} />
            </a>
            <a href="#download" onClick={e => { e.preventDefault(); document.getElementById("download")?.scrollIntoView({ behavior: "smooth" }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-900 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#38BDF8,#0EA5E9)", fontFamily: "'Space Mono', monospace" }}>
              <Download size={14} /> Download
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800/50 mt-8 pt-8 text-center text-slate-600 text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
          © 2024 UrbanFlow Team · Built as an Academic Project · Guided by Mrs. Neha Anand
        </div>
      </div>
    </footer>
  );
}

// ── Stats Banner ──────────────────────────────────────────────────────────────
function StatsBanner() {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`py-16 px-6 transition-all duration-700 ${vis ? "opacity-100" : "opacity-0"}`}
      style={{ background: "linear-gradient(90deg,rgba(56,189,248,0.08),rgba(14,165,233,0.04),rgba(56,189,248,0.08))", borderTop: "1px solid rgba(56,189,248,0.12)", borderBottom: "1px solid rgba(56,189,248,0.12)" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[["1000", "+", "Vehicles/Sim"], ["60", "fps", "Sim Rate"], ["6", "+", "Output Metrics"], ["1", "v", "Release"]].map(([n, s, l]) => (
          <div key={l}>
            <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <Counter to={parseInt(n)} suffix={s} />
            </div>
            <div className="text-xs text-slate-500 tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: "#060C1C", minHeight: "100vh", fontFamily: "'Space Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <Navbar />
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
