import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice ,totalQty} = useGlobalContext()
    const cartItem  = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = ()=>{
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }
    return (
        <section className='bg-black/20 bg-opacity-50 fixed top-0 bottom-0 right-0 left-0 z-50 backdrop-blur-sm'>
            <div className='bg-white w-full max-w-md min-h-screen max-h-screen ml-auto shadow-2xl '>
                {/* Header */}
                <div className='flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'>
                    <h2 className='text-xl font-bold'>My Cart</h2>
                    <div className='flex items-center gap-4'>
                        {cartItem.length > 0 && (
                            <span className='bg-white text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>
                                {totalQty} items
                            </span>
                        )}
                        <Link to={"/"} className='lg:hidden hover:bg-green-800 p-2 rounded-full transition-colors'>
                            <IoClose size={24}/>
                        </Link>
                        <button onClick={close} className='cursor-pointer hidden lg:block hover:bg-green-800 p-2 rounded-full transition-colors'>
                            <IoClose size={24}/>
                        </button>
                    </div>
                </div>

                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-gray-50 flex flex-col'>
                    {cartItem[0] ? (
                        <>
                            {/* Savings Banner */}
                            <div className='m-4 mb-0'>
                                <div className='flex items-center justify-between px-5 py-3 bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                        <p className='font-medium'>Total Savings</p>
                                    </div>
                                    <p className='font-bold text-green-600'>
                                        {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                                    </p>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className='flex-1 overflow-auto p-4 pt-2'>
                                <div className='bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100'>
                                    {cartItem.map((item, index) => (
                                        <div key={item?._id + "cartItemDisplay"} className='p-4 hover:bg-gray-50 transition-colors'>
                                            <div className='flex gap-4'>
                                                <div className='w-20 h-20 flex-shrink-0 bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
                                                    <img
                                                        src={item?.productId?.image[0]}
                                                        alt={item?.productId?.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='font-medium text-gray-900 text-sm line-clamp-2 mb-1'>
                                                        {item?.productId?.name}
                                                    </h3>
                                                    <p className='text-xs text-gray-500 mb-2'>
                                                        {item?.productId?.unit}
                                                    </p>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='font-bold text-green-600'>
                                                            {DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}
                                                        </span>
                                                        {item?.productId?.discount > 0 && (
                                                            <span className='text-xs text-gray-400 line-through'>
                                                                {DisplayPriceInRupees(item?.productId?.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex-shrink-0'>
                                                    <AddToCartButton data={item?.productId}/>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bill Details */}
                            <div className='p-4 pt-0'>
                                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
                                    <h3 className='font-bold text-gray-900 mb-4 text-lg'>Bill Summary</h3>
                                    
                                    <div className='space-y-3'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600'>Items total</span>
                                            <div className='flex items-center gap-3'>
                                                <span className='text-sm text-gray-400 line-through'>
                                                    {DisplayPriceInRupees(notDiscountTotalPrice)}
                                                </span>
                                                <span className='font-semibold text-gray-900'>
                                                    {DisplayPriceInRupees(totalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600'>Quantity</span>
                                            <span className='font-semibold text-gray-900'>{totalQty} items</span>
                                        </div>
                                        
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600'>Delivery Charge</span>
                                            <span className='font-semibold text-green-600'>Free</span>
                                        </div>
                                        
                                        <div className='border-t border-gray-200 pt-3 mt-4'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-lg font-bold text-gray-900'>Grand Total</span>
                                                <span className='text-lg font-bold text-green-600'>
                                                    {DisplayPriceInRupees(totalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='flex-1 flex flex-col justify-center items-center p-8'>
                            <div className='bg-white rounded-2xl shadow-lg p-8 text-center max-w-xs'>
                                <img
                                    src={imageEmpty}
                                    alt="Empty cart"
                                    className='w-32 h-32 mx-auto mb-6 opacity-80'
                                />
                                <h3 className='text-xl font-bold text-gray-900 mb-2'>Your cart is empty</h3>
                                <p className='text-gray-500 mb-6 text-sm'>Add some items to get started</p>
                                <Link 
                                    onClick={close} 
                                    to={"/"}
                                    className='inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Checkout Button */}
                {cartItem[0] && (
                    <div className='p-4 bg-white border-t border-gray-200'>
                        <button 
                            onClick={redirectToCheckoutPage}
                            className='-translate-y-3 cursor-pointer w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform flex items-center justify-between'
                        >
                            <span className='text-lg'>
                                {DisplayPriceInRupees(totalPrice)}
                            </span>
                            <div className='flex items-center gap-2'>
                                <span>Proceed to Checkout</span>
                                <FaCaretRight className='text-lg'/>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default DisplayCartItem
