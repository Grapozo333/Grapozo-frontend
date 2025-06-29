import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ForgotPassword = () => {
    useScrollToTop()
    const [data, setData] = useState({
        email: "",
    })
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

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })
                
            }

        } catch (error) {
            AxiosToastError(error)
        }



    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.243-6.243C11.398 9.326 11 8.183 11 7a6 6 0 0112 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
                            <p className="text-green-100 mt-2">Enter your email to reset your password</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <div onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!valideValue}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                                    valideValue 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl' 
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Send OTP</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-gray-600">
                                Remember your password?{' '}
                                <span className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200 cursor-pointer">
                                    Sign In
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        We'll send you a verification code to reset your password
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword


