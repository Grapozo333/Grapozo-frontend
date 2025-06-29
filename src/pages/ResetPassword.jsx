import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { useScrollToTop } from '../hooks/useScrollToTop';

const ResetPassword = () => {
  useScrollToTop()
  const location = useLocation()
  const navigate = useNavigate()
  const [data,setData] = useState({
    email : "",
    newPassword : "",
    confirmPassword : ""
  })
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)

  const valideValue = Object.values(data).every(el => el)

  useEffect(()=>{
    if(!(location?.state?.data?.success)){
        navigate("/")
    }

    if(location?.state?.email){
        setData((preve)=>{
            return{
                ...preve,
                email : location?.state?.email
            }
        })
    }
  },[])

  const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

  console.log("data reset password",data)

  const handleSubmit = async(e)=>{
    e.preventDefault()

    ///optional 
    if(data.newPassword !== data.confirmPassword){
        toast.error("New password and confirm password must be same.")
        return
    }

    try {
        const response = await Axios({
            ...SummaryApi.resetPassword, //change
            data : data
        })
        
        if(response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success){
            toast.success(response.data.message)
            navigate("/login")
            setData({
                email : "",
                newPassword : "",
                confirmPassword : ""
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
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <p className="text-green-100 mt-2">Create a new secure password</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* Email Display */}
              <div className="text-center bg-green-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  Resetting password for: <span className="font-semibold text-gray-800">{data.email}</span>
                </p>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={data.newPassword}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
                    required
                  />
                  <div 
                    onClick={() => setShowPassword(prev => !prev)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${data.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>At least 8 characters</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white"
                    required
                  />
                  <div 
                    onClick={() => setShowConfirmPassword(prev => !prev)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                  </div>
                </div>
                {data.confirmPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-xs">
                      {data.newPassword === data.confirmPassword ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-red-600">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!valideValue || data.newPassword !== data.confirmPassword}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                  valideValue && data.newPassword === data.confirmPassword
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Change Password</span>
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
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-white rounded-lg shadow-md border border-green-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Password Security Tips
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Use a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid personal information like names or birthdays</li>
            <li>• Don't reuse passwords from other accounts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
