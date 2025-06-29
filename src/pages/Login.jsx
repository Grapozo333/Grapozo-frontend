import React, { useState } from 'react'
import { EyeOff, Eye, Lock, Users, Shield, Zap } from 'lucide-react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Login = () => {
    useScrollToTop()
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-2xl rounded-2xl p-8 border border-green-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back to ADash</h1>
                            <p className="text-gray-600">Sign in to your account</p>
                        </div>

                        <div className='space-y-6'>
                            <div className='space-y-2'>
                                <label htmlFor='email' className="block text-sm font-semibold text-gray-700">Email Address</label>
                                <input
                                    type='email'
                                    id='email'
                                    autoFocus
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
                                        placeholder='Enter your password'
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(preve => !preve)}
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-green-500 hover:text-green-700 transition-colors'
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <Link 
                                        to={"/forgot-password"} 
                                        className='text-sm text-green-600 hover:text-green-700 transition-colors hover:underline'
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <button 
                                disabled={!valideValue} 
                                onClick={handleSubmit}
                                className={`cursor-pointer w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                                    valideValue
                                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {valideValue ? "Sign In" : "Fill all fields"}
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to={"/register"} className='font-semibold text-green-600 hover:text-green-700 transition-colors hover:underline'>
                                    Create Account
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
                        Welcome back to your dashboard
                    </h2>
                    
                    <div className="space-y-6 mb-12">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
                                <p className="text-white/80">Your account is protected with advanced security measures and encryption.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Quick Access</h3>
                                <p className="text-white/80">Get instant access to your orders, preferences, and personalized recommendations.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                                <p className="text-white/80">Our dedicated support team is always ready to help you with any queries.</p>
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
                            <span className="ml-3 text-sm font-medium">Active users</span>
                        </div>
                        <p className="text-white/90 text-sm">
                            "ADash has transformed how I shop online. Quick, reliable, and always delivers on time!"
                        </p>
                        <p className="text-white/70 text-xs mt-2">- Michael Chen, Premium Member</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login