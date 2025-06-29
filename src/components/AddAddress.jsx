import React from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-hidden'>
                {/* Header */}
                <div className='bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                                </svg>
                                Add New Address
                            </h2>
                            <p className='text-green-100 mt-1'>Fill in your delivery details</p>
                        </div>
                        <button 
                            onClick={close} 
                            className='cursor-pointer text-white hover:text-red-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full'
                            type='button'
                        >
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form className='p-6 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                    {/* Address Line */}
                    <div className='space-y-2'>
                        <label htmlFor='addressline' className='block text-sm font-semibold text-gray-700'>
                            Address Line <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            id='addressline'
                            placeholder='Enter your full address'
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.addressline 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-200 bg-green-50 hover:border-green-300'
                            }`}
                            {...register("addressline", {
                                required: "Address line is required",
                                minLength: {
                                    value: 10,
                                    message: "Address must be at least 10 characters long"
                                }
                            })}
                        />
                        {errors.addressline && (
                            <p className='text-red-500 text-sm flex items-center gap-1'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                </svg>
                                {errors.addressline.message}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div className='space-y-2'>
                        <label htmlFor='city' className='block text-sm font-semibold text-gray-700'>
                            City <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            id='city'
                            placeholder='Enter city name'
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.city 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-200 bg-green-50 hover:border-green-300'
                            }`}
                            {...register("city", {
                                required: "City is required",
                                pattern: {
                                    value: /^[a-zA-Z\s]+$/,
                                    message: "City name should only contain letters"
                                }
                            })}
                        />
                        {errors.city && (
                            <p className='text-red-500 text-sm flex items-center gap-1'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                </svg>
                                {errors.city.message}
                            </p>
                        )}
                    </div>

                    {/* State */}
                    <div className='space-y-2'>
                        <label htmlFor='state' className='block text-sm font-semibold text-gray-700'>
                            State <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            id='state'
                            placeholder='Enter state name'
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.state 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-200 bg-green-50 hover:border-green-300'
                            }`}
                            {...register("state", {
                                required: "State is required",
                                pattern: {
                                    value: /^[a-zA-Z\s]+$/,
                                    message: "State name should only contain letters"
                                }
                            })}
                        />
                        {errors.state && (
                            <p className='text-red-500 text-sm flex items-center gap-1'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                </svg>
                                {errors.state.message}
                            </p>
                        )}
                    </div>

                    {/* Pincode and Country Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Pincode */}
                        <div className='space-y-2'>
                            <label htmlFor='pincode' className='block text-sm font-semibold text-gray-700'>
                                Pincode <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                id='pincode'
                                placeholder='Enter pincode'
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.pincode 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-200 bg-green-50 hover:border-green-300'
                                }`}
                                {...register("pincode", {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: "Pincode must be 6 digits"
                                    }
                                })}
                            />
                            {errors.pincode && (
                                <p className='text-red-500 text-sm flex items-center gap-1'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                    </svg>
                                    {errors.pincode.message}
                                </p>
                            )}
                        </div>

                        {/* Country */}
                        <div className='space-y-2'>
                            <label htmlFor='country' className='block text-sm font-semibold text-gray-700'>
                                Country <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                id='country'
                                placeholder='Enter country name'
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.country 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-200 bg-green-50 hover:border-green-300'
                                }`}
                                {...register("country", {
                                    required: "Country is required",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "Country name should only contain letters"
                                    }
                                })}
                            />
                            {errors.country && (
                                <p className='text-red-500 text-sm flex items-center gap-1'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                    </svg>
                                    {errors.country.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className='space-y-2'>
                        <label htmlFor='mobile' className='block text-sm font-semibold text-gray-700'>
                            Mobile Number <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='tel'
                            id='mobile'
                            placeholder='Enter 10-digit mobile number'
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.mobile 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-200 bg-green-50 hover:border-green-300'
                            }`}
                            {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^[6-9]\d{9}$/,
                                    message: "Enter a valid 10-digit mobile number"
                                }
                            })}
                        />
                        {errors.mobile && (
                            <p className='text-red-500 text-sm flex items-center gap-1'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                </svg>
                                {errors.mobile.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className='pt-4'>
                        <button 
                            type='submit' 
                            disabled={isSubmitting}
                            className='cursor-pointer w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'></path>
                                    </svg>
                                    Adding Address...
                                </>
                            ) : (
                                <>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                                    </svg>
                                    Add Address
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddAddress