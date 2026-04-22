import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Link, useNavigate } from "react-router";
import OverlaySpinner from './Spinner';

const RegisterPage = () => {

    const navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [password, setpassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const host = import.meta.env.VITE_LOCAL_HOST;
    const notifySucess = (text) => toast.success(text);
    const notifywarn = (text) => toast.warn(text);

    function isValidGmail(email) {

  const standardRegex = /^(?=[a-z0-9.]{6,30}@)(?!.*?\.\.)[a-z0-9][a-z0-9.]*[a-z0-9]@gmail\.com$/;
  
  return standardRegex.test(email.toLowerCase());
}

    const RegisterButton = async () => {

        if (email && firstName && lastName && password && confirmPassword) {
            if (password == confirmPassword) {
                if(!isValidGmail(email)){
                    notifywarn("Email not Valid");
                    return;
                }
                setLoading(true);
                const details = {
                    email,
                    firstName,
                    lastName,
                    password
                }


                try {

                    await axios
                        .post(host + "/user/registration", details)
                        .then((res) => {


                            if (res.data.message) {
                                notifySucess(res.data.message)
                            }
                            if (res.data.error) {
                                notifywarn(res.data.error)
                            }
                            if (res.data.path) {

                                navigate(res.data.path);


                            }
                        })
                        .catch((err) => console.log(err));

                } catch (err) {
                    console.log(err);
                }

                setLoading(false);
            } else {
                notifywarn("Password doesn't Match");
            }


        } else {
            notifywarn("Fill all the details");
        }
    }

    return (
        <div className="min-h-screen  bg-[#F4F1EA] text-[#332D26] font-sans relative overflow-hidden">
            {loading && <OverlaySpinner />}
            {/* Background Grid Lines */}

            <Link onClick={() => console.log("hello")}
                className="flex z-99 absolute top-10 right-10 items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                style={{ background: "#1A1A1A", color: "#F5F0E8", fontFamily: "'Space Mono', monospace" }}
                to="/">Home</Link>

            <ToastContainer />
            <div className="absolute inset-0 flex justify-between px-10 pointer-events-none opacity-10">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-px h-full bg-[#332D26]"></div>
                ))}
            </div>



            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center pt-20 px-6">
                {/* Decorative Badge */}
                <div className="mb-8 flex items-center gap-2 bg-[#E6E2D8] px-4 py-1 rounded-full border border-[#D9D4C9]">
                    <div className="w-2 h-2 bg-[#1A1A1A] rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Create Researcher Account</span>
                </div>

                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-center mb-2 tracking-tight">Join the Flow.</h1>
                    <p className="text-center text-sm opacity-60 mb-10 leading-relaxed">
                        Access our high-fidelity microscopic simulation engine and begin modeling real-time traffic dynamics.
                    </p>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setfirstName(e.target.value)}
                                className="bg-transparent border border-[#D9D4C9] p-3 rounded-sm focus:outline-none focus:border-[#332D26] transition-all"
                                placeholder="Jane"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Last Name</label>
                            <input
                                value={lastName}
                                onChange={(e) => setlastName(e.target.value)}
                                type="text"
                                className="bg-transparent border border-[#D9D4C9] p-3 rounded-sm focus:outline-none focus:border-[#332D26] transition-all"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Work Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="bg-transparent border border-[#D9D4C9] p-3 rounded-sm focus:outline-none focus:border-[#332D26] transition-all"
                            placeholder="name@institution.edu"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            type="password"
                            className="bg-transparent border border-[#D9D4C9] p-3 rounded-sm focus:outline-none focus:border-[#332D26] transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Confirm Password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                            type="password"
                            className="bg-transparent border border-[#D9D4C9] p-3 rounded-sm focus:outline-none focus:border-[#332D26] transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>

                    </div>

                    <button onClick={() => { RegisterButton() }} className="w-full cursor-pointer bg-[#1A1A1A] text-white py-4 mt-4 font-bold tracking-tight hover:bg-black transition-transform active:scale-[0.98]">
                        Register Account
                    </button>

                    <p className="text-sm text-center mt-6 opacity-60">Already have an account? <Link to="/login" className='font-bold'>Login</Link></p>






                </div>
            </main>

            {/* Footer / Tech Stack */}
            <footer className="mt-20 pb-10 flex flex-col items-center gap-4 opacity-50">
                <p className="text-[10px] font-bold tracking-widest uppercase">Integration Partners</p>
                <div className="flex gap-4">
                    <div className="px-3 py-1 border border-[#D9D4C9] text-[10px] font-bold rounded-sm">MapNG</div>
                    <div className="px-3 py-1 border border-[#D9D4C9] text-[10px] font-bold rounded-sm">SUMO Simulator</div>
                </div>
            </footer>
        </div>
    );
};

export default RegisterPage;
