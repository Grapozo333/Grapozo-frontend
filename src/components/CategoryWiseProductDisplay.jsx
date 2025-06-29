import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name, renderProductAction }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectProductListpage = ()=>{
        const subcategory = subCategoryData.find(sub =>{
          const filterData = sub.category.some(c => {
            return c._id == id
          })

          return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL =  handleRedirectProductListpage()
    return (
        <div className='bg-gradient-to-r from-green-50 to-white py-6 my-8 rounded-2xl border border-green-100'>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-bold text-xl md:text-2xl text-gray-800 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent'>{name}</h3>
                <Link to={redirectURL} className='text-green-600 hover:text-green-800 font-semibold px-4 py-2 bg-green-50 hover:bg-green-100 rounded-full transition-all duration-300 border border-green-200 hover:border-green-300'>
                    See All →
                </Link>
            </div>
            <div className='relative flex items-center'>
                <div className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <div key={p._id + "CategorywiseProductDisplay" + index} className="relative">
                                    <CardProduct
                                        data={p}
                                    />
                                    {renderProductAction && renderProductAction(p)}
                                </div>
                            )
                        })
                    }
                </div>
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='cursor-pointer z-10 relative bg-white hover:bg-green-50 shadow-xl text-lg p-3 rounded-full border-2 border-green-100 hover:border-green-300 text-green-700 hover:text-green-800 transition-all duration-300 hover:scale-110'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleScrollRight} className='cursor-pointer z-10 relative bg-white hover:bg-green-50 shadow-xl p-3 text-lg rounded-full border-2 border-green-100 hover:border-green-300 text-green-700 hover:text-green-800 transition-all duration-300 hover:scale-110'>
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay