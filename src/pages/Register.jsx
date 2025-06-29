import React, { useState } from 'react'
import { EyeOff, Eye, ShoppingBag, Users, Shield, Zap, Check, X } from 'lucide-react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';


const Register = () => {
    useScrollToTop()
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const passwordValidation = {
        hasUppercase: /[A-Z]/.test(data.password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password),
        hasNumber: /\d/.test(data.password),
        hasMinLength: data.password.length >= 6
    }
        const isPasswordValid = Object.values(passwordValidation).every(Boolean)


    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        if(data.password !== data.confirmPassword){
            toast.error(
                "password and confirm password must be same"
            )
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
     const PasswordRequirement = ({ met, text }) => (
        <div className={`flex items-center space-x-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
            {met ? <Check size={16} /> : <X size={16} />}
            <span>{text}</span>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
            {/* Left Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-2xl rounded-2xl p-8 border border-green-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ADash</h1>
                            <p className="text-gray-600">Create your account to get started</p>
                        </div>

                        <div className='space-y-6'>
                            <div className='space-y-2'>
                                <label htmlFor='name' className="block text-sm font-semibold text-gray-700">Name</label>
                                <input
                                    type='text'
                                    id='name'
                                    autoFocus
                                    className='w-full px-4 py-3 bg-green-50 border border-green-200 rounded-xl outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all duration-200'
                                    name='name'
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder='Enter your full name'
                                />
                            </div>
                            
                            <div className='space-y-2'>
                                <label htmlFor='email' className="block text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type='email'
                                    id='email'
                                    className='w-full px-4 py-3 bg-green-50 border border-green-200 rounded-xl outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all duration-200'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email address'
                                />
                            </div>
                            
                            <div className='space-y-2'>
                                <label htmlFor='password' className="block text-sm font-semibold text-gray-700">Password</label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id='password'
                                        className='w-full px-4 py-3 pr-12 bg-green-50 border border-green-200 rounded-xl outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all duration-200'
                                        name='password'
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder='Create a strong password'
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(preve => !preve)}
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-green-500 hover:text-green-700 transition-colors'
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {(showPasswordRequirements || data.password) && (
                                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                                        <div className="space-y-2">
                                            <PasswordRequirement 
                                                met={passwordValidation.hasMinLength} 
                                                text="At least 6 characters long" 
                                            />
                                            <PasswordRequirement 
                                                met={passwordValidation.hasUppercase} 
                                                text="One uppercase letter (A-Z)" 
                                            />
                                            <PasswordRequirement 
                                                met={passwordValidation.hasNumber} 
                                                text="One number (0-9)" 
                                            />
                                            <PasswordRequirement 
                                                met={passwordValidation.hasSpecialChar} 
                                                text="One special character (!@#$%^&*)" 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className='space-y-2'>
                                <label htmlFor='confirmPassword' className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                                <div className='relative'>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id='confirmPassword'
                                        className='w-full px-4 py-3 pr-12 bg-green-50 border border-green-200 rounded-xl outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all duration-200'
                                        name='confirmPassword'
                                        value={data.confirmPassword}
                                        onChange={handleChange}
                                        placeholder='Confirm your password'
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(preve => !preve)}
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-green-500 hover:text-green-700 transition-colors'
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                disabled={!valideValue} 
                                onClick={handleSubmit}
                                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 cursor-pointer ${
                                    valideValue
                                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {valideValue ? "Create Account" : "Fill all fields"}
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to={"/login"} className='font-semibold text-green-600 hover:text-green-700 transition-colors hover:underline'>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Features/Benefits */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-green-600 to-green-800">
                <div className="text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-8 leading-tight">
                        Join thousands of happy customers
                    </h2>
                    
                    <div className="space-y-6 mb-12">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Growing Community</h3>
                                <p className="text-white/80">Join over 50,000+ satisfied customers who trust ADash for their daily needs.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Secure & Safe</h3>
                                <p className="text-white/80">Your data is protected with enterprise-grade security and encryption.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                                <p className="text-white/80">Experience blazing fast delivery and seamless shopping experience.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center mb-3">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="ml-3 text-sm font-medium">+2,500 this week</span>
                        </div>
                        <p className="text-white/90 text-sm">
                            "Best shopping experience I've ever had! The quality and service are unmatched."
                        </p>
                        <p className="text-white/70 text-xs mt-2">- Sarah Johnson, Verified Customer</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register