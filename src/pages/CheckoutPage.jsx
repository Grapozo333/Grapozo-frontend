import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { useUI } from '../provider/UIProvider'

const CheckoutPage = () => {
  useScrollToTop()
  const { setShowSearchBar, setBreadcrumbs } = useUI();

  useEffect(() => {
    setShowSearchBar(false);
    setBreadcrumbs([
        { name: "Home", link: "/" },
        { name: "Cart", link: "/cart-lg" },
        { name: "Checkout" }
    ]);
    // Cleanup function to reset on component unmount
    return () => {
        setShowSearchBar(true);
        setBreadcrumbs([]);
    };
  }, []);

  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const activeAddresses = addressList.filter(address => address.status)
  const validateAddress = () => {
    if (selectAddress === null || !activeAddresses[selectAddress]) {
      toast.error('Please select a delivery address')
      return false
    }
    return true
  }

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [grandTotal, setGrandTotal] = useState(totalPrice);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const couponStr = localStorage.getItem('appliedCoupon');
    if (couponStr) {
      try {
        const coupon = JSON.parse(couponStr);
        if (coupon && coupon.valid) {
          setAppliedCoupon(coupon);
          setGrandTotal(coupon.finalAmount);
          setCouponDiscount(coupon.discountAmount);
        } else {
          setAppliedCoupon(null);
          setGrandTotal(totalPrice);
          setCouponDiscount(0);
        }
      } catch {
        setAppliedCoupon(null);
        setGrandTotal(totalPrice);
        setCouponDiscount(0);
      }
    } else {
      setAppliedCoupon(null);
      setGrandTotal(totalPrice);
      setCouponDiscount(0);
    }
  }, [totalPrice]);

  const handleCashOnDelivery = async() => {
    if (!validateAddress()) return
      try {
          // Get applied coupon code from localStorage
          let appliedCouponCode;
          try {
            const couponObj = JSON.parse(localStorage.getItem('appliedCoupon'));
            if (couponObj && couponObj.coupon && couponObj.valid) {
              appliedCouponCode = couponObj.coupon.code;
            }
          } catch {}
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  grandTotal,
              ...(appliedCouponCode && { appliedCouponCode })
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = async()=>{
    try {
        toast.loading("Loading...")
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise = await loadStripe(stripePublicKey)
       
        // Get applied coupon code from localStorage
        let appliedCouponCode;
        try {
          const couponObj = JSON.parse(localStorage.getItem('appliedCoupon'));
          if (couponObj && couponObj.coupon && couponObj.valid) {
            appliedCouponCode = couponObj.coupon.code;
          }
        } catch {}
        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  grandTotal,
              ...(appliedCouponCode && { appliedCouponCode })
            }
        })

        const { data : responseData } = response

        stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
    } catch (error) {
        AxiosToastError(error)
    }
  }
   return (
    <section className='min-h-screen bg-gradient-to-br from-green-50 to-white '>
      <div className='container mx-auto p-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-green-800 mb-2'>Checkout</h1>
          <p className='text-green-600'>Complete your order in just a few steps</p>
        </div>

        <div className='flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto'>
          {/* Address Section */}
          <div className='flex-1'>
            <div className='bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-green-600 to-green-700 p-6'>
                <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path>
                  </svg>
                  Choose Delivery Address
                </h3>
                <p className='text-green-100 mt-1'>Select where you want your order delivered</p>
              </div>

              <div className='p-6'>
                {activeAddresses.length > 0 ? (
                  <div className='space-y-4'>
                    {activeAddresses.map((address, index) => (
                      <label key={index} htmlFor={`address${index}`} className='block cursor-pointer'>
                        <div className={`border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                          selectAddress === index 
                            ? 'border-green-500 bg-green-50 shadow-md' 
                            : 'border-gray-200 hover:border-green-300'
                        }`}>
                          <div className='flex items-start gap-3'>
                            <input 
                              id={`address${index}`}
                              type='radio' 
                              value={index} 
                              onChange={(e) => setSelectAddress(parseInt(e.target.value))} 
                              name='address'
                              className='mt-1 text-green-600 focus:ring-green-500'
                            />
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                <span className='font-semibold text-gray-800'>Delivery Address</span>
                              </div>
                              <div className='text-gray-600 space-y-1'>
                                <p className='font-medium'>{address.address_line}</p>
                                <p>{address.city}, {address.state}</p>
                                <p>{address.country} - {address.pincode}</p>
                                <p className='flex items-center gap-1'>
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                                  </svg>
                                  {address.mobile}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <svg className='w-16 h-16 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path>
                    </svg>
                    <p className='text-gray-500 mb-4'>No addresses found</p>
                  </div>
                )}

                <button 
                  onClick={() => setOpenAddress(true)} 
                  className='w-full mt-6 h-16 bg-gradient-to-r from-green-50 to-green-100 border-2 border-dashed border-green-300 rounded-xl flex justify-center items-center cursor-pointer transition-all duration-200 hover:from-green-100 hover:to-green-200 hover:border-green-400 group'
                >
                  <div className='flex items-center gap-2 text-green-600 font-semibold'>
                    <svg className='w-5 h-5 group-hover:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4'></path>
                    </svg>
                    Add New Address
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='w-full lg:w-96'>
            <div className='bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden sticky top-20'>
              <div className='bg-gradient-to-r from-green-600 to-green-700 p-6'>
                <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'></path>
                  </svg>
                  Order Summary
                </h3>
              </div>

              <div className='p-6'>
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Items total</span>
                    <span className='font-semibold text-gray-900'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Discount</span>
                    <span className='font-semibold text-green-600'>- {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice + couponDiscount)}</span>
                  </div>
                  {appliedCoupon && appliedCoupon.valid && (
                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                      <span className='text-gray-600'>Coupon ({appliedCoupon.coupon.code})</span>
                      <span className='font-semibold text-green-600'>- {DisplayPriceInRupees(appliedCoupon.discountAmount)}</span>
                    </div>
                  )}
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Delivery</span>
                    <span className='font-semibold text-green-600'>Free</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-t border-gray-200 mt-4'>
                    <span className='text-xl font-bold text-gray-900'>Grand Total</span>
                    <span className='text-xl font-bold text-green-600'>{DisplayPriceInRupees(grandTotal)}</span>
                  </div>
                </div>

                {/* Address validation warning */}
                {selectAddress === null && (
                  <div className='mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                    <div className='flex items-center gap-2 text-amber-700'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'></path>
                      </svg>
                      <span className='text-sm font-medium'>Please select a delivery address</span>
                    </div>
                  </div>
                )}

                <div className='space-y-3'>
                  <button 
                    className={`cursor-pointer w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectAddress !== null 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={handleOnlinePayment}
                    disabled={selectAddress === null}
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'></path>
                    </svg>
                    Pay Online
                  </button>

                  <button 
                    className={`cursor-pointer w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectAddress !== null 
                        ? 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white shadow-md hover:shadow-lg' 
                        : 'border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={handleCashOnDelivery}
                    disabled={selectAddress === null}
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'></path>
                    </svg>
                    Cash on Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}
    </section>
  )
}

export default CheckoutPage
