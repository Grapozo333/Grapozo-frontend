import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import HeroSection from '../components/HeroSection'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { useScrollToTop } from '../hooks/useScrollToTop'

const Home = () => {
  useScrollToTop()
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }

    return (
   <section className='bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen overflow-x-hidden'>
      <div className='container mx-auto w-full'>
          {/* <div className={`w-full h-full min-h-48 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-lg overflow-hidden ${!banner && "animate-pulse my-2" } `}>
              <img
                src={banner}
                className='w-full h-full hidden lg:block hover:scale-105 transition-transform duration-500'
                alt='banner'
               />
              <img
                src={bannerMobile}
                className='w-full h-full lg:hidden hover:scale-105 transition-transform duration-500'
                alt='banner'
               />
          </div> */}
          <HeroSection/>
      </div>
             
      <div className='container mx-auto px-4 my-8'>
          <h2 className='text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent'>
              Shop by Categories
          </h2>
          <div className='grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded-xl p-4 min-h-36 grid gap-2 shadow-lg animate-pulse border border-green-100'>
                    <div className='bg-green-100 min-h-24 rounded-lg'></div>
                    <div className='bg-green-100 h-8 rounded-lg'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full h-full group cursor-pointer' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div className='bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 group-hover:scale-105'>
                        <div className='bg-gradient-to-br from-green-50 to-white rounded-lg p-2 mb-2'>
                            <img
                               src={cat.image}
                              className='w-full h-16 object-scale-down group-hover:scale-110 transition-transform duration-300'
                            />
                        </div>
                        <p className='text-xs font-semibold text-center text-gray-700 group-hover:text-green-700 transition-colors duration-300'>
                            {cat.name}
                        </p>
                    </div>
                  </div>
                )
              })
                           
            )
          }
      </div>
      </div>

       {/***display category product */}
       <div className='space-y-4'>
       {
         categoryData?.map((c,index)=>{
           return(
             <CategoryWiseProductDisplay
               key={c?._id+"CategorywiseProduct"}
               id={c?._id}
               name={c?.name}
             />
           )
         })
       }
       </div>
      </section>
  )
}

export default Home