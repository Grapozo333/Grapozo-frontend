import React, { useEffect, useState } from 'react'
import logo from '../assets/ADash-logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useUI } from '../provider/UIProvider';
import Breadcrumbs from './Breadcrumbs';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [isScrolled, setIsScrolled] = useState(false)
    const { showSearchBar } = useUI();

    // Handle scroll animation
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    const handleCartClick = () => {
        navigate("/cart-lg")
    }

    return (
        <header className={`h-24 lg:h-20 sticky ${isScrolled ? 'top-3' : 'top-0'} z-50 flex flex-col justify-center gap-1 bg-gradient-to-r from-white via-green-50 to-white border-b border-green-100 transition-all duration-300 ${isScrolled ? 'shadow-lg scale-[0.98] backdrop-blur-md opacity-90 rounded-4xl' : 'shadow-sm opacity-100'} text-base lg:text-lg`}>

            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center px-4 justify-between'>
                        {/**logo */}
                        <div className='h-full'>
                            <Link to={"/"} className='h-full flex justify-center items-center group'>
                                <div className='relative overflow-hidden rounded-xl p-2 hover:bg-green-100/50 transition-all duration-300'>
                                    <img
                                        src={logo}
                                        width={170}
                                        height={60}
                                        alt='logo'
                                        className='hidden lg:block group-hover:scale-110 transition-transform duration-500 ease-out'
                                    />
                                    <img
                                        src={logo}
                                        width={120}
                                        height={60}
                                        alt='logo'
                                        className='lg:hidden group-hover:scale-110 transition-transform duration-500 ease-out'
                                    />
                                </div>
                            </Link>
                        </div>

                        {/**Search / Breadcrumbs */}
                        <div className='hidden lg:block flex-1 max-w-2xl mx-8'>
                            {
                                showSearchBar ? (
                                    <Search />
                                ) : (
                                    <Breadcrumbs />
                                )
                            }
                        </div>

                        {/**login and my cart */}
                        <div className='flex items-center gap-4'>
                            {/**user icons display in only mobile version**/}
                            <button 
                                className='cursor-pointer text-green-700 lg:hidden p-2 rounded-full hover:bg-green-100/50 transition-all duration-300 hover:scale-110 hover:shadow-md' 
                                onClick={handleMobileUser}
                            >
                                <FaRegCircleUser size={26} className='transition-transform duration-300 group-hover:rotate-12' />
                            </button>

                            {/**Desktop**/}
                            <div className='hidden lg:flex items-center gap-6'>
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            <div 
                                                onClick={() => setOpenUserMenu(preve => !preve)} 
                                                className='flex select-none items-center gap-3 cursor-pointer px-5 py- rounded-full  transition-all duration-300 border border-transparent group'
                                            >
                                                <div className='relative w-14 h-14 rounded-full overflow-hidden bg-gray-200'>
                                                    {user?.avatar ? (
                                                        <img 
                                                            src={user.avatar}
                                                            alt="Profile"
                                                            className='w-full h-full object-cover'
                                                        />
                                                    ) : (
                                                        <div className='flex items-center justify-center w-full h-full text-gray-500'>
                                                            <FaRegCircleUser size={28} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='text-green-600'>
                                                    {
                                                        openUserMenu ? (
                                                            <GoTriangleUp size={22} className='transition-transform duration-300 group-hover:scale-110' />
                                                        ) : (
                                                            <GoTriangleDown size={22} className='transition-transform duration-300 group-hover:scale-110' />
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {
                                                openUserMenu && (
                                                    <div className='absolute right-0 top-14 z-50 animate-fadeIn'>
                                                        <div className='bg-white/95 rounded-xl p-4 min-w-52 shadow-2xl border border-green-100/50 backdrop-blur-lg transition-all duration-300'>
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={redirectToLoginPage} 
                                            className='cursor-pointer text-green-800 font-semibold px-6 py-2 rounded-full border-2 border-green-200 hover:border-green-400 hover:bg-green-100/50 transition-all duration-300 hover:scale-105 hover:shadow-md'
                                        >
                                            Login
                                        </button>
                                    )
                                }
                                <button 
                                    onClick={handleCartClick}
                                    className='cursor-pointer flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-5 py-2.5 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-400/50 group relative overflow-hidden'
                                >
                                    {/**add to cart icons */}
                                    <div className='relative animate-pulse group-hover:animate-none'>
                                        <BsCart4 size={24} className='transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3' />
                                        {cartItem[0] && (
                                            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-bounce'>
                                                {totalQty}
                                            </span>
                                        )}
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        {cartItem[0] ? (
                                            <div className='text-left space-y-0.5'>
                                                <p className='text-xs opacity-85 tracking-wide'>{totalQty} Item{totalQty > 1 ? 's' : ''}</p>
                                                <p className='text-sm font-bold tracking-tight'>{DisplayPriceInRupees(totalPrice)}</p>
                                            </div>
                                        ) : (
                                            <p className='text-sm font-semibold tracking-wide'>My Cart</p>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/**Mobile Cart Button */}
                            <button 
                                onClick={handleCartClick}
                                className='lg:hidden cursor-pointer relative p-2 rounded-full hover:bg-green-100/50 transition-all duration-300 hover:scale-110 hover:shadow-md'
                            >
                                <BsCart4 size={26} className='text-green-700' />
                                {cartItem[0] && (
                                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md'>
                                        {totalQty}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )
            }

            <div className='container mx-auto px-4 lg:hidden'>
                {
                    showSearchBar && <Search />
                }
            </div>

            {
                !showSearchBar && (
                    <div className='container mx-auto px-4 lg:hidden'>
                        <Breadcrumbs />
                    </div>
                )
            }
        </header>
    )
}

export default Header