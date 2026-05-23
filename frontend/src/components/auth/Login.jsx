import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                if (res.data.user.role === 'recruiter') {
                    navigate("/");
                } else {
                    navigate("/home");
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            if (user.role === 'recruiter') {
                navigate("/");
            } else {
                navigate("/home");
            }
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-[#6A38C2]/30 selection:text-white">
            <Navbar />
            
            <div className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
                {/* Background ambient lighting spheres */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6A38C2]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                {/* Login Glassmorphic Card */}
                <div className="w-full max-w-md bg-white border border-slate-200/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden z-10 hover:border-slate-300 transition-all duration-300">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#6A38C2]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="text-center mb-8 relative">
                        <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">
                            Log in to access your dashboard and explore opportunities.
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="name@example.com"
                                    className="bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-[#6A38C2] focus-visible:border-[#6A38C2] transition-all duration-300 rounded-xl pl-10 pr-4 py-5 w-full text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="••••••••••••"
                                    className="bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-[#6A38C2] focus-visible:border-[#6A38C2] transition-all duration-300 rounded-xl pl-10 pr-4 py-5 w-full text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Role Radio Selectors */}
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Select Your Role</Label>
                            <RadioGroup className="flex items-center gap-4 w-full">
                                <label 
                                    htmlFor="r1"
                                    className={`flex items-center space-x-2.5 border rounded-xl px-4 py-3 transition-all duration-300 w-1/2 cursor-pointer select-none ${input.role === 'student' ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2] shadow-[0_0_15px_rgba(106,56,194,0.08)]' : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        id="r1"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                                        required
                                    />
                                    <span className="font-medium text-sm">Student</span>
                                </label>
                                
                                <label 
                                    htmlFor="r2"
                                    className={`flex items-center space-x-2.5 border rounded-xl px-4 py-3 transition-all duration-300 w-1/2 cursor-pointer select-none ${input.role === 'recruiter' ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2] shadow-[0_0_15px_rgba(106,56,194,0.08)]' : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        id="r2"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                                        required
                                    />
                                    <span className="font-medium text-sm">Recruiter</span>
                                </label>
                            </RadioGroup>
                        </div>

                        {/* Submit Button */}
                        {loading ? (
                            <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] text-white opacity-80 cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#6A38C2]/20">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Securing your portal...</span>
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full py-6 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#a78bfa] text-white font-semibold shadow-lg shadow-[#6A38C2]/20 hover:shadow-[#6A38C2]/45 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Login
                            </Button>
                        )}

                        <div className="text-center pt-4">
                            <span className="text-slate-500 text-sm">
                                Don't have an account?{' '}
                                <Link 
                                    to="/signup" 
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-pink-500 hover:from-[#7c3aed] hover:to-pink-400 font-semibold transition-all duration-300 underline underline-offset-4 decoration-pink-500/40 hover:decoration-pink-400"
                                >
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Login