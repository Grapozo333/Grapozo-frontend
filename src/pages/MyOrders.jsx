import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Package, MapPin, Clock, CreditCard, Truck, CheckCircle, Loader2, Gift, ChevronDown, ChevronUp } from 'lucide-react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { setOrder } from '../store/orderSlice'
import { useScrollToTop } from '../hooks/useScrollToTop'
import isAdmin from '../utils/isAdmin'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const NoData = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
    <div className="bg-green-50 p-6 rounded-full mb-4">
      <Package size={48} className="text-green-300" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-700">
      {filter === 'delivered' ? 'No Delivered Orders' : filter === 'pending' ? 'No Pending Orders' : 'No Orders Found'}
    </h3>
    <p className="text-gray-500 text-center max-w-md text-sm">
      {filter === 'delivered' 
        ? 'You have no delivered orders yet.' 
        : filter === 'pending' 
        ? 'You have no pending orders at the moment.' 
        : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
      }
    </p>
  </div>
)

const MyOrders = () => {
  useScrollToTop()
  const dispatch = useDispatch()
  const orders = useSelector(state => state.orders.order)
  const { deleteOrder } = useGlobalContext()
  const [loadingOrders, setLoadingOrders] = useState({})
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'delivered', 'pending'
  const [expandedOrders, setExpandedOrders] = useState({}) // Track expanded state of each order
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [processingOrder, setProcessingOrder] = useState("")
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100)
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'CASH ON DELIVERY':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'PAID':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'PENDING':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getDeliveryStatusStyle = (status) => {
    if (status === 'Delivered') {
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200'
    }
    return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md shadow-amber-200'
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const handleOrderDelivered = async (orderId) => {
    const isConfirmed = window.confirm('Are you sure you want to mark this order as delivered?')
    if (!isConfirmed) {
      return
    }
    setLoadingOrders(prev => ({
      ...prev,
      [orderId]: true
    }))
    try {
      const response = await Axios({
        ...SummaryApi.markOrderDelivered,
        data: { orderId }
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success('Order marked as delivered!')
        const updatedOrders = orders.map(order =>
          order.orderId === responseData.data.orderId ? { ...order, delivery_status: 'Delivered' } : order
        )
        dispatch(setOrder(updatedOrders))
      }
    } catch (error) {
      toast.error('Failed to mark as delivered')
    } finally {
      setLoadingOrders(prev => {
        const newState = { ...prev }
        delete newState[orderId]
        return newState
      })
    }
  }

  // Mark order as processing (admin)
  const handleProcessing = async (orderId) => {
    setProcessingOrder(orderId);
    try {
      await Axios.put('/api/order/seller-processing', { orderId });
      // Optionally refresh orders here if needed
    } catch {}
    setProcessingOrder("");
  };

  // Filter orders based on active filter
  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return []
    
    switch (activeFilter) {
      case 'delivered':
        return orders.filter(order => order.delivery_status === 'Delivered')
      case 'pending':
        return orders.filter(order => order.delivery_status !== 'Delivered')
      default:
        return orders
    }
  }

  const filteredOrders = getFilteredOrders()
  const deliveredCount = orders?.filter(order => order.delivery_status === 'Delivered').length || 0
  const pendingCount = orders?.filter(order => order.delivery_status !== 'Delivered').length || 0
  const totalCount = orders?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-green-100'>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              My Orders
            </h1>
            <div className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded-full">
              {totalCount} total orders
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              <Package className="h-4 w-4" />
              All Orders
              <span className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('delivered')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeFilter === 'delivered'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Delivered
              <span className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs">
                {deliveredCount}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('pending')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeFilter === 'pending'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md shadow-amber-200'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              <Truck className="h-4 w-4" />
              In Progress
              <span className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs">
                {pendingCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* No Orders State */}
        {filteredOrders.length === 0 && <NoData filter={activeFilter} />}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const isDelivered = order.delivery_status === 'Delivered'
              const isExpanded = expandedOrders[order.orderId]
              
              return (
                <div 
                  key={order._id || `order-${index}`} 
                  className={`bg-white rounded-xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isDelivered 
                      ? 'border-green-200 shadow-green-100 hover:border-green-300' 
                      : 'border-gray-100 hover:border-amber-200'
                  }`}
                >
                  {/* Compact Order Header - Always Visible */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isDelivered ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                          {isDelivered ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono text-sm font-bold text-gray-800">#{order.orderId}</p>
                          <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${getDeliveryStatusStyle(order.delivery_status)}`}>
                          {isDelivered ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Delivered
                            </>
                          ) : (
                            <>
                              <Truck className="h-3 w-3" />
                              Processing
                            </>
                          )}
                        </span>

                        {/* Total Amount */}
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-800">₹{order.totalAmt}</p>
                          <p className="text-xs text-gray-500">{order.products?.length || 0} items</p>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => toggleOrderExpansion(order.orderId)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quick Summary Row */}
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                      
                      {order.delivery_address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{order.delivery_address.city}, {order.delivery_address.state}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details - Show only when expanded */}
                  {isExpanded && (
                    <div className={`border-t ${
                      isDelivered ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'
                    }`}>
                      <div className="p-6">
                        {/* Products Section */}
                        <div className="space-y-4 mb-6">
                          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                              isDelivered ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <Package className={`h-4 w-4 ${
                                isDelivered ? 'text-green-600' : 'text-gray-600'
                              }`} />
                            </div>
                            Products ({order.products?.length || 0})
                          </h3>
                          
                          {order.products?.map((product, productIndex) => (
                            <div key={product._id || productIndex} className={`flex gap-4 p-4 rounded-lg border transition-all duration-300 ${
                              isDelivered 
                                ? 'bg-white border-green-200 hover:bg-green-50' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}>
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <img
                                    src={product.product_details?.image?.[0] || '/placeholder-image.jpg'}
                                    alt={product.product_details?.name || 'Product'}
                                    className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.src = '/placeholder-image.jpg'
                                    }}
                                  />
                                  <div className={`absolute -top-1 -right-1 text-white rounded-full p-0.5 ${
                                    isDelivered ? 'bg-green-500' : 'bg-amber-500'
                                  }`}>
                                    {isDelivered ? (
                                      <CheckCircle className="h-3 w-3" />
                                    ) : (
                                      <Clock className="h-3 w-3" />
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex-grow">
                                <h4 className="font-bold text-base text-gray-800 mb-1">
                                  {product.product_details?.name || 'Product Name'}
                                </h4>
                                <p className="text-gray-600 mb-3 line-clamp-1 text-sm">
                                  {product.product_details?.description || 'No description available'}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm">
                                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    isDelivered 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    Qty: {product.product_details?.quantity || 1}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {product.product_details?.discount > 0 && (
                                      <span className="text-gray-500 line-through text-sm">
                                        ₹{product.product_details?.price}
                                      </span>
                                    )}
                                    
                                    <span className="font-bold text-lg text-green-600">
                                      ₹{calculateDiscountedPrice(
                                        product.product_details?.price || 0,
                                        product.product_details?.discount || 0
                                      ).toFixed(2)}
                                    </span>
                                    
                                    {product.product_details?.discount > 0 && (
                                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                        {product.product_details?.discount}% OFF
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Address */}
                        {order.delivery_address && (
                          <div className="border-t border-gray-200 pt-6 mb-6">
                            <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${
                                isDelivered ? 'bg-green-100' : 'bg-gray-100'
                              }`}>
                                <MapPin className={`h-4 w-4 ${
                                  isDelivered ? 'text-green-600' : 'text-gray-600'
                                }`} />
                              </div>
                              Delivery Address
                            </h3>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600 font-medium">Address: </span>
                                  <span className="font-semibold text-gray-800">{order.delivery_address.address_line || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">City: </span>
                                  <span className="font-semibold text-gray-800">{order.delivery_address.city || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">State: </span>
                                  <span className="font-semibold text-gray-800">{order.delivery_address.state || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">Pincode: </span>
                                  <span className="font-semibold text-gray-800">{order.delivery_address.pincode || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Order Summary */}
                        <div className="border-t border-gray-200 pt-6 mb-6">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center text-base mb-2">
                              <span className="text-gray-600 font-medium">Subtotal:</span>
                              <span className="font-semibold">₹{order.subTotalAmt}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-xl">
                              <span>Total:</span>
                              <span className="text-green-600">₹{order.totalAmt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Actions */}
                        {isAdmin(user.role) && !isDelivered && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOrderDelivered(order.orderId)}
                              disabled={loadingOrders[order.orderId]}
                              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-300 disabled:to-emerald-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              {loadingOrders[order.orderId] ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Mark as Delivered
                                </>
                              )}
                            </button>
                            {order.delivery_status !== 'Processing' && (
                              <button
                                onClick={() => handleProcessing(order.orderId)}
                                disabled={processingOrder === order.orderId}
                                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                {processingOrder === order.orderId ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4" />
                                    Mark as Processing
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                        {/* User Track Order Button */}
                        {!isAdmin(user.role) && !isDelivered && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => navigate(`/track-order/${order.orderId}`)}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Truck className="h-4 w-4" />
                              Track Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders