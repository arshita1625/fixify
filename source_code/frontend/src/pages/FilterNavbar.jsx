import React, { useState, useEffect } from 'react';

const services_offered = [
    "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning",
    "HVAC Repair", "Gardening", "Pest Control", "Roofing", "Masonry",
    "Appliance Repair", "Flooring", "Locksmith", "Window Cleaning",
    "Handyman", "Drywall Repair", "Tile Work", "Furniture Assembly",
    "Pressure Washing", "Pool Maintenance"
]

const FilterNavbar = ({ onFilter, onSort }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setActiveDropdown(activeDropdown === menu ? null : menu);
    };

    const handleSort = (category, order) => {
        onSort(category, order);
        setActiveDropdown(null);  // Close the dropdown after selection
    };

    const handleFilter = (skills) => {
        onFilter(skills);
        setActiveDropdown(null);  // Close the dropdown after selection
    };

    const handleCloseDropdown = () => {
        setActiveDropdown(null);
    }
    useEffect(() => {
        // Close dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                handleCloseDropdown();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Add option clear all filters and sorting
    const handleClearAll = () => {
        onFilter(null); // Reset filters
        onSort(null, null); // Reset sorting
        setActiveDropdown(null); // Close all dropdowns
    }

    return (
        <div className="navbar2">
            {/* Rating Dropdown */}
            {/* Services Dropdown */}
            <div className="dropdown">
                <button className="nav-btn" onClick={() => toggleDropdown('skills')}>
                    Skills ▼
                </button>
                {/* Dropdown scrollable list for skills */}
                {activeDropdown === 'skills' && (
                    <div className="dropdown-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {services_offered.map((skill) => (
                            <button key={skill} onClick={() => handleFilter(skill)}>
                                {skill}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="dropdown">
                <button className="nav-btn" onClick={() => toggleDropdown('rating')}>
                    Rating ▼
                </button>
                {activeDropdown === 'rating' && (
                    <div className="dropdown-list">
                        <button onClick={() => handleSort('rating', 'asc')}>Low to High</button>
                        <button onClick={() => handleSort('rating', 'desc')}>High to Low</button>
                    </div>
                )}
            </div>

            {/* Price Dropdown */}
            <div className="dropdown">
                <button className="nav-btn" onClick={() => toggleDropdown('price')}>
                    Price ▼
                </button>
                {activeDropdown === 'price' && (
                    <div className="dropdown-list">
                        <button onClick={() => handleSort('price', 'asc')}>Low to High</button>
                        <button onClick={() => handleSort('price', 'desc')}>High to Low</button>
                    </div>
                )}
            </div>

            {/* Show button to reset all filters*/}
            <div className="dropdown">
                <button className="nav-btn" onClick={handleClearAll}>
                    x Filters
                </button>
            </div>
        </div>
    );
};
export default FilterNavbar;