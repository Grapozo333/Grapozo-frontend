import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle, FaUser, FaEnvelope, FaPhone, FaEdit } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Profile = () => {
    useScrollToTop()
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-white'>
            <div className='max-w-2xl mx-auto p-4'>
                {/* Header */}
                <div className='text-center mb-4'>
                    <h1 className='text-3xl font-bold text-green-800 mb-2'>My Profile</h1>
                   
                </div>

                {/* Profile Card */}
                <div className='bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden'>
                    {/* Profile Header Section */}
                    <div className='bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center relative'>
                        <div className='relative inline-block'>
                            {/* Avatar */}
                            <div className='w-24 h-24 bg-white flex items-center justify-center rounded-full overflow-hidden shadow-lg border-4 border-white mx-auto mb-4'>
                                {
                                    user.avatar ? (
                                        <img
                                            alt={user.name}
                                            src={user.avatar}
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <FaRegUserCircle size={60} className='text-green-500' />
                                    )
                                }
                            </div>
                            
                            {/* Edit Avatar Button */}
                            <button
                                onClick={() => setProfileAvatarEdit(true)}
                                className='absolute -bottom-1 right-1/2 transform translate-x-1/2 bg-white text-green-600 hover:bg-green-50 border-2 border-green-500 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-105'
                                title="Edit Profile Picture"
                            >
                                <FaEdit size={12} />
                            </button>
                        </div>
                        
                        <h2 className='text-xl font-semibold text-white mb-1'>
                            {user.name || 'User Name'}
                        </h2>
                        <p className='text-green-100 text-sm'>
                            {user.email || 'user@example.com'}
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className='p-6'>
                        <div className='space-y-6' onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className='space-y-2'>
                                <label className='flex items-center text-sm font-medium text-green-800 mb-2'>
                                    <FaUser className='mr-2 text-green-600' />
                                    Full Name
                                </label>
                                <input
                                    type='text'
                                    placeholder='Enter your full name'
                                    className='w-full p-3 bg-green-50 border border-green-200 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200'
                                    value={userData.name}
                                    name='name'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className='space-y-2'>
                                <label htmlFor='email' className='flex items-center text-sm font-medium text-green-800 mb-2'>
                                    <FaEnvelope className='mr-2 text-green-600' />
                                    Email Address
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    placeholder='Enter your email address'
                                    className='w-full p-3 bg-green-50 border border-green-200 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200'
                                    value={userData.email}
                                    name='email'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>

                            {/* Mobile Field */}
                            <div className='space-y-2'>
                                <label htmlFor='mobile' className='flex items-center text-sm font-medium text-green-800 mb-2'>
                                    <FaPhone className='mr-2 text-green-600' />
                                    Mobile Number
                                </label>
                                <input
                                    type='text'
                                    id='mobile'
                                    placeholder='Enter your mobile number'
                                    className='w-full p-3 bg-green-50 border border-green-200 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200'
                                    value={userData.mobile}
                                    name='mobile'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className='pt-4'>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                                        loading
                                            ? 'bg-green-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02]'
                                    }`}
                                >
                                    {loading ? (
                                        <div className='flex items-center justify-center'>
                                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                                            Updating...
                                        </div>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Actions */}
                {/* <div className='mt-6 text-center'>
                    <button className='text-green-600 hover:text-green-800 text-sm font-medium hover:underline transition-colors duration-200'>
                        Change Password
                    </button>
                </div> */}
            </div>

            {/* Avatar Edit Modal */}
            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
                )
            }
        </div>
    )
}

export default Profile