import React from 'react'
import { 
    FaFacebook, 
    FaInstagram, 
    FaLinkedin, 
    FaTwitter,
    FaYoutube,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaShoppingBag,
    FaTruck,
    FaShieldAlt,
    FaHeart,
    FaCreditCard,
    FaPaypal,
    FaGooglePay,
    FaApplePay
} from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden -mb-4'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-5'>
                <div className='absolute top-0 left-0 w-64 h-64 bg-green-400 rounded-full blur-3xl transform -translate-x-32 -translate-y-32'></div>
                <div className='absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl transform translate-x-48 translate-y-48'></div>
            </div>

            {/* Newsletter Section */}
            <div className='relative z-10 border-b border-gray-700'>
                <div className='container mx-auto px-4 py-8 max-w-7xl'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <h3 className='text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'>
                            Stay Updated with Our Latest Offers! 🎉
                        </h3>
                        <p className='text-gray-400 mb-6'>Get exclusive deals, new product alerts, and special discounts delivered to your inbox.</p>
                        
                        <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
                            <div className='flex-1 relative'>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address"
                                    className='w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300'
                                />
                                <FaEnvelope className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            </div>
                            <button className='px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg'>
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className='relative z-10 container mx-auto px-4 py-12 max-w-7xl'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    
                    {/* Company Info */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 mb-6'>
                            <div className='w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl flex items-center justify-center'>
                                <FaShoppingBag className='text-white text-lg' />
                            </div>
                            <h2 className='text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'>
                                ShopEase
                            </h2>
                        </div>
                        <p className='text-gray-400 leading-relaxed'>
                            Your trusted e-commerce partner for quality products, fast delivery, and exceptional customer service. Shop with confidence!
                        </p>
                        
                        {/* Trust Badges */}
                        <div className='flex items-center gap-4 pt-4'>
                            <div className='flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg'>
                                <FaShieldAlt className='text-green-400' />
                                <span className='text-xs text-gray-300'>Secure</span>
                            </div>
                            <div className='flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg'>
                                <FaTruck className='text-blue-400' />
                                <span className='text-xs text-gray-300'>Fast Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-lg font-semibold mb-6 text-white'>Quick Links</h3>
                        <ul className='space-y-3'>
                            {[
                                'About Us',
                                'Contact Us',
                                'Track Your Order',
                                'Shipping Info',
                                'Return Policy',
                                'Size Guide',
                                'FAQs'
                            ].map((link, index) => (
                                <li key={index}>
                                    <a href='#' className='text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group'>
                                        <span className='w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className='text-lg font-semibold mb-6 text-white'>Categories</h3>
                        <ul className='space-y-3'>
                            {[
                                'Electronics',
                                'Fashion',
                                'Home & Garden',
                                'Sports & Outdoors',
                                'Health & Beauty',
                                'Books & Media',
                                'Toys & Games'
                            ].map((category, index) => (
                                <li key={index}>
                                    <a href='#' className='text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group'>
                                        <span className='w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className='text-lg font-semibold mb-6 text-white'>Get in Touch</h3>
                        <div className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <FaMapMarkerAlt className='text-green-400 mt-1 flex-shrink-0' />
                                <div>
                                    <p className='text-gray-400 text-sm'>
                                        123 Commerce Street,<br />
                                        Business District,<br />
                                        City, State 12345
                                    </p>
                                </div>
                            </div>
                            
                            <div className='flex items-center gap-3'>
                                <FaPhone className='text-blue-400' />
                                <a href='tel:+1234567890' className='text-gray-400 hover:text-white transition-colors duration-300'>
                                    +1 (234) 567-8900
                                </a>
                            </div>
                            
                            <div className='flex items-center gap-3'>
                                <FaEnvelope className='text-purple-400' />
                                <a href='mailto:support@shopeasy.com' className='text-gray-400 hover:text-white transition-colors duration-300'>
                                    support@shopeasy.com
                                </a>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className='mt-6 p-4 bg-gray-800 rounded-xl'>
                            <h4 className='text-sm font-semibold text-white mb-2'>Customer Support</h4>
                            <p className='text-xs text-gray-400'>Mon - Fri: 9:00 AM - 6:00 PM</p>
                            <p className='text-xs text-gray-400'>Sat - Sun: 10:00 AM - 4:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className='relative z-10 border-t border-gray-700'>
                <div className='container mx-auto px-4 py-6'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-gray-400 text-sm'>We Accept:</span>
                            <div className='flex items-center gap-3'>
                                <FaCreditCard className='text-2xl text-blue-400' />
                                <FaPaypal className='text-2xl text-blue-600' />
                                <FaGooglePay className='text-2xl text-green-500' />
                                <FaApplePay className='text-2xl text-white' />
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-2 text-sm text-gray-400'>
                            <FaShieldAlt className='text-green-400' />
                            <span>SSL Secured Payments</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className='relative z-10 border-t border-gray-700 bg-gray-900/50'>
                <div className='container mx-auto px-4 py-6'>
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                        
                        {/* Copyright */}
                        <div className='flex items-center gap-2 text-gray-400 text-sm'>
                            <span>© {currentYear} ShopEase. All Rights Reserved.</span>
                            <FaHeart className='text-red-400 animate-pulse' />
                        </div>

                        {/* Social Media */}
                        <div className='flex items-center gap-4'>
                            <span className='text-gray-400 text-sm hidden sm:block'>Follow Us:</span>
                            <div className='flex items-center gap-3'>
                                {[
                                    { icon: FaFacebook, color: 'hover:text-blue-500', bg: 'hover:bg-blue-500/10' },
                                    { icon: FaInstagram, color: 'hover:text-pink-500', bg: 'hover:bg-pink-500/10' },
                                    { icon: FaLinkedin, color: 'hover:text-blue-600', bg: 'hover:bg-blue-600/10' },
                                    { icon: FaTwitter, color: 'hover:text-blue-400', bg: 'hover:bg-blue-400/10' },
                                    { icon: FaYoutube, color: 'hover:text-red-500', bg: 'hover:bg-red-500/10' }
                                ].map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a 
                                            key={index}
                                            href='#' 
                                            className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 ${social.color} ${social.bg} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                                        >
                                            <Icon className='text-lg' />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className='flex items-center gap-6 text-xs text-gray-500'>
                            <a href='#' className='hover:text-gray-300 transition-colors duration-300'>Privacy Policy</a>
                            <a href='#' className='hover:text-gray-300 transition-colors duration-300'>Terms of Service</a>
                            <a href='#' className='hover:text-gray-300 transition-colors duration-300'>Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer