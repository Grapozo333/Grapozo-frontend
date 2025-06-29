import React from 'react'

const Divider = () => {
  return (
    <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t-2 border-gradient-to-r from-transparent via-green-200 to-transparent'></div>
        </div>
        <div className='relative flex justify-center'>
            <div className='bg-white px-4'>
                <div className='w-8 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full'></div>
            </div>
        </div>
    </div>
)
}

export default Divider
