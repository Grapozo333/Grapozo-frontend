import React, { useEffect, useRef, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const OtpVerification = () => {
        useScrollToTop()
    const [data, setData] = useState(["","","","","",""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location",location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    },[])

    const valideValue = data.every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                })
            }

        } catch (error) {
            console.log('error',error)
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
                            <p className="text-green-100 mt-2">Enter the 6-digit code sent to your email</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <div className="space-y-6">
                            {/* Email Display */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Code sent to: <span className="font-semibold text-gray-800">{location?.state?.email}</span>
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                                    Enter Your OTP
                                </label>
                                <div className="flex items-center justify-center gap-3">
                                    {data.map((element, index) => {
                                        return (
                                            <input
                                                key={"otp" + index}
                                                type="text"
                                                id="otp"
                                                ref={(ref) => {
                                                    inputRef.current[index] = ref
                                                    return ref
                                                }}
                                                value={data[index]}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    console.log("value", value)

                                                    const newData = [...data]
                                                    newData[index] = value
                                                    setData(newData)

                                                    if (value && index < 5) {
                                                        inputRef.current[index + 1].focus()
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !data[index] && index > 0) {
                                                        inputRef.current[index - 1].focus()
                                                    }
                                                }}
                                                maxLength={1}
                                                className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700"
                                            />
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Verify OTP</span>
                                </span>
                            </button>

                            {/* Resend Code */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Didn't receive the code?{' '}
                                    <button className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200">
                                        Resend OTP
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <span className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200 cursor-pointer">
                                    Login
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timer Display */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md border border-green-100">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">Code expires in 05:00</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerification



