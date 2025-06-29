import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useScrollToTop } from '../hooks/useScrollToTop'
import dayjs from 'dayjs'

const ProductListPage = () => {
  useScrollToTop()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])
  const [sortOption, setSortOption] = useState('featured')

  console.log(AllSubCategory)

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 12,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (page > 1) {
      fetchProductdata()
    }
  }, [page])

  // Sorting logic
  const getSortedData = () => {
    if (sortOption === 'priceLowHigh') {
      return [...data].sort((a, b) => a.price - b.price)
    } else if (sortOption === 'priceHighLow') {
      return [...data].sort((a, b) => b.price - a.price)
    } else if (sortOption === 'newest') {
      // If products have a 'createdAt' or 'date' field
      return [...data].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        }
        return 0
      })
    }
    // Default: featured (original order)
    return data
  }

  const sortedData = getSortedData()

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex h-screen'>
        {/* Left Sidebar - Subcategories */}
        <div className='w-64 lg:w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col'>
          {/* Sidebar Header */}
          <div className='p-4 border-b border-gray-200 bg-gray-50'>
            <h2 className='text-lg font-semibold text-gray-800'>Categories</h2>
          </div>
          
          {/* Subcategories List */}
          <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
            <div className='p-2'>
              {DisplaySubCatory.map((s, index) => {
                const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
                const isActive = subCategoryId === s._id
                
                return (
                  <Link 
                    key={s._id} 
                    to={link} 
                    className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 hover:bg-green-50 hover:shadow-sm ${
                      isActive 
                        ? 'bg-green-100 border-l-4 border-green-500 shadow-sm' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3'>
                      <img
                        src={s.image}
                        alt={s.name}
                        className='w-8 h-8 object-contain'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className={`text-sm font-medium truncate ${
                        isActive ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {s.name}
                      </p>
                    </div>
                    {isActive && (
                      <div className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0'></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Content Area - Products */}
        <div className='flex-1 flex flex-col'>
          {/* Header */}
          <div className='bg-white shadow-sm border-b border-gray-200 p-4 z-10'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-gray-800 capitalize'>
                  {subCategoryName}
                </h1>
                <p className='text-sm text-gray-600 mt-1'>
                  {data.length} products available
                </p>
              </div>
              <div className='flex items-center space-x-4'>
                <select
                  className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value='featured'>Sort by: Featured</option>
                  <option value='priceLowHigh'>Price: Low to High</option>
                  <option value='priceHighLow'>Price: High to Low</option>
                  <option value='newest'>Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className='flex-1 overflow-y-auto bg-gray-50'>
            <div className='p-6'>
              {sortedData.length > 0 ? (
                <>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
                    {sortedData.map((product, index) => (
                      <div key={product._id + "productSubCategory" + index} className='transform hover:scale-105 transition-transform duration-200'>
                        <CardProduct data={product} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {page < totalPage && (
                    <div className='flex justify-center mt-8'>
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2'
                      >
                        {loading ? (
                          <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <span>Load More Products</span>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='flex flex-col items-center justify-center py-20'>
                  <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4'>
                    <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M17 13h2m-2 0v4a2 2 0 01-2 2h-2m0 0h-2' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>No products found</h3>
                  <p className='text-gray-500 text-center max-w-md'>
                    We couldn't find any products in this category. Try browsing other categories or check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && page === 1 && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <Loading />
        </div>
      )}
    </div>
  )
}

export default ProductListPage