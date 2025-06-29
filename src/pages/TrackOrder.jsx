import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft, Phone, Calendar } from 'lucide-react';

const statusSteps = [
  { key: 'Placed', label: 'Order Placed', icon: <Package className="w-5 h-5" /> },
  { key: 'Processing', label: 'Processing', icon: <Clock className="w-5 h-5" /> },
  { key: 'Shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
  { key: 'Delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
];

const getCurrentStep = (status) => {
  switch (status) {
    case 'Delivered': return 3;
    case 'Shipped': return 2;
    case 'Processing': return 1;
    case 'Placed':
    default: return 0;
  }
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await Axios.get('/api/order/track', { params: { orderId } });
        setOrder(res.data.data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const currentStep = getCurrentStep(order?.delivery_status || 'Placed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors duration-200 hover:bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-green-300"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Orders
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-green-800">
              Order Tracking
            </h1>
            <p className="text-gray-600">Real-time status updates for your order</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Order</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : !order ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Not Found</h3>
            <p className="text-gray-600">The order you're looking for doesn't exist.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-2xl font-bold text-gray-800">#{order.orderId}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.delivery_status === 'Delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                      order.delivery_status === 'Shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      order.delivery_status === 'Processing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {order.delivery_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {order.delivery_address?.address_line}, {order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-700">₹{order.totalAmt}</div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {order.estimatedTime && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Estimated Delivery</div>
                      <div className="text-green-700 font-medium">{order.estimatedTime} mins</div>
                    </div>
                  </div>
                </div>
              )}
              {order.riderMobile && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Rider Contact</div>
                      <div className="text-green-700 font-medium">{order.riderMobile}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">Order Progress</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between relative z-10">
                  {statusSteps.map((step, idx) => (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 transition-all duration-500 ${
                        idx < currentStep
                          ? 'bg-green-600 border-green-600 text-white shadow-md'
                          : idx === currentStep
                            ? 'bg-green-600 border-green-600 text-white shadow-md ring-4 ring-green-100'
                            : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-sm font-semibold text-center max-w-20 ${
                        idx <= currentStep
                          ? 'text-green-700'
                          : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
              <div className="space-y-4">
                {order.products?.map((product, idx) => (
                  <div key={product._id || idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="relative">
                      <img
                        src={product.product_details?.image?.[0] || '/placeholder-image.jpg'}
                        alt={product.product_details?.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {product.product_details?.quantity || 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{product.product_details?.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {product.product_details?.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ₹{product.product_details?.price}
                      </div>
                      {product.product_details?.discount > 0 && (
                        <div className="text-sm text-green-600 font-semibold">
                          {product.product_details?.discount}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{order.totalAmt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;