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
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
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
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-[#6A38C2]/30 selection:text-white">
            <Navbar />
            
            <div className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
                {/* Background ambient lighting spheres */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6A38C2]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                {/* Signup Glassmorphic Card */}
                <div className="w-full max-w-lg bg-white border border-slate-200/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden z-10 hover:border-slate-300 transition-all duration-300">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#6A38C2]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="text-center mb-8 relative">
                        <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">
                            Join us today! Enter your details to setup a professional account.
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">
                        {/* Full Name Input */}
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="Saurabh Kumar"
                                    className="bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-[#6A38C2] focus-visible:border-[#6A38C2] transition-all duration-300 rounded-xl pl-10 pr-4 py-5 w-full text-sm"
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="saurabh@gmail.com"
                                    className="bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-1 focus-visible:ring-[#6A38C2] focus-visible:border-[#6A38C2] transition-all duration-300 rounded-xl pl-10 pr-4 py-5 w-full text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Number Input */}
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="8858934564"
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

                        {/* Role Selection & Profile Image Row */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 py-1">
                            {/* Role Selectors */}
                            <div className="w-full sm:w-1/2 space-y-2">
                                <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Your Role</Label>
                                <RadioGroup className="flex items-center gap-3 w-full">
                                    <label 
                                        htmlFor="r1"
                                        className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 transition-all duration-300 w-1/2 cursor-pointer select-none ${input.role === 'student' ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2] shadow-[0_0_15px_rgba(106,56,194,0.08)]' : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
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
                                        <span className="font-medium text-xs">Student</span>
                                    </label>
                                    
                                    <label 
                                        htmlFor="r2"
                                        className={`flex items-center space-x-2 border rounded-xl px-3 py-2.5 transition-all duration-300 w-1/2 cursor-pointer select-none ${input.role === 'recruiter' ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2] shadow-[0_0_15px_rgba(106,56,194,0.08)]' : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
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
                                        <span className="font-medium text-xs">Recruiter</span>
                                    </label>
                                </RadioGroup>
                            </div>

                            {/* Custom File Upload */}
                            <div className="w-full sm:w-1/2 space-y-2">
                                <Label className="text-slate-600 font-medium text-xs tracking-wider uppercase">Profile Photo</Label>
                                <div className="relative">
                                    <input
                                        accept="image/*"
                                        type="file"
                                        id="profile-photo"
                                        onChange={changeFileHandler}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="profile-photo"
                                        className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-200 bg-slate-50/30 hover:bg-slate-100/50 hover:border-slate-300 rounded-xl cursor-pointer transition-all duration-300 text-slate-500 text-sm font-medium w-full overflow-hidden"
                                    >
                                        <Upload className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        <span className="truncate text-xs">
                                            {input.file ? input.file.name : "Choose profile photo"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {loading ? (
                            <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] text-white opacity-80 cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#6A38C2]/20">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Forging your profile...</span>
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full py-6 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#a78bfa] text-white font-semibold shadow-lg shadow-[#6A38C2]/20 hover:shadow-[#6A38C2]/45 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Register Account
                            </Button>
                        )}

                        <div className="text-center pt-4">
                            <span className="text-slate-500 text-sm">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-pink-500 hover:from-[#7c3aed] hover:to-pink-400 font-semibold transition-all duration-300 underline underline-offset-4 decoration-pink-500/40 hover:decoration-pink-400"
                                >
                                    Log in
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

export default Signup