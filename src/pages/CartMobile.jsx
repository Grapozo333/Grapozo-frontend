import React from 'react'
import DisplayCartItem from '../components/DisplayCartItem'
import { useScrollToTop } from '../hooks/useScrollToTop'

const CartMobile = () => {
  useScrollToTop()
  return (
    <DisplayCartItem/>
  )
}

export default CartMobile
