import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Loader2, Upload, X, Trash2, FileText } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        file: user?.profile?.resume || "",
        photo: user?.profile?.profilePhoto || ""
    });

    // Interactive Skills Array state
    const [skillsArray, setSkillsArray] = useState(user?.profile?.skills || []);
    const [skillInput, setSkillInput] = useState("");

    // Resume Removal state
    const [removeResume, setRemoveResume] = useState(false);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        setRemoveResume(false); // If they upload a new file, do not remove it
    }

    const photoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, photo: file })
    }

    // Add Skill Tag Handler
    const handleAddSkill = (e) => {
        if (e) e.preventDefault();
        const trimmed = skillInput.trim();
        if (trimmed && !skillsArray.includes(trimmed)) {
            setSkillsArray([...skillsArray, trimmed]);
            setSkillInput("");
        }
    };

    // Remove Skill Tag Handler
    const handleRemoveSkill = (skillToRemove) => {
        setSkillsArray(skillsArray.filter(skill => skill !== skillToRemove));
    };

    // Handle pressing Enter inside the skills input to add a skill (preventing form submit)
    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        
        if (user?.role === 'student') {
            // Join skills as a comma-separated string for backend compatibility
            formData.append("skills", skillsArray.join(","));
            formData.append("removeResume", removeResume ? "true" : "false");
        }

        if (input.photo && typeof input.photo !== 'string') {
            formData.append("file", input.photo);
        } else if (input.file && typeof input.file !== 'string' && !removeResume) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[450px] bg-white border border-slate-200/90 backdrop-blur-xl rounded-3xl text-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#6A38C2]/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <DialogHeader className="relative border-b border-slate-100 pb-3">
                        <DialogTitle className="font-bold text-2xl text-slate-900 tracking-tight">Edit Profile Info</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={submitHandler} className="space-y-4 pt-2">
                        <div className='space-y-4'>
                            
                            {/* Full Name input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3 bg-slate-50/50 border border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-[#6A38C2] rounded-xl px-4 py-5 text-sm"
                                    required
                                />
                            </div>

                            {/* Email input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3 bg-slate-50/50 border border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-[#6A38C2] rounded-xl px-4 py-5 text-sm"
                                    required
                                />
                            </div>

                            {/* Phone number input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase">Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3 bg-slate-50/50 border border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-[#6A38C2] rounded-xl px-4 py-5 text-sm"
                                    required
                                />
                            </div>

                            {/* Bio input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3 bg-slate-50/50 border border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-[#6A38C2] rounded-xl px-4 py-5 text-sm"
                                />
                            </div>

                            {/* Photo upload input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="photo" className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase">Photo</Label>
                                <div className="col-span-3 relative">
                                    <input
                                        id="photo"
                                        name="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={photoChangeHandler}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="photo"
                                        className="flex items-center gap-2.5 px-4 py-2.5 border border-slate-200 bg-slate-50/40 hover:bg-slate-100/60 hover:border-slate-300 rounded-xl cursor-pointer transition-all duration-300 text-slate-650 text-xs font-semibold w-full overflow-hidden shadow-sm"
                                    >
                                        <Upload className="w-4 h-4 text-[#6A38C2] flex-shrink-0" />
                                        <span className="truncate">
                                            {input.photo ? (typeof input.photo === 'string' ? "Replace Photo" : input.photo.name) : "Upload Photo"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* STUDENT ONLY: INTERACTIVE SKILLS TAG BUILDER */}
                            {user?.role === 'student' && (
                                <>
                                    <div className='grid grid-cols-4 gap-4 items-start pt-1'>
                                        <Label className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase mt-3">Skills</Label>
                                        
                                        <div className="col-span-3 space-y-3">
                                            {/* Renders active tags list */}
                                            {skillsArray.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-150 rounded-xl max-h-36 overflow-y-auto">
                                                    {skillsArray.map((skill, index) => (
                                                        <Badge 
                                                            key={index} 
                                                            className="bg-[#6A38C2]/5 text-[#6A38C2] border border-[#6A38C2]/10 hover:bg-[#6A38C2]/10 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-colors uppercase tracking-wide"
                                                            variant="outline"
                                                        >
                                                            {skill}
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleRemoveSkill(skill)}
                                                                className="text-[#6A38C2] hover:text-rose-600 focus:outline-none transition-colors"
                                                            >
                                                                <X className="w-3 h-3 shrink-0" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Tag input deck */}
                                            <div className="flex gap-2">
                                                <Input
                                                    id="skills-tag"
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={handleSkillKeyDown}
                                                    placeholder="Type skill and press Enter"
                                                    className="flex-grow bg-slate-50/50 border border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-[#6A38C2] rounded-xl px-4 py-4 text-xs font-semibold"
                                                />
                                                <Button 
                                                    type="button" 
                                                    onClick={handleAddSkill}
                                                    className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs px-4"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STUDENT ONLY: DYNAMIC RESUME ATTACHMENT / REMOVAL */}
                                    <div className='grid grid-cols-4 items-center gap-4 pt-1'>
                                        <Label htmlFor="file" className="text-right text-slate-500 font-semibold text-xs tracking-wider uppercase font-bold">Resume</Label>
                                        
                                        <div className="col-span-3">
                                            {/* If resume is attached and removeResume is false, show custom file card with trash action */}
                                            {user?.profile?.resume && !removeResume ? (
                                                <div className="flex items-center justify-between border border-blue-100 bg-blue-50/30 p-2.5 rounded-xl">
                                                    <div className="flex items-center gap-2 min-w-0 pr-4">
                                                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                        <span className="truncate text-xs font-bold text-blue-650">
                                                            {user?.profile?.resumeOriginalName || "Current Attached Resume.pdf"}
                                                        </span>
                                                    </div>
                                                    
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setRemoveResume(true);
                                                            setInput({ ...input, file: "" });
                                                        }}
                                                        className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100/50"
                                                        title="Delete Resume File"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        id="file"
                                                        name="file"
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={fileChangeHandler}
                                                        className="hidden"
                                                    />
                                                    <label 
                                                        htmlFor="file"
                                                        className="flex items-center gap-2.5 px-4 py-2.5 border border-slate-200 bg-slate-50/40 hover:bg-slate-100/60 hover:border-slate-300 rounded-xl cursor-pointer transition-all duration-300 text-slate-650 text-xs font-semibold w-full overflow-hidden shadow-sm"
                                                    >
                                                        <Upload className="w-4 h-4 text-[#6A38C2] flex-shrink-0" />
                                                        <span className="truncate">
                                                            {input.file && typeof input.file !== 'string' ? input.file.name : "Upload Resume (PDF)"}
                                                        </span>
                                                    </label>
                                                    {removeResume && (
                                                        <div className="text-[10px] text-rose-500 font-bold mt-1 animate-pulse">
                                                            Previous resume marked for removal. Submit to save.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <DialogFooter className="pt-4 border-t border-slate-100 mt-2">
                            {loading ? (
                                <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] text-white opacity-80 cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                    Securing profile updates...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full py-6 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#a78bfa] text-white font-bold shadow-lg shadow-[#6A38C2]/15 hover:shadow-[#6A38C2]/30 transition-all duration-300"
                                >
                                    Update Details
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog