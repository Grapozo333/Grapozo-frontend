import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useState } from 'react'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)

    return (
    <Link to={url} className='relative border border-gray-200 p-3 grid gap-2 w-44 h-70 rounded-lg cursor-pointer bg-white hover:shadow-md transition-shadow duration-200' >
        
        {/* Discount Badge - Top Left Corner */}
        {Boolean(data.discount) && (
          <div className='absolute top-2 left-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-md z-10'>
            {data.discount}% OFF
          </div>
        )}

        {/* Image */}
        <div className='h-32 w-full rounded overflow-hidden bg-gray-50'>
            <img 
                src={data.image[0]}
                className='w-full h-full object-contain'
            />
        </div>
        
        {/* Product Name */}
        <div className='text-sm font-medium text-gray-800 line-clamp-2 h-10'>
          {data.name}
        </div>
        
        {/* Unit */}
        <div className='text-xs text-gray-500'>
          {data.unit}                              
        </div>
         
        {/* Price and Action */}
        <div className='flex items-center justify-between mt-auto'>
          <div className='flex flex-col'>
            {Boolean(data.discount) ? (
              <div className='flex flex-col'>
                {/* Original Price - Strikethrough */}
                <span className='text-xs text-gray-400 line-through'>
                  {DisplayPriceInRupees(data.price)}
                </span>
                {/* Discounted Price */}
                <div className='font-semibold text-gray-900'>
                  {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))}
                </div>
              </div>
            ) : (
              /* Regular Price when no discount */
              <div className='font-semibold text-gray-900'>
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
                
          <div>
            {
              data.stock == 0 ? (
                <p className='text-red-500 text-xs font-medium'>
                    Out of stock
                </p>
              ) : (
                <AddToCartButton data={data} />
              )
            }                                    
          </div>
        </div>

    </Link>
  )
}

export default CardProduct