import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import { Truck, CheckCircle, Clock, MapPin, Package, ChevronDown, ChevronUp, CreditCard, DollarSign } from 'lucide-react';

const RiderPage = () => {
  const user = useSelector(state => state.user);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estimate, setEstimate] = useState({});
  const [updating, setUpdating] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch unassigned and my orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const [unassignedRes, myOrdersRes] = await Promise.all([
        Axios.get('/api/order/unassigned-orders'),
        Axios.get('/api/order/rider-orders', { params: { riderId: user._id } })
      ]);
      setUnassignedOrders(unassignedRes.data.data || []);
      setMyOrders((myOrdersRes.data.data || []).map(r => ({ ...r, ...r.orderId, _id: r.orderId._id, status: r.status })));
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user._id) fetchOrders();
    // eslint-disable-next-line
  }, [user._id]);

  // Accept an order
  const handleAccept = async (orderId) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await Axios.post('/api/order/rider-accept', { riderId: user._id, orderId });
      await fetchOrders();
    } catch {}
    setUpdating(prev => ({ ...prev, [orderId]: false }));
  };

  // Update estimated time
  const handleEstimate = async (orderId) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await Axios.put('/api/order/rider-estimate', {
        riderId: user._id,
        orderId,
        estimatedTime: estimate[orderId] || ''
      });
      await fetchOrders();
    } catch {}
    setUpdating(prev => ({ ...prev, [orderId]: false }));
  };

  // Mark as delivered
  const handleDelivered = async (orderId) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await Axios.put('/api/order/rider-delivered', { riderId: user._id, orderId });
      await fetchOrders();
    } catch {}
    setUpdating(prev => ({ ...prev, [orderId]: false }));
  };

  const OrderCard = ({ order, isAccepted }) => {
    const isExpanded = expandedOrder === order._id;

    return (
      <div className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-shadow ${
        isAccepted ? 'border-green-200' : 'border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            {/* Order Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isAccepted ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isAccepted ? (
                  <Truck className="w-5 h-5 text-green-600" />
                ) : (
                  <Package className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <div className="font-bold text-lg text-gray-800">
                  Order #{order.orderId}
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <div className="font-medium">Delivery Address:</div>
                  <div>{order.delivery_address?.address_line}</div>
                  <div>{order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}</div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">₹{order.totalAmt}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                order.payment_status === 'PAID' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-yellow-50 text-yellow-700'
              }`}>
                <CreditCard className="w-4 h-4" />
                {order.payment_status}
              </div>
            </div>

            {/* Estimated Time Input (for accepted orders) */}
            {isAccepted && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-700">Estimated Delivery Time</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={estimate[order._id] || order.estimatedTime || ''}
                    onChange={e => setEstimate(prev => ({ ...prev, [order._id]: e.target.value }))}
                    placeholder="e.g., 30 minutes"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleEstimate(order._id)}
                    disabled={updating[order._id]}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {updating[order._id] ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:w-48">
            {isAccepted ? (
              <>
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {order.status || 'Accepted'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelivered(order._id)}
                  disabled={updating[order._id]}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {updating[order._id] ? 'Processing...' : 'Mark as Delivered'}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAccept(order._id)}
                disabled={updating[order._id]}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {updating[order._id] ? 'Processing...' : 'Accept Order'}
              </button>
            )}
          </div>
        </div>
        
        {/* Products Section */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setExpandedOrder(isExpanded ? null : order._id)} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            {isExpanded ? 'Hide Products' : 'View Products'}
            {isExpanded ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          
          {isExpanded && (
            <div className="mt-4 space-y-3">
              {order.products.map(p => (
                <div key={p.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={p.product_details.image[0]} 
                    alt={p.product_details.name} 
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{p.product_details.name}</div>
                    <div className="text-sm text-gray-500">Quantity: {p.product_details.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Rider Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <div className="mt-4 text-gray-600">Loading orders...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Unassigned Orders Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Available Orders</h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {unassignedOrders.length}
                </span>
              </div>
              
              {unassignedOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600">No unassigned orders available</div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {unassignedOrders.map(order => (
                    <OrderCard key={order._id} order={order} isAccepted={false} />
                  ))}
                </div>
              )}
            </section>

            {/* My Orders Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">My Accepted Orders</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {myOrders.length}
                </span>
              </div>
              
              {myOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600">No accepted orders yet</div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {myOrders.map(order => (
                    <OrderCard key={order._id} order={order} isAccepted={true} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderPage;