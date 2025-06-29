import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { FaTruck, FaFire, FaHeart } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop'


const ProductDisplayPage = () => {
  useScrollToTop()
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data,setData] = useState({
    name: "",
    image: [],
    category: ""
  })
  const [showMore, setShowMore] = useState(false)
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageContainer = useRef()
  const zoomImageRef = useRef()
  const zoomWindowRef = useRef()
  const [isLiked, setIsLiked] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [relatedError, setRelatedError] = useState(null)

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
        fetchRelatedProducts(responseData.data.category)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category) => {
    try {
      setRelatedLoading(true)
      const response = await Axios.post('http://localhost:8080/api/product/get-product-by-category', {
        category: category
      })

      if (response.data.success) {
        const products = response.data.data
        // Sort by rating and take top 10
        const sortedProducts = products.sort((a, b) => b.rating - a.rating)
        setRelatedProducts(sortedProducts.slice(0, 10))
      } else {
        setRelatedError('Failed to fetch related products')
      }
    } catch (error) {
      setRelatedError('Failed to fetch related products')
      console.error('Error fetching related products:', error)
    } finally {
      setRelatedLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])
  
  const handleScrollRight = ()=>{
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = ()=>{
    imageContainer.current.scrollLeft -= 100
  }

  const handleMouseMove = (e) => {
    if (!zoomImageRef.current) return
    
    const rect = zoomImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))
    
    setZoomPosition({ x: clampedX, y: clampedY })
  }

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  console.log("product data",data)
 return (
    <section className='bg-gradient-to-br from-green-50 to-white min-h-screen'>
      <div className='container mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8'>
        {/* Left Column - Images */}
        <div className='space-y-6'>
          {/* Main Product Image */}
          <div className='bg-white shadow-xl rounded-2xl p-6 border border-green-100'>
            <div className='bg-gradient-to-br from-green-50 to-white lg:min-h-[85vh] lg:max-h-[65vh] rounded-xl min-h-80 max-h-56 h-full w-full border-2 border-green-100 overflow-hidden relative cursor-crosshair'>
              <img
                ref={zoomImageRef}
                src={data.image[image]}
                className='w-full h-full object-scale-down transition-transform duration-200'
                alt={data.name}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              /> 
              
              {/* Zoom Indicator Overlay */}
              {isZoomed && (
                <div 
                  className='absolute border-2 border-green-500/50 bg-green-100/50 bg-opacity-30 pointer-events-none'
                  style={{
                    left: `${Math.max(0, Math.min(75, zoomPosition.x - 12.5))}%`,
                    top: `${Math.max(0, Math.min(75, zoomPosition.y - 12.5))}%`,
                    width: '25%',
                    height: '25%',
                  }}
                />
              )}
              
              {/* Zoom Instructions */}
              {!isZoomed && (
                <div className='absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                  🔍 Hover to zoom
                </div>
              )}
            </div>
            
            {/* Image Indicator Dots */}
            <div className='flex items-center justify-center gap-2 mt-4'>
              {
                data.image.map((img,index)=>{
                  return(
                    <div 
                      key={img+index+"point"} 
                      className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-200 cursor-pointer ${
                        index === image 
                          ? "bg-green-500 shadow-lg" 
                          : "bg-green-200 hover:bg-green-300"
                      }`}
                      onClick={() => setImage(index)}
                    ></div>
                  )
                })
              }
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className='bg-white shadow-lg rounded-xl p-4 border border-green-100'>
            <div className='grid relative'>
              <div ref={imageContainer} className='flex gap-3 z-10 relative w-full overflow-x-auto scrollbar-none pb-2'>
                {
                  data.image.map((img,index)=>{
                    return(
                      <div 
                        className={`w-20 h-20 min-h-20 min-w-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === image 
                            ? 'border-green-500 shadow-lg' 
                            : 'border-green-200 hover:border-green-400 shadow-md hover:shadow-lg'
                        }`} 
                        key={img+index}
                      >
                        <img
                          src={img}
                          alt='product thumbnail'
                          onClick={()=>setImage(index)}
                          className='w-full h-full object-scale-down bg-green-50 hover:bg-white hover:scale-110 transition-transform duration-200' 
                        />
                      </div>
                    )
                  })
                }
              </div>
              <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
                <button 
                  onClick={handleScrollLeft} 
                  className='z-10 bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-400 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-green-600'
                >
                  <FaAngleLeft/>
                </button>
                <button 
                  onClick={handleScrollRight} 
                  className='z-10 bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-400 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-green-600'
                >
                  <FaAngleRight/>
                </button>
              </div>
            </div>
          </div>

          {/* Product Details - Desktop */}
          <div className='hidden lg:block bg-white shadow-lg rounded-xl p-6 border border-green-100 space-y-4'>
            <h3 className='text-xl font-bold text-green-800 border-b border-green-200 pb-2'>Product Details</h3>
            <div className='space-y-3'>
              <div className='bg-green-50 p-3 rounded-lg border border-green-200'>
                <p className='font-semibold text-green-800'>Description</p>
                <p className='text-gray-700 mt-1'>{data.description}</p>
              </div>
              <div className='bg-green-50 p-3 rounded-lg border border-green-200'>
                <p className='font-semibold text-green-800'>Unit</p>
                <p className='text-gray-700 mt-1'>{data.unit}</p>
              </div>
              {data?.more_details && (
                <div className='bg-green-50 rounded-lg border border-green-200'>
                  <div className='p-3 cursor-pointer' onClick={() => setShowMore(!showMore)}>
                    <div className='flex justify-between items-center'>
                      <p className='font-semibold text-green-800'>More Details</p>
                      <span className='text-sm text-gray-600'>
                        {showMore ? 'Hide Details' : 'Show Details'}
                      </span>
                    </div>
                  </div>
                  {showMore && (
                    <div className='space-y-3'>
                      {Object.keys(data?.more_details).map((element, index) => {
                        return (
                          <div key={element + index} className='px-4 py-3 border-t border-green-100'>
                            <p className='font-semibold text-green-800'>{element}</p>
                            <p className='text-gray-700 mt-1'>{data.more_details[element]}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className='space-y-6 relative'>
          {/* Zoom Window */}
          {isZoomed && (
            <div className='fixed top-4 z-50 bg-white shadow-2xl rounded-xl border-2 border-green-200 overflow-hidden lg:w-80 lg:h-80 w-64 h-64'>
              <div className='relative w-full h-full bg-gradient-to-br from-green-50 to-white'>
                <div className='absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold'>
                  🔍 Zoomed View
                </div>
                <img
                  src={data.image[image]}
                  className='w-full h-full object-cover'
                  style={{
                    objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: 'scale(3)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                  alt={`${data.name} - Zoomed`}
                />
              </div>
            </div>
          )}
          {/* Main Product Info Card */}
          <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4'>
            <div className='max-w-2xl mx-auto'>
                <div className='bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20 relative overflow-hidden'>
                    
                    {/* Background Pattern */}
                    <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-16 translate-x-16'></div>
                    <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-12 -translate-x-12'></div>
                    
                    {/* Header Section */}
                    <div className='relative z-10'>
                        {/* Delivery Badge & Like Button */}
                        <div className='flex justify-between items-start mb-6'>
                            <div className='flex gap-3'>
                                <span className='bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all duration-300'>
                                    <FaTruck className='animate-pulse' />
                                    Fast Delivery
                                </span>
                                <span className='bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2'>
                                    <FaFire />
                                    Hot Deal
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-3 rounded-full transition-all duration-300 ${
                                    isLiked 
                                        ? 'bg-red-500 text-white shadow-lg scale-110' 
                                        : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
                                }`}
                            >
                                <FaHeart className={isLiked ? 'animate-pulse' : ''} />
                            </button>
                        </div>

                        {/* Product Name */}
                        <h1 className='text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3'>
                            {data.name}
                        </h1>
                        
                        <div className='flex items-center gap-3 mb-6'>
                            <p className='text-green-600 font-semibold text-lg bg-green-50 px-4 py-2 rounded-xl border border-green-200'>
                                {data.unit}
                            </p>
                            <div className='flex items-center gap-1'>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                                ))}
                                <span className='text-sm text-gray-500 ml-2'>(4.8)</span>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Price Section */}
                    <div className='my-8 relative z-10'>
                        <h3 className='text-xl font-bold text-gray-700 mb-4 flex items-center gap-2'>
                            <div className='w-1 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full'></div>
                            Pricing
                        </h3>
                        
                        <div className='flex items-center gap-4 flex-wrap'>
                            <div className='bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300'>
                                <p className='font-bold text-2xl lg:text-3xl'>
                                    {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                                </p>
                            </div>
                            
                            {data.discount && (
                                <>
                                    <div className='flex flex-col items-center'>
                                        <p className='line-through text-gray-400 text-lg font-medium'>
                                            {DisplayPriceInRupees(data.price)}
                                        </p>
                                        <p className='text-xs text-gray-500'>Original Price</p>
                                    </div>
                                    
                                    <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300'>
                                        <p className="font-bold text-lg flex items-center gap-1">
                                            {data.discount}% 
                                            <span className='text-sm font-normal'>OFF</span>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {data.discount && (
                            <div className='mt-3 text-green-600 font-semibold'>
                                💰 You save ₹{(data.price * data.discount / 100).toLocaleString()}!
                            </div>
                        )}
                    </div>

                    {/* Stock & Add to Cart Section */}
                    <div className='my-8 relative z-10'>
                        {data.stock === 0 ? (
                            <div className='bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-center shadow-lg'>
                                <div className='text-4xl mb-2'>😞</div>
                                <p className='text-xl text-red-600 font-bold mb-2'>Out of Stock</p>
                                <p className='text-red-500'>This item is currently unavailable</p>
                            </div>
                        ) : (
                            <div className='bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='text-center'>
                                        <p className='text-green-600 font-semibold text-lg mb-1'>
                                            ✅ In Stock ({data.stock} available)
                                        </p>
                                        <p className='text-gray-600 text-sm'>Ready for immediate dispatch</p>
                                    </div>
                                    
                                    <AddToCartButton data={data} />
                                    
                                    <div className='flex items-center gap-6 text-sm text-gray-600 mt-2'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                                            <span>Free Shipping</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                            <span>Easy Returns</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Features */}
                    <div className='grid grid-cols-2 gap-4 mt-6 relative z-10'>
                        <div className='bg-white/50 border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300'>
                            <div className='text-2xl mb-2'>🌱</div>
                            <p className='font-semibold text-gray-700'>Organic</p>
                        </div>
                        <div className='bg-white/50 border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300'>
                            <div className='text-2xl mb-2'>🚚</div>
                            <p className='font-semibold text-gray-700'>Same Day</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

          {/* Why Shop Section */}
          <div className='bg-white shadow-lg rounded-xl p-6 border border-green-100'>
            <h2 className='text-xl font-bold text-green-800 mb-6 border-b border-green-200 pb-2'>
              🌟 Why shop from ADash?
            </h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow duration-200'>
                <img
                  src={image1}
                  alt='superfast delivery'
                  className='w-16 h-16 lg:w-20 lg:h-20 rounded-lg shadow-sm'
                />
                <div className='text-sm'>
                  <div className='font-semibold text-green-800 text-base mb-1'>Superfast Delivery</div>
                  <p className='text-gray-600'>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                </div>
              </div>
              
              <div className='flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow duration-200'>
                <img
                  src={image2}
                  alt='Best prices offers'
                  className='w-16 h-16 lg:w-20 lg:h-20 rounded-lg shadow-sm'
                />
                <div className='text-sm'>
                  <div className='font-semibold text-green-800 text-base mb-1'>Best Prices & Offers</div>
                  <p className='text-gray-600'>Best price destination with offers directly from the manufacturers.</p>
                </div>
              </div>
              
              <div className='flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow duration-200'>
                <img
                  src={image3}
                  alt='Wide Assortment'
                  className='w-16 h-16 lg:w-20 lg:h-20 rounded-lg shadow-sm'
                />
                <div className='text-sm'>
                  <div className='font-semibold text-green-800 text-base mb-1'>Wide Assortment</div>
                  <p className='text-gray-600'>Choose from 5000+ products across food, personal care, household & other categories.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details - Mobile */}
          <div className='lg:hidden bg-white shadow-lg rounded-xl p-6 border border-green-100 space-y-4'>
            <h3 className='text-xl font-bold text-green-800 border-b border-green-200 pb-2'>Product Details</h3>
            <div className='space-y-3'>
              <div className='bg-green-50 p-3 rounded-lg border border-green-200'>
                <p className='font-semibold text-green-800'>Description</p>
                <p className='text-gray-700 mt-1'>{data.description}</p>
              </div>
              <div className='bg-green-50 p-3 rounded-lg border border-green-200'>
                <p className='font-semibold text-green-800'>Unit</p>
                <p className='text-gray-700 mt-1'>{data.unit}</p>
              </div>
              {
                data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
                  return(
                    <div key={element+index} className='bg-green-50 p-3 rounded-lg border border-green-200'>
                      <p className='font-semibold text-green-800'>{element}</p>
                      <p className='text-gray-700 mt-1'>{data?.more_details[element]}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
          {/* Related Products Section */}
          <div className='container mx-auto px-4 py-8'>
            <h2 className='text-2xl font-bold text-green-800 mb-6'>Related Products</h2>
            
            {relatedLoading ? (
              <div className='text-center py-8'>Loading related products...</div>
            ) : relatedError ? (
              <div className='text-center text-red-500 py-8'>Failed to load related products</div>
            ) : relatedProducts.length === 0 ? (
              <div className='text-center py-8'>No related products found</div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {relatedProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.name.replace(/\s+/g, '-')}-${product._id}`}
                    className='group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
                  >
                    <div className='relative aspect-square'>
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className='w-full h-full object-cover'
                      />
                      {product.discount > 0 && (
                        <div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm'>
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className='p-4'>
                      <h3 className='text-sm font-semibold text-gray-800 mb-1'>{product.name}</h3>
                      <p className='text-xs text-gray-600 mb-2'>{product.unit}</p>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center'>
                          <span className='text-yellow-400'>
                            {Array(Math.round(product.rating)).fill(null).map((_, i) => (
                              <svg key={i} className='w-3 h-3' viewBox='0 0 20 20' fill='currentColor'>
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                              </svg>
                            ))}
                          </span>
                          <span className='ml-1 text-xs text-gray-500'>({product.rating})</span>
                        </div>
                        <div className='text-sm font-semibold text-green-600'>
                          {DisplayPriceInRupees(pricewithDiscount(product.price, product.discount))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

    </section>
  )
}

export default ProductDisplayPage