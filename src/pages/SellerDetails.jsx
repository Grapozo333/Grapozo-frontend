import React, { useEffect, useState } from 'react';
import { Store, Package, MapPin, Mail, User, Filter, Eye, X } from 'lucide-react';

import Axios from '../utils/Axios';


const FilterModal = ({
    tempFilters,
    setTempFilters,
    handleApplyFilters,
    handleClearFilters,
    setShowFilterModal
  }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowFilterModal(false);
        }
      }}
    >
      <div 
        className="bg-white rounded-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Filter Sellers</h3>
            <button
              onClick={() => setShowFilterModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-2">
              Name (Seller/Shop Name)
            </label>
            <input
              id="filter-name"
              type="text"
              value={tempFilters.name}
              onChange={(e) => {
                setTempFilters(prev => ({ ...prev, name: e.target.value }));
              }}
              placeholder="Enter seller or shop name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              autoComplete="off"
            />
          </div>
  
          <div>
            <label htmlFor="filter-address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              id="filter-address"
              type="text"
              value={tempFilters.address}
              onChange={(e) => {
                setTempFilters(prev => ({ ...prev, address: e.target.value }));
              }}
              placeholder="Enter shop address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              autoComplete="off"
            />
          </div>
  
          <div>
            <label htmlFor="filter-product" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="filter-product"
              type="text"
              value={tempFilters.productName}
              onChange={(e) => {
                setTempFilters(prev => ({ ...prev, productName: e.target.value }));
              }}
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              autoComplete="off"
            />
          </div>
  
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  

const SellerDetails = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    productName: ''
  });
  const [tempFilters, setTempFilters] = useState({
    name: '',
    address: '',
    productName: ''
  });

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all sellers (users with role SELLER)
        const userRes = await Axios.get('/api/user/all-sellers');
        const users = userRes.data.data || [];
        
        // Fetch all seller profiles
        const profileRes = await Axios.get('/api/seller/all-profiles');
        const profiles = profileRes.data.data || [];
        
        // Merge user and profile info
        const merged = await Promise.all(users.map(async user => {
          const profile = profiles.find(p => p.sellerId === user._id || p.sellerId?._id === user._id);
          
          // Fetch products for this seller
          let products = [];
          try {
            const prodRes = await Axios.get('/api/seller/products-admin', { 
              params: { sellerId: user._id } 
            });
            products = (prodRes.data.data || []).map(item => ({
              product: item.productId,
              stock: item.stock
            }));
          } catch (prodErr) {
            console.warn(`Failed to fetch products for seller ${user._id}:`, prodErr);
          }
          
          return {
            ...user,
            shopName: profile?.shopName || '',
            shopAddress: profile?.shopAddress || '',
            products
          };
        }));
        
        setSellers(merged);
      } catch (err) {
        console.error('Error fetching sellers:', err);
        setError('Failed to fetch sellers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const filteredSellers = sellers.filter(seller => {
    // If all filters are empty, show all sellers (default behavior)
    if (!filters.name && !filters.address && !filters.productName) {
      return true;
    }

    const nameMatch = !filters.name || 
      seller.name.toLowerCase().includes(filters.name.toLowerCase()) ||
      seller.shopName.toLowerCase().includes(filters.name.toLowerCase());
    
    const addressMatch = !filters.address || 
      seller.shopAddress.toLowerCase().includes(filters.address.toLowerCase());
    
    const productMatch = !filters.productName || 
      seller.products?.some(product => 
        product.product?.name?.toLowerCase().includes(filters.productName.toLowerCase())
      );
    
    return nameMatch && addressMatch && productMatch;
  });

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = { name: '', address: '', productName: '' };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setShowFilterModal(false);
  };

  const openFilterModal = () => {
    setTempFilters(filters);
    setShowFilterModal(true);
  };

  const hasActiveFilters = filters.name || filters.address || filters.productName;

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SellerCard = ({ seller }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Mail className="w-4 h-4" />
                <span>{seller.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedSeller(seller)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <Store className="w-4 h-4 text-green-500" />
            <span className="font-medium">{seller.shopName || 'No shop name'}</span>
          </div>
          
          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{seller.shopAddress || 'No address provided'}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {seller.products?.length || 0} Products
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Total Stock: {seller.products?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

//   const FilterModal = () => (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           setShowFilterModal(false);
//         }
//       }}
//     >
//       <div 
//         className="bg-white rounded-xl max-w-md w-full"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xl font-semibold text-gray-900">Filter Sellers</h3>
//             <button
//               onClick={() => setShowFilterModal(false)}
//               className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
//               type="button"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
        
//         <div className="p-6 space-y-4">
//           <div>
//             <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-2">
//               Name (Seller/Shop Name)
//             </label>
//             <input
//               id="filter-name"
//               type="text"
//               value={tempFilters.name}
//               onChange={(e) => {
//                 setTempFilters(prev => ({ ...prev, name: e.target.value }));
//               }}
//               placeholder="Enter seller or shop name"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
//               autoComplete="off"
//             />
//           </div>

//           <div>
//             <label htmlFor="filter-address" className="block text-sm font-medium text-gray-700 mb-2">
//               Address
//             </label>
//             <input
//               id="filter-address"
//               type="text"
//               value={tempFilters.address}
//               onChange={(e) => {
//                 setTempFilters(prev => ({ ...prev, address: e.target.value }));
//               }}
//               placeholder="Enter shop address"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
//               autoComplete="off"
//             />
//           </div>

//           <div>
//             <label htmlFor="filter-product" className="block text-sm font-medium text-gray-700 mb-2">
//               Product Name
//             </label>
//             <input
//               id="filter-product"
//               type="text"
//               value={tempFilters.productName}
//               onChange={(e) => {
//                 setTempFilters(prev => ({ ...prev, productName: e.target.value }));
//               }}
//               placeholder="Enter product name"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
//               autoComplete="off"
//             />
//           </div>

//           <div className="flex space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={handleClearFilters}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Clear All
//             </button>
//             <button
//               type="button"
//               onClick={handleApplyFilters}
//               className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

  const ProductModal = ({ seller, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{seller.name}'s Products</h3>
              <p className="text-gray-500">{seller.shopName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          {seller.products && seller.products.length > 0 ? (
            <div className="space-y-3">
              {seller.products.map((sp, idx) => (
                <div key={sp.product?._id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">{sp.product?.name || 'N/A'}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">{sp.stock} units</div>
                    <div className="text-xs text-gray-500">in stock</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Seller Management
          </h1>
          <p className="text-gray-600 text-lg">Manage and monitor all registered sellers</p>
        </div>

        {/* Filter and Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={openFilterModal}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  hasActiveFilters 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {filters.name && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Name: {filters.name}
                    </span>
                  )}
                  {filters.address && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Address: {filters.address}
                    </span>
                  )}
                  {filters.productName && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Product: {filters.productName}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredSellers.length}</div>
                <div className="text-sm text-gray-500">Filtered Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredSellers.reduce((sum, s) => sum + (s.products?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
            <p className="text-gray-500">
              {hasActiveFilters ? 'No sellers match your current filters. Try adjusting your filter criteria.' : 'No sellers have been registered yet.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map(seller => (
              <SellerCard key={seller._id || seller.sellerId} seller={seller} />
            ))}
          </div>
        )}

        {/* Filter Modal */}
        {/* {showFilterModal && <FilterModal />} */}

        {showFilterModal && (
  <FilterModal
    tempFilters={tempFilters}
    setTempFilters={setTempFilters}
    handleApplyFilters={handleApplyFilters}
    handleClearFilters={handleClearFilters}
    setShowFilterModal={setShowFilterModal}
  />
)}


        {/* Product Modal */}
        {selectedSeller && (
          <ProductModal 
            seller={selectedSeller} 
            onClose={() => setSelectedSeller(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default SellerDetails;