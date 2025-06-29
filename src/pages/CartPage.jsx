import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight, FaShoppingBag, FaTag, FaPercent, FaGift, FaShieldAlt, FaTruck, FaCheckCircle, FaTimes } from "react-icons/fa"
import { useSelector } from 'react-redux'
import AddToCartButton from '../components/AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import { useUI } from '../provider/UIProvider'
import CouponModal from '../components/CouponModal'

const CartPage = () => {
    useScrollToTop();
    const { setShowSearchBar, setBreadcrumbs } = useUI();

    useEffect(() => {
        setShowSearchBar(false);
        setBreadcrumbs([
            { name: "Home", link: "/" },
            { name: "Cart" }
        ]);
        // Cleanup function to reset on component unmount
        return () => {
            setShowSearchBar(true);
            setBreadcrumbs([]);
        };
    }, []);
    
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [userAvailedCoupons, setUserAvailedCoupons] = React.useState([]);
    const [loadingAvailed, setLoadingAvailed] = React.useState(false);
    const [couponCode, setCouponCode] = React.useState('');
    const [couponLoading, setCouponLoading] = React.useState(false);
    const [couponError, setCouponError] = React.useState('');
    const [couponInfo, setCouponInfo] = React.useState(null);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loadingAvailableCoupons, setLoadingAvailableCoupons] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    // Filter available coupons based on user's availed coupons
    const filteredCoupons = availableCoupons.filter(coupon => {
        const availedCoupon = userAvailedCoupons.find(availed => availed.couponId._id === coupon._id);
        if (!availedCoupon) {
            return true; // Coupon not availed yet
        }
        // a usageLimit of null means unlimited
        if (coupon.usageLimit === null) {
            return true;
        }
        return availedCoupon.count < coupon.usageLimit; // Check if usage limit is reached
    });

    // Fetch user's availed coupons on mount
    React.useEffect(() => {
        const fetchAvailed = async () => {
            setLoadingAvailed(true);
            try {
                const res = await Axios.get('/api/user/user-coupon-availed');
                setUserAvailedCoupons(res.data.data || []);
            } catch (err) {
                setUserAvailedCoupons([]);
            }
            setLoadingAvailed(false);
        };
        fetchAvailed();
    }, []);

    // Fetch available coupons for the user
    useEffect(() => {
        const fetchAvailableCoupons = async () => {
            setLoadingAvailableCoupons(true);
            try {
                const res = await Axios.get('/api/coupon');
                setAvailableCoupons(res.data.coupons || []);
            } catch (err) {
                setAvailableCoupons([]);
            }
            setLoadingAvailableCoupons(false);
        };
        fetchAvailableCoupons();
    }, []);

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            return
        }
        toast("Please Login")
    }

    // Coupon validation handler
    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponInfo(null);
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code.');
            localStorage.removeItem('appliedCoupon');
            return;
        }
        setCouponLoading(true);
        try {
            const res = await Axios.get(`/api/coupon/validate-for-user/${couponCode.trim()}?orderAmount=${totalPrice}`);
            if (res.data && res.data.valid) {
                setCouponInfo(res.data);
                setCouponError('');
                localStorage.setItem('appliedCoupon', JSON.stringify(res.data));
            } else {
                setCouponError('Invalid coupon.');
                setCouponInfo(null);
                localStorage.removeItem('appliedCoupon');
            }
        } catch (error) {
            setCouponInfo(null);
            localStorage.removeItem('appliedCoupon');
            if (error.response && error.response.data && error.response.data.message) {
                setCouponError(error.response.data.message);
            } else {
                setCouponError('Failed to validate coupon.');
            }
        }
        setCouponLoading(false);
    };

    // Handle showing coupon popup
    const handleShowCoupons = () => {
        setIsCouponModalOpen(true);
    };

    // Calculate the final total after coupon discount
    const grandTotal = couponInfo && couponInfo.valid ? couponInfo.finalAmount : totalPrice;
    const couponDiscount = couponInfo && couponInfo.valid ? couponInfo.discountAmount : 0;

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20'>
            {/* Enhanced Header */}
            <div className=' bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'>
                <div className='container mx-auto px-4 py-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-6'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md'>
                                    <FaShoppingBag className='text-white text-xl' />
                                </div>
                                <div>
                                    <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>Shopping Cart</h1>
                                    {cartItem.length > 0 && (
                                        <p className='text-sm text-gray-500 mt-1'>
                                            Review your items before checkout
                                        </p>
                                    )}
                                </div>
                            </div>
                            {cartItem.length > 0 && (
                                <div className='bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full shadow-sm'>
                                    <span className='font-bold text-lg'>{totalQty}</span>
                                    <span className='text-sm ml-1'>items</span>
                                </div>
                            )}
                        </div>
                        <Link 
                            to="/" 
                            className='group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md'
                        >
                            <span>Continue Shopping</span>
                            <FaCaretRight className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-8'>
                {cartItem[0] ? (
                    <div className='grid grid-cols-1 xl:grid-cols-12 gap-8'>
                        {/* Cart Items Section */}
                        <div className='xl:col-span-8'>
                            {/* Enhanced Savings Banner */}
                            <div className='mb-8'>
                                <div className='bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden'>
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
                                    <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12'></div>
                                    <div className='relative flex items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <div className='p-3 bg-white/20 rounded-full backdrop-blur-sm'>
                                                <FaGift className='text-2xl' />
                                            </div>
                                            <div>
                                                <p className='font-bold text-2xl'>You're Saving</p>
                                                <p className='text-emerald-100 text-sm'>On your current order</p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-bold text-3xl'>
                                                {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                                            </p>
                                            <p className='text-emerald-100 text-sm'>Total savings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                                <div className='bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200'>
                                    <div className='flex items-center gap-3'>
                                        <FaShoppingBag className='text-gray-600 text-xl' />
                                        <h2 className='text-2xl font-bold text-gray-900'>Your Items</h2>
                                        <span className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium'>
                                            {cartItem.length} products
                                        </span>
                                    </div>
                                </div>
                                <div className='divide-y divide-gray-100'>
                                    {cartItem.map((item, index) => (
                                        <div key={item?._id + "cartItemDisplay"} className='p-6 hover:bg-gray-50/50 transition-all duration-200 group'>
                                            <div className='flex gap-6'>
                                                <div className='relative w-28 h-28 lg:w-36 lg:h-36 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow'>
                                                    <img
                                                        src={item?.productId?.image[0]}
                                                        alt={item?.productId?.name}
                                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                                    />
                                                    {item?.productId?.discount > 0 && (
                                                        <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md'>
                                                            -{item?.productId?.discount}%
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='font-bold text-gray-900 text-xl mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors'>
                                                        {item?.productId?.name}
                                                    </h3>
                                                    <p className='text-gray-500 mb-4 flex items-center gap-2'>
                                                        <span className='bg-gray-100 px-2 py-1 rounded-full text-sm'>
                                                            {item?.productId?.unit}
                                                        </span>
                                                    </p>
                                                    <div className='flex items-center gap-4 mb-6'>
                                                        <span className='font-bold text-emerald-600 text-2xl'>
                                                            {DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}
                                                        </span>
                                                        {item?.productId?.discount > 0 && (
                                                            <>
                                                                <span className='text-lg text-gray-400 line-through'>
                                                                    {DisplayPriceInRupees(item?.productId?.price)}
                                                                </span>
                                                                <span className='bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm'>
                                                                    SAVE {item?.productId?.discount}%
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className='flex items-center justify-between'>
                                                        <AddToCartButton data={item?.productId} />
                                                        <div className='text-right'>
                                                            <p className='text-sm text-gray-500 mb-1'>Item Total</p>
                                                            <p className='font-bold text-xl text-gray-900'>
                                                                {DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount)*item?.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Bill Summary Section */}
                        <div className='xl:col-span-4'>
                            <div className='sticky top-32 space-y-6'>
                                {/* Order Summary */}
                                <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                                    <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6'>
                                        <h3 className='font-bold text-2xl flex items-center gap-3'>
                                            <FaShieldAlt className='text-emerald-400' />
                                            Order Summary
                                        </h3>
                                    </div>
                                    
                                    {/* Coupon Section */}
                                    <div className='p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100'>
                                        <div className='flex items-center gap-2 mb-4'>
                                            <FaTag className='text-emerald-600' />
                                            <h4 className='font-bold text-emerald-800 text-lg'>Apply Coupon</h4>
                                        </div>
                                        <div className='flex gap-3'>
                                            <input
                                                type='text'
                                                value={couponCode}
                                                onChange={e => setCouponCode(e.target.value)}
                                                className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all'
                                                placeholder='Enter coupon code'
                                                disabled={couponLoading}
                                            />
                                            <button
                                                onClick={couponCode.trim() ? handleApplyCoupon : handleShowCoupons}
                                                disabled={couponLoading}
                                                className='bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg disabled:opacity-50'
                                            >
                                                {couponLoading ? 'Applying...' : (couponCode.trim() ? 'Apply' : 'Browse Coupons')}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <div className='mt-3 p-3 bg-red-100 border border-red-200 rounded-lg'>
                                                <p className='text-red-600 text-sm font-medium'>{couponError}</p>
                                            </div>
                                        )}
                                        {couponInfo && couponInfo.valid && (
                                            <div className='mt-3 p-3 bg-emerald-100 border border-emerald-200 rounded-lg'>
                                                <p className='text-emerald-700 text-sm font-medium flex items-center gap-2'>
                                                    <FaCheckCircle />
                                                    Coupon <span className='font-bold'>{couponInfo.coupon.code}</span> applied! 
                                                    You save {DisplayPriceInRupees(couponInfo.discountAmount)}.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Availed Coupons */}
                                    <div className='p-6 border-b border-gray-100'>
                                        <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                            <FaGift className='text-gray-600' />
                                            Your Availed Coupons
                                        </h4>
                                        {loadingAvailed ? (
                                            <div className='flex items-center gap-2 text-gray-500'>
                                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400'></div>
                                                <span className='text-sm'>Loading...</span>
                                            </div>
                                        ) : userAvailedCoupons.length === 0 ? (
                                            <div className='text-gray-500 text-sm bg-gray-50 p-3 rounded-lg'>
                                                No coupons used yet. Try applying one above!
                                            </div>
                                        ) : (
                                            <div className='space-y-2 max-h-32 overflow-y-auto'>
                                                {userAvailedCoupons.map(avail => (
                                                    <div
                                                        key={avail.couponId._id}
                                                        className='bg-blue-50 border border-blue-200 rounded-lg p-3'
                                                    >
                                                        <div className='flex items-center justify-between mb-1'>
                                                            <span className='font-bold text-blue-700'>{avail.couponId.code}</span>
                                                            <span className='text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full'>
                                                                Used: {avail.count}
                                                            </span>
                                                        </div>
                                                        <p className='text-xs text-gray-600 truncate'>{avail.couponId.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bill Details */}
                                    <div className='p-6 space-y-4'>
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
                                            <span className='text-gray-600 flex items-center gap-2'>
                                                <FaTruck className='text-emerald-600' />
                                                Delivery
                                            </span>
                                            <span className='font-semibold text-emerald-600'>FREE</span>
                                        </div>

                                        {couponDiscount > 0 && (
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-600 flex items-center gap-2'>
                                                    <FaTag className='text-emerald-600' />
                                                    Coupon Discount
                                                </span>
                                                <span className='font-semibold text-emerald-600'>
                                                    -{DisplayPriceInRupees(couponDiscount)}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600'>Total Savings</span>
                                            <span className='font-semibold text-emerald-600'>
                                                -{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice + couponDiscount)}
                                            </span>
                                        </div>
                                        
                                        <div className='border-t-2 border-gray-200 pt-4'>
                                            <div className='flex justify-between items-center'>
                                                <span className='text-2xl font-bold text-gray-900'>Grand Total</span>
                                                <span className='text-3xl font-bold text-emerald-600'>
                                                    {DisplayPriceInRupees(grandTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <div className='p-6 bg-gray-50'>
                                        <button 
                                            onClick={redirectToCheckoutPage}
                                            className='w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-between group'
                                        >
                                            <span className='text-xl font-bold'>
                                                {DisplayPriceInRupees(grandTotal)}
                                            </span>
                                            <div className='flex items-center gap-3'>
                                                <span className='text-lg'>Proceed to Checkout</span>
                                                <FaCaretRight className='text-xl group-hover:translate-x-1 transition-transform'/>
                                            </div>
                                        </button>

                                        {/* Security Info */}
                                        <div className='mt-4 p-4 bg-white rounded-xl border border-gray-200'>
                                            <p className='text-sm text-gray-600 text-center flex items-center justify-center gap-2'>
                                                <FaShieldAlt className='text-emerald-600' />
                                                <span>Secure checkout with 256-bit SSL encryption</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Enhanced Empty Cart */
                    <div className='flex flex-col justify-center items-center py-20'>
                        <div className='bg-white rounded-3xl shadow-2xl p-16 text-center max-w-lg border border-gray-100'>
                            <div className='relative mb-8'>
                                <img
                                    src={imageEmpty}
                                    alt="Empty cart"
                                    className='w-52 h-52 mx-auto opacity-90'
                                />
                                <div className='absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg'>
                                    <FaShoppingBag className='text-white text-xl' />
                                </div>
                            </div>
                            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Your cart is empty</h2>
                            <p className='text-gray-500 mb-8 text-lg leading-relaxed'>
                                Discover amazing products and add them to your cart to get started with your shopping journey!
                            </p>
                            <Link 
                                to={"/"}
                                className='inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 text-white font-bold px-8 py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group'
                            >
                                <FaShoppingBag className='text-xl' />
                                <span className='text-lg'>Start Shopping</span>
                                <FaCaretRight className='text-xl group-hover:translate-x-1 transition-transform' />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Coupon Modal Popup */}
            {isCouponModalOpen && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
                        {/* Modal Header */}
                        <div className='bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between flex-shrink-0'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-white/20 rounded-lg'>
                                    <FaGift className='text-xl' />
                                </div>
                                <h2 className='text-2xl font-bold'>Available Coupons & Offers</h2>
                            </div>
                            <button
                                onClick={() => setIsCouponModalOpen(false)}
                                className='p-2 hover:bg-white/20 rounded-full transition-colors'
                            >
                                <FaTimes className='text-xl' />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className='p-6 overflow-y-auto'>
                            {loadingAvailableCoupons ? (
                                <div className='flex items-center justify-center py-12'>
                                    <div className='text-center'>
                                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4'></div>
                                        <p className='text-gray-600'>Loading exclusive offers...</p>
                                    </div>
                                </div>
                            ) : filteredCoupons.length === 0 ? (
                                <div className='text-center py-12'>
                                    <FaTag className='text-6xl text-gray-300 mx-auto mb-4' />
                                    <h3 className='text-xl font-bold text-gray-600 mb-2'>No Coupons Available</h3>
                                    <p className='text-gray-500'>Check back soon for exciting deals and offers!</p>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {filteredCoupons.map(coupon => (
                                        <div
                                            key={coupon._id}
                                            className='group bg-gradient-to-br from-white to-gray-50 border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] relative overflow-hidden'
                                            onClick={() => {
                                                setCouponCode(coupon.code);
                                                setIsCouponModalOpen(false);
                                            }}
                                        >
                                            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-bl-full flex items-center justify-center'>
                                                <FaPercent className='text-white text-sm mt-3 mr-3' />
                                            </div>
                                            <div className='space-y-4'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-bold text-emerald-700 text-xl bg-emerald-100 px-4 py-2 rounded-full border-2 border-dashed border-emerald-300'>
                                                        {coupon.code}
                                                    </span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <span className='bg-gradient-to-r from-red-500 to-orange-500 text-white text-base font-bold px-4 py-2 rounded-full shadow-md'>
                                                        {coupon.discountType === 'percentage'
                                                            ? `${coupon.discountValue}% OFF`
                                                            : `₹${coupon.discountValue} OFF`}
                                                    </span>
                                                </div>
                                                <p className='text-gray-600 text-sm pt-2 line-clamp-2'>{coupon.description}</p>
                                                <div className='text-xs text-gray-500 flex items-center gap-2 mt-4 pt-4 border-t border-gray-200'>
                                                    <FaCheckCircle className='text-emerald-500' />
                                                    <span>
                                                        Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage