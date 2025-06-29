import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Calendar, Percent, DollarSign } from 'lucide-react';
import Axios from '../utils/Axios';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: ''
  });

  const [errors, setErrors] = useState({});

  // Real API calls
  const api = {
    createCoupon: async (data) => {
      const res = await Axios.post('/api/coupon/create', data);
      return res.data;
    },
    getCoupons: async (page = 1) => {
      const res = await Axios.get('/api/coupon');
      return {
        coupons: res.data.coupons || [],
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
        total: res.data.total || 0
      };
    },
    updateCoupon: async (id, data) => {
      const res = await Axios.put(`/api/coupon/${id}`, data);
      return res.data;
    },
    deleteCoupon: async (id) => {
      const res = await Axios.delete(`/api/coupon/${id}`);
      return res.data;
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.getCoupons(currentPage);
      setCoupons(response.coupons);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) newErrors.code = 'Coupon code is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.discountValue) newErrors.discountValue = 'Discount value is required';
    if (formData.minimumAmount === '') newErrors.minimumAmount = 'Minimum amount is required';
    if (!formData.validFrom) newErrors.validFrom = 'Valid from date is required';
    if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required';

    if (formData.discountType === 'percentage') {
      if (formData.discountValue > 100 || formData.discountValue <= 0) {
        newErrors.discountValue = 'Percentage must be between 1-100';
      }
    }

    if (formData.validFrom && formData.validUntil) {
      if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
        newErrors.validUntil = 'Valid until must be after valid from date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare data with correct types
      const data = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minimumAmount: Number(formData.minimumAmount),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      };

      if (editingCoupon) {
        await api.updateCoupon(editingCoupon._id, data);
      } else {
        await api.createCoupon(data);
      }

      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while saving the coupon.');
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minimumAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: ''
    });
    setErrors({});
    setShowCreateForm(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minimumAmount: coupon.minimumAmount.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0]
    });
    setEditingCoupon(coupon);
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.deleteCoupon(id);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred while deleting the coupon.');
        }
      }
    }
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search coupons by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code*
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., SAVE20"
                  />
                  {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type*
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of the coupon"
                    rows="2"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value* {formData.discountType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.discountValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.discountType === 'percentage' ? '20' : '10'}
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  />
                  {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount* ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumAmount}
                    onChange={(e) => setFormData({ ...formData, minimumAmount: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.minimumAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.minimumAmount && <p className="text-red-500 text-sm mt-1">{errors.minimumAmount}</p>}
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount ($)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty for no limit"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From*
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.validFrom ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.validFrom && <p className="text-red-500 text-sm mt-1">{errors.validFrom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until*
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.validUntil ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.validUntil && <p className="text-red-500 text-sm mt-1">{errors.validUntil}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coupons List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Coupons ({filteredCoupons.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading coupons...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No coupons found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            {coupon.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">{coupon.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {coupon.discountType === 'percentage' ? (
                            <>
                              <Percent className="w-4 h-4 mr-1 text-green-600" />
                              {coupon.discountValue}%
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                              {coupon.discountValue}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${coupon.minimumAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(coupon.validUntil)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          coupon.isActive && new Date(coupon.validUntil) > new Date()
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive && new Date(coupon.validUntil) > new Date() ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;