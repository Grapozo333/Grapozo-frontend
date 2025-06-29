import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'
import { Package } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Edit2 } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useScrollToTop } from '../hooks/useScrollToTop'

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState(null)
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })
    // const allCategory = useSelector(state => state.product.allCategory)


    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },[allCategory])
    
    const fetchCategory = async () => {
        useScrollToTop()
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            } else {
                toast.error(responseData.message || 'Failed to fetch categories')
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50'>
            {/* Header */}
            <div className='bg-white shadow-lg border-b-4 border-green-500'>
                <div className='max-w-7xl mx-auto px-6 py-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center'>
                                <Package className='w-6 h-6 text-green-600' />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-gray-800'>Categories</h1>
                                <p className='text-sm text-gray-500'>Manage your product categories</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setOpenUploadCategory(true)} 
                            className='cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        >
                            <Plus className='w-5 h-5' />
                            Add Category
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className='max-w-7xl mx-auto px-6 py-8'>
                {!categoryData[0] && !loading && (
                    <div className='bg-white rounded-2xl shadow-lg p-8'>
                        <NoData />
                    </div>
                )}

                {/* Category Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {categoryData.map((category, index) => (
                        <div key={category._id} className='group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-green-100'>
                            {/* Image Container */}
                            <div className='relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden'>
                                <img 
                                    alt={category.name}
                                    src={category.image}
                                    className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                            
                            {/* Content */}
                            <div className='p-4'>
                                <h3 className='font-semibold text-gray-800 text-center mb-4 text-lg'>
                                    {category.name}
                                </h3>
                                
                                {/* Action Buttons */}
                                <div className='flex gap-2'>
                                    <button 
                                        onClick={() => {
                                            setOpenEdit(true)
                                            setEditData(category)
                                        }} 
                                        className='flex-1 flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2.5 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300'
                                    >
                                        <Edit2 className='w-4 h-4' />
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setOpenConfirmBoxDelete(true)
                                            setDeleteCategory(category)
                                        }} 
                                        className='flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2.5 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className='bg-white rounded-2xl shadow-lg p-8 mt-6'>
                        <Loading />
                    </div>
                )}
            </div>

            {/* Modals */}
            {openUploadCategory && (
                <UploadCategoryModel 
                    fetchData={fetchCategory} 
                    close={() => setOpenUploadCategory(false)} 
                />
            )}

            {openEdit && (
                <EditCategory 
                    data={editData} 
                    close={() => setOpenEdit(false)} 
                    fetchData={fetchCategory} 
                />
            )}

            {openConfimBoxDelete && (
                <CofirmBox 
                    close={() => setOpenConfirmBoxDelete(false)} 
                    cancel={() => setOpenConfirmBoxDelete(false)} 
                    confirm={handleDeleteCategory} 
                />
            )}
        </section>
    )
}

export default CategoryPage
