import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (close) {
          close()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [close])

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      console.log("logout", response)
      if (response.data.success) {
        if (close) {
          close()
        }
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }

  return (
    <div ref={menuRef} className='bg-gradient-to-br from-white to-green-50 rounded-lg p-1'>
      <div className='bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4 mb-3'>
        <div className='font-bold text-green-800 text-lg mb-2'>My Account</div>
        <div className='text-sm flex items-center gap-3'>
          <span className='max-w-52 text-ellipsis line-clamp-1 text-gray-700 font-medium'>
            {user.name || user.mobile}
            <span className='text-medium text-red-600 font-semibold ml-2'>
              {user.role === "ADMIN" ? "(Admin)" : ""}
            </span>
          </span>
          <Link
            onClick={handleClose}
            to={"/dashboard/profile"}
            className='text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-all duration-200'
          >
            <HiOutlineExternalLink size={16} />
          </Link>
        </div>
      </div>

      <Divider />

      <div className='text-sm grid gap-1 p-2'>
        {
          isAdmin(user.role) && (
            <Link
              onClick={handleClose}
              to={"/dashboard/category"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              📂 Category
            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link
              onClick={handleClose}
              to={"/dashboard/subcategory"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              📁 Sub Category
            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link
              onClick={handleClose}
              to={"/dashboard/upload-product"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              📤 Upload Product
            </Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link
              onClick={handleClose}
              to={"/dashboard/product"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              📦 Product
            </Link>
          )
        }
        {
        isAdmin(user.role) && (<Link
          onClick={handleClose}
          to={"/dashboard/coupon"}
          className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
        >
          📦 Coupon
        </Link>)
        }

        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
        >
          📋 My Orders
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
        >
          📍 Save Address
        </Link>

        {
          user.role === 'SELLER' && (
            <Link
              onClick={handleClose}
              to={"/seller"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              🛒 Seller Dashboard
            </Link>
          )
        }

        {
          user.role === 'ADMIN' && (
            <Link
              onClick={handleClose}
              to={"/seller-details"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              👤 Seller Details
            </Link>
          )
        }

        {
          user.role === 'RIDER' && (
            <Link
              onClick={handleClose}
              to={"/rider"}
              className='px-4 py-3 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-50 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-green-200'
            >
              🚚 Rider Dashboard
            </Link>
          )
        }

        <button
          onClick={handleLogout}
          className='text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-lg transition-all duration-200 font-medium hover:shadow-sm border border-transparent hover:border-red-200 mt-2'
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  )
}

export default UserMenu