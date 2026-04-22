import React,{useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Link, useNavigate } from "react-router";
import OverlaySpinner from './Spinner';

const LoginPage = () => {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const host = import.meta.env.VITE_LOCAL_HOST;
  const [result, setresult] = useState("");
  const[loading,setloading] = useState(false);
  const navigate = useNavigate();
  const notifySucess = (text) => toast.success(text);
    const notifywarn = (text) => toast.warn(text);
    function isValidGmail(email) {
  const gmailRegex = /^(?=[a-z0-9.]{6,30}@) (?!.*?\.\.) [a-z0-9] [a-z0-9.]* [a-z0-9] @gmail\.com$/x;
  const standardRegex = /^(?=[a-z0-9.]{6,30}@)(?!.*?\.\.)[a-z0-9][a-z0-9.]*[a-z0-9]@gmail\.com$/;
  
  return standardRegex.test(email.toLowerCase());
}

  const loginButton = async () => {
   
    if (email && pass) {
      if(!isValidGmail(email)){
          notifywarn("Email not Valid");
        return;
      }
      setloading(true);
      const loginDetails = {
        email,
        pass,
      };
      try {
        await axios
          .post(host + "/user/login", loginDetails, { withCredentials: true })
          .then((res) => {
            setresult(res.data);
            if (res.data.message) {
              notifySucess(res.data.message);
            }
            if (res.data.error) {
              notifywarn(res.data.error);
            }
            if (res.data.path) {
              setTimeout(() => {
                navigate(res.data.path);
              }, 1000);
            }
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
      setloading(false);
    } else {
      notifywarn("Fill all the details");
    }
  
}
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#332D26] font-sans relative overflow-hidden flex flex-col">
      {loading && <OverlaySpinner/>}
<ToastContainer/>

      <Link onClick={() => console.log("hello")}
        className="flex z-99 absolute top-10 right-10 items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
        style={{ background: "#1A1A1A", color: "#F5F0E8", fontFamily: "'Space Mono', monospace" }}
        to="/">Home</Link>

      {/* Background Grid Lines */}
      <div className="absolute inset-0 flex justify-between px-10 pointer-events-none opacity-10">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-px h-full bg-[#332D26]"></div>
        ))}
      </div>



      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Large Decorative background text "UF" (like in your image) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] font-bold text-[#332D26] opacity-[0.03] select-none pointer-events-none">
          UF
        </div>

        <div className="w-full max-w-sm relative">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-sm opacity-60">Enter your credentials to access the simulator.</p>
          </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 ml-1">
              Email Address
            </label>
            <input
              type="email"
          value={email}
          onChange={(e)=>{setemail(e.target.value)}}
                className="bg-white/50 backdrop-blur-sm border border-[#D9D4C9] p-4 rounded-sm focus:outline-none focus:border-[#332D26] focus:bg-white transition-all shadow-sm"
              placeholder="researcher@urbanflow.io"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                Password
              </label>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                Forgot?
              </a>
            </div>
            <input
            value={pass}
            onChange={(e)=>{setpass(e.target.value)}}
              type="password"
              className="bg-white/50 backdrop-blur-sm border border-[#D9D4C9] p-4 rounded-sm focus:outline-none focus:border-[#332D26] focus:bg-white transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button onClick={()=>{loginButton()}} className="w-full bg-[#1A1A1A] text-white py-4 mt-2 font-bold tracking-tight flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]">
            Sign In
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
          <p className="text-sm text-center mt-6 opacity-60">Don't have an account? <Link to="/register" className='font-bold'>Register here</Link></p>




        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-8 flex flex-col items-center opacity-30">
        <div className="text-[10px] font-bold tracking-[0.3em] uppercase">
          Microscopic Traffic Simulation Engine
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
