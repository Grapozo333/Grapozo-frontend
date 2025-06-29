import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const SellerPage = () => {
  const user = useSelector(state => state.user);
  const categoryData = useSelector(state => state.product.allCategory);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stock, setStock] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Seller's products state
  const [myProducts, setMyProducts] = useState([]);
  const [myProductsLoading, setMyProductsLoading] = useState(true);

  // Shop info state
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopInfoLoading, setShopInfoLoading] = useState(false);
  const [shopInfoMsg, setShopInfoMsg] = useState("");

  // Fetch seller's products
  useEffect(() => {
    const fetchMyProducts = async () => {
      setMyProductsLoading(true);
      try {
        const res = await Axios.get('/api/seller/my-products', {
          params: { sellerId: user._id }
        });
        setMyProducts(res.data.data || []);
      } catch (err) {
        setMyProducts([]);
      } finally {
        setMyProductsLoading(false);
      }
    };
    if (user._id) fetchMyProducts();
  }, [user._id]);

  // Fetch seller profile info
  useEffect(() => {
    const fetchProfile = async () => {
      setShopInfoLoading(true);
      try {
        const res = await Axios.get('/api/seller/profile', {
          params: { sellerId: user._id }
        });
        setShopName(res.data.data?.shopName || "");
        setShopAddress(res.data.data?.shopAddress || "");
      } catch (err) {
        setShopName("");
        setShopAddress("");
      } finally {
        setShopInfoLoading(false);
      }
    };
    if (user._id) fetchProfile();
  }, [user._id]);

  // Handler to open modal/form for a product
  const handleAddProduct = (product) => {
    setSelectedProduct(product);
    setStock(1);
    setModalOpen(true);
    setMessage("");
  };

  // Handler to submit product and stock to backend
  const handleSubmit = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const response = await Axios.post('/api/seller/stock', {
        sellerId: user._id,
        productId: selectedProduct._id,
        stock: Number(stock)
      });
      setMessage(response.data.message || 'Product added/updated successfully!');
      // Refresh seller's products after adding
      const res = await Axios.get('/api/seller/my-products', {
        params: { sellerId: user._id }
      });
      setMyProducts(res.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding product.');
    } finally {
      setLoading(false);
    }
  };

  // Update shop info handler
  const handleShopInfoSave = async () => {
    setShopInfoLoading(true);
    setShopInfoMsg("");
    try {
      const res = await Axios.put('/api/seller/profile', {
        sellerId: user._id,
        shopName,
        shopAddress
      });
      setShopInfoMsg("Shop info updated!");
    } catch (err) {
      setShopInfoMsg("Failed to update shop info.");
    } finally {
      setShopInfoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Seller Dashboard
          </h1>
          <p className="text-xl text-center text-emerald-100 max-w-2xl mx-auto">
            Manage your inventory and grow your business with our comprehensive seller tools
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Shop Info Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                </svg>
              </div>
              Shop Information
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  placeholder="Enter your shop name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Shop Address
                </label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={e => setShopAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  placeholder="Enter your shop address"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-8">
              <button
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleShopInfoSave}
                disabled={shopInfoLoading}
              >
                {shopInfoLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Shop Info'
                )}
              </button>
              
              {shopInfoMsg && (
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  shopInfoMsg.includes('Failed') 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {shopInfoMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Products Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              My Products ({myProducts.length})
            </h2>
          </div>
          
          <div className="p-8">
            {myProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">Loading your products...</span>
                </div>
              </div>
            ) : myProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
                <p className="text-gray-500">Start building your inventory by adding products below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myProducts.map((item) => (
                  <div key={item._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                        <img
                          src={item.productId?.image?.[0] || ''}
                          alt={item.productId?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                        {item.productId?.name}
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-emerald-700">
                          Stock: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Products Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              Add New Products
            </h2>
          </div>
          
          <div className="p-8">
            <div className="space-y-8">
              {categoryData?.map((cat) => (
                <CategoryWiseProductDisplay
                  key={cat._id + 'SellerCategorywiseProduct'}
                  id={cat._id}
                  name={cat.name}
                  renderProductAction={(product) => (
                    <button
                      className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      onClick={() => handleAddProduct(product)}
                    >
                      Add to Inventory
                    </button>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform scale-100 transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Add Stock</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={selectedProduct?.image?.[0] || ''}
                    alt={selectedProduct?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {selectedProduct?.name}
                  </h4>
                  <p className="text-gray-500">Set initial stock quantity</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-800"
                  placeholder="Enter stock quantity"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Product'
                  )}
                </button>
                <button
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
                  onClick={() => setModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
              
              {message && (
                <div className={`mt-4 p-3 rounded-lg font-medium text-center ${
                  message.includes('Error') 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPage;