import React from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../provider/UIProvider';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumbs = () => {
    const { breadcrumbs } = useUI();

    if (breadcrumbs.length === 0) {
        return null;
    }

    return (
        <nav className="">
            <div className="container mx-auto px-4 py-4">
                <ol className="flex items-center space-x-1 text-sm">
                    {/* Home icon for first breadcrumb if it's not already a home link */}
                    {breadcrumbs[0]?.name?.toLowerCase() !== 'home' && (
                        <>
                            <li className="flex items-center">
                                <Link 
                                    to="/" 
                                    className="flex items-center px-2 py-1 rounded-md text-gray-500 hover:text-emerald-600 hover:bg-white/60 transition-all duration-200 group"
                                    aria-label="Home"
                                >
                                    <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                </Link>
                            </li>
                            <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                        </>
                    )}
                    
                    {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <FaChevronRight className="w-3 h-3 text-gray-400 mx-2" />
                            )}
                            
                            {crumb.link ? (
                                <Link 
                                    to={crumb.link} 
                                    className="px-3 py-1.5 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-white/60 transition-all duration-200 font-medium hover:shadow-sm"
                                >
                                    {crumb.name}
                                </Link>
                            ) : (
                                <span className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-md font-semibold text-gray-800 shadow-sm border border-gray-200/50">
                                    {crumb.name}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
                
                {/* Optional: Add a subtle divider line */}
                <div className="mt-3 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
            </div>
        </nav>
    );
};

export default Breadcrumbs;