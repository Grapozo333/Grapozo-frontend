import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Carrot, Beef, Milk, Package, ChevronDown, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';

export default function GroceryHero() {
  const addressList = useSelector(state => state.addresses.addressList);
  const { fetchAddress } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const componentRef = useRef(null);

  // Banner images array - you can easily modify this
  const bannerImages = [
    {
      src: "/images/banner_image.jpg",
      title: "Fresh Vegetables",
      subtitle: "50% Off Today"
    },
    // {
    //   src: "/images/banner-2.jpg", 
    //   title: "Premium Meats",
    //   subtitle: "Best Quality Guaranteed"
    // },
    // {
    //   src: "/images/banner-3.jpg",
    //   title: "Dairy Products",
    //   subtitle: "Farm Fresh Daily"
    // },
    // {
    //   src: "/images/banner-4.jpg",
    //   title: "Special Offers",
    //   subtitle: "Limited Time Only"
    // }
  ];

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        await fetchAddress();
      } catch (error) {
        console.error('Error fetching user address:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAddress();
  }, [fetchAddress]);

  // Auto-rotate banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % bannerImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Set the first address as selected by default when addresses are loaded
  useEffect(() => {
    if (addressList && addressList.length > 0 && !selectedAddress) {
      setSelectedAddress(addressList[0]);
    }
  }, [addressList, selectedAddress]);

  const handleShopNow = () => {
    if (componentRef.current) {
      const componentRect = componentRef.current.getBoundingClientRect();
      const componentBottom = componentRect.bottom + window.scrollY;
      
      window.scrollTo({
        top: componentBottom,
        behavior: 'smooth'
      });
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressPopup(false);
  };

  const handleAddNewAddress = () => {
    window.location.href = '/dashboard/address';
  };

  const toggleAddressPopup = () => {
    setShowAddressPopup(!showAddressPopup);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % bannerImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  console.log(addressList);

  return (
    <div ref={componentRef} className="bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden w-full overflow-x-hidden
      h-96 sm:h-120 lg:h-180">
      {/* Background decorative elements - hidden on small screens */}
      <div className="hidden lg:block absolute top-10 right-20 w-32 h-32 bg-green-300 rounded-full opacity-20"></div>
      <div className="hidden lg:block absolute bottom-20 left-10 w-24 h-24 bg-green-400 rounded-full opacity-20"></div>
      <div className="hidden lg:block absolute top-1/2 right-1/3 w-16 h-16 bg-green-200 rounded-full opacity-15"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-0 relative z-10 h-full">
        {/* Mobile Layout - Show only banner */}
        <div className="block lg:hidden h-full">
          <div className="flex flex-col h-full">
            {/* Top navigation - Mobile */}
            <div className="p-4 z-20">
              <div className="flex justify-between items-center">
                <div className="relative flex-1">
                  {/* Clickable Address Section */}
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors duration-200"
                    onClick={toggleAddressPopup}
                  >
                    <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-bold text-gray-800 text-sm">Delivery to:</span>
                      {isLoading ? (
                        <span className="text-gray-600 text-xs">Loading...</span>
                      ) : selectedAddress ? (
                        <span className="text-gray-600 text-xs truncate">
                          {selectedAddress.address_line}, {selectedAddress.city}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">No address set</span>
                      )}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${showAddressPopup ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Address Popup Menu - Mobile */}
                  {showAddressPopup && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-30">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Select Delivery Address</h3>
                        
                        {/* Address List */}
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {addressList && addressList.length > 0 ? (
                            addressList.map((address, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded-lg border cursor-pointer transition-colors duration-200 ${
                                  selectedAddress && selectedAddress.id === address.id
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                }`}
                                onClick={() => handleAddressSelect(address)}
                              >
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-800 truncate">
                                      {address.address_line}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                      {address.city}, {address.state} - {address.postal_code}
                                    </p>
                                    {address.address_type && (
                                      <span className="inline-block mt-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                        {address.address_type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No addresses found
                            </div>
                          )}
                        </div>

                        {/* Add New Address Button */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={handleAddNewAddress}
                            className="cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                          >
                            <Plus className="h-3 w-3" />
                            Add New Address
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-semibold text-xs ml-2">
                  Special Offer
                </div>
              </div>
            </div>

            {/* Main Banner - Mobile */}
            <div className="flex-1 px-4 pb-4">
              <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden group">
                {/* Banner Images */}
                <div className="relative w-full h-full">
                  {bannerImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback gradient if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback gradient background */}
                      <div 
                        className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 items-center justify-center text-white font-bold text-xl"
                        style={{ display: 'none' }}
                      >
                        {image.title}
                      </div>
                      
                      {/* Overlay content */}
                      <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center p-6">
                        <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                          {image.title}
                        </h3>
                        <p className="text-white text-lg sm:text-xl opacity-90 mb-6">
                          {image.subtitle}
                        </p>
                        
                        {/* Mobile Action Button */}
                        <button 
                          onClick={handleShopNow}
                          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Arrows - Mobile */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Dot Indicators - Mobile */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {bannerImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Original grid layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-center h-full">
          {/* Left Content - Image Banner */}
          <div className="space-y-8">
            {/* Dynamic Image Banner */}
            <div className="relative w-9/10 h-80 bg-white rounded-2xl shadow-xl overflow-hidden group z-20">
              {/* Banner Images */}
              <div className="relative w-full h-full ">
                {bannerImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback gradient if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback gradient background */}
                    <div 
                      className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 items-center justify-center text-white font-bold text-2xl"
                      style={{ display: 'none' }}
                    >
                      {image.title}
                    </div>
                    
                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-orange-100/30 flex flex-col justify-end p-6">
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {image.title}
                      </h3>
                      <p className="text-white text-lg opacity-90">
                        {image.subtitle}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {bannerImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleShopNow}
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Shop Now
              </button>
              <button className="cursor-pointer text-green-600 hover:text-green-700 px-8 py-4 font-semibold text-lg transition-colors duration-300">
                Learn More
              </button>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
                <Carrot className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Fresh Vegetables</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
                <Beef className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Raw Meats</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
                <Milk className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Milk & Dairies</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
                <Package className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Canned & Frozen Food</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            {/* Background decoration for image area */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-green-200 rounded-full transform rotate-12 scale-110 opacity-30"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-40"></div>
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-green-400 rounded-full opacity-40"></div>
            
            {/* Hero Image */}
            <div className="relative z-10 p-8 min-h-[500px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <img src="/images/Hero-image-1.png" alt="Hero" />
              </div>
            </div>
          </div>
        </div>

        {/* Top navigation - Desktop only */}
        <div className="hidden lg:block absolute top-0 left-0 right-0 p-2 z-20">
          <div className="flex justify-between items-center">
            <div className="relative">
              {/* Clickable Address Section */}
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors duration-200"
                onClick={toggleAddressPopup}
              >
                <MapPin className="h-5 w-5 text-gray-600" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">Delivery to:</span>
                  {isLoading ? (
                    <span className="text-gray-600">Loading...</span>
                  ) : selectedAddress ? (
                    <span className="text-gray-600">
                      {selectedAddress.address_line}, {selectedAddress.city}, {selectedAddress.state}
                    </span>
                  ) : (
                    <span className="text-gray-600">No address set</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${showAddressPopup ? 'rotate-180' : ''}`} />
              </div>

              {/* Address Popup Menu */}
              {showAddressPopup && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-30">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Select Delivery Address</h3>
                    
                    {/* Address List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {addressList && addressList.length > 0 ? (
                        addressList.map((address, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                              selectedAddress && selectedAddress.id === address.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {address.address_line}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {address.city}, {address.state} - {address.postal_code}
                                </p>
                                {address.address_type && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    {address.address_type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No addresses found
                        </div>
                      )}
                    </div>

                    {/* Add New Address Button */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={handleAddNewAddress}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                        Add New Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold">
              Special Offer
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close popup when clicking outside */}
      {showAddressPopup && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setShowAddressPopup(false)}
        />
      )}
    </div>
  );
}