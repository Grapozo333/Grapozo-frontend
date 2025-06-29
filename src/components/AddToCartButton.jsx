import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])

    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()

        // Check if quantity exceeds stock
        if (qty + 1 > data?.stock) {
            toast.error(`Only ${data?.stock} items available in stock`)
            return
        }

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)
        
        if (response.success) {
            setQty(prev => prev + 1)
            toast.success("Item quantity increased")
        }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if(qty === 1){
            try {
                const response = await deleteCartItem(cartItemDetails?._id)
                if(response.success) {
                    setIsAvailableCart(false)
                    setQty(0)
                    setCartItemsDetails(null)
                }
            } catch (error) {
                AxiosToastError(error)
            }
        } else {
            try {
                const response = await updateCartItem(cartItemDetails?._id,qty-1)
                if(response.success) {
                    setQty(prev => prev - 1)
                    toast.success("Item quantity decreased")
                }
            } catch (error) {
                AxiosToastError(error)
            }
        }
    }

    return (
        <div>
            {isAvailableCart ? (
                <div className='flex items-center border border-gray-300 rounded overflow-hidden'>
                    <button 
                        onClick={decreaseQty} 
                        className='bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 flex items-center justify-center transition-colors'
                    >
                        <FaMinus className='text-xs' />
                    </button>
                    
                    <div className='px-2 py-1 bg-white min-w-8'>
                        <p className='text-sm font-medium text-center'>{qty}</p>
                    </div>
                    
                    <button 
                        onClick={increaseQty} 
                        className='bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 flex items-center justify-center transition-colors'
                    >
                        <FaPlus className='text-xs' />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleADDTocart} 
                    disabled={loading}
                    className='bg-green-600 hover:bg-green-700 cursor-pointer text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50'
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            )}
        </div>
    )
}

export default AddToCartButton