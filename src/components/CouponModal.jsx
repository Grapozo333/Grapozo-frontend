import React from 'react';
import { FaGift, FaPercent, FaCheckCircle, FaTimes, FaTag } from 'react-icons/fa';

const CouponModal = ({ isOpen, onClose, coupons, onSelectCoupon, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-blue-500 rounded-lg'>
                            <FaGift className='text-white text-lg' />
                        </div>
                        <h2 className='text-2xl font-bold text-blue-900'>Available Offers & Coupons</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <FaTimes className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    {loading ? (
                        <div className='flex items-center justify-center gap-2 text-blue-600 h-40'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                            <span>Loading exclusive offers...</span>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className='text-blue-700 bg-blue-100 rounded-lg p-6 text-center h-40 flex flex-col justify-center items-center'>
                            <FaTag className='text-4xl mb-4' />
                            <p className='font-semibold'>No special offers available right now.</p>
                            <p className='text-sm'>Check back soon for exciting deals!</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {coupons.map(coupon => (
                                <div
                                    key={coupon._id}
                                    className='group bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden'
                                    onClick={() => onSelectCoupon(coupon.code)}
                                >
                                    <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-bl-full flex items-center justify-center'>
                                        <FaPercent className='text-white text-xs mt-2 mr-2' />
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-bold text-emerald-700 text-lg bg-emerald-100 px-3 py-1 rounded-full border-2 border-dashed border-emerald-300'>
                                                {coupon.code}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full'>
                                                {coupon.discountType === 'percentage'
                                                    ? `${coupon.discountValue}% OFF`
                                                    : `₹${coupon.discountValue} OFF`}
                                            </span>
                                        </div>
                                        <p className='text-gray-600 text-sm line-clamp-2'>{coupon.description}</p>
                                        <div className='text-xs text-gray-500 flex items-center gap-1'>
                                            <FaCheckCircle className='text-emerald-500' />
                                            <span>
                                                Valid: {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
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
    );
};

export default CouponModal; 