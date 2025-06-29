import React from 'react'

const CardLoading = () => {
  return (
    <div className='border-2 border-green-100 py-3 lg:p-5 grid gap-2 lg:gap-4 min-w-36 lg:min-w-52 rounded-xl cursor-pointer bg-white animate-pulse shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='min-h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-lg'>
      </div>
      <div className='p-2 lg:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg w-20'>
      </div>
      <div className='p-2 lg:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg'>
      </div>
      <div className='p-2 lg:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg w-14'>
      </div>
       
      <div className='flex items-center justify-between gap-3'>
        <div className='p-2 lg:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg w-20'>
        </div>
        <div className='p-2 lg:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg w-20'>
        </div>
      </div>
     </div>
  )
}

export default CardLoading