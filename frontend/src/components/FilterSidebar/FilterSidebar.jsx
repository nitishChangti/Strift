import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilters, toggleBooleanFilter } from '../../store/productSlice'; // adjust path

function FilterSidebar() {
    const dispatch = useDispatch();

    const selectedFilters = useSelector((state) => state.product.selectedFilters || {});

    const FILTERS = {
        gender: ['Men', 'Women'],
        size: ['S', 'M', 'L', 'XL'],
        color: ['Red', 'Black', 'White', 'Blue'],
        fabric: ['Cotton', 'Polyester', 'Linen'],
        pattern: ['Solid', 'Striped', 'Printed'],
        occasion: ['Casual', 'Party', 'Formal'],
        sleeveType: ['Half Sleeve', 'Full Sleeve', 'Sleeveless'],
        fit: ['Regular', 'Slim', 'Loose'],
        packOf: ['1', '2', '3+'],
        type: ['tshirt', 'Shirt', 'Hoodie'],
    };

    const handleCheckboxChange = (filterType, value) => {
        console.log(filterType, value)
        dispatch(updateFilters({ filterType, value }));
    };

    return (
        <aside className="w-64 p-4 border-r overflow-y-auto max-h-screen">
            <h2 className="font-bold text-lg mb-4">Filters</h2>

            {Object.keys(FILTERS).map((filterKey) => (
                <div key={filterKey} className="mb-4">
                    <h3 className="font-semibold capitalize">{filterKey}</h3>
                    {FILTERS[filterKey].map((value) => {
                        // Access array from selectedFilters; default to empty array if undefined
                        const selectedValues = selectedFilters[filterKey] || [];

                        // Use Array.includes() to check if value is selected
                        const isChecked = selectedValues.includes(value);

                        return (
                            <label key={value} className="block text-sm cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChange(filterKey, value)}
                                />
                                {value}
                            </label>
                        );
                    })}
                </div>
            ))}

            <div className="mt-6">
                <h3 className="font-semibold">Special</h3>
                <label className="block text-sm cursor-pointer select-none">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedFilters?.isNewArrival || false}
                        onChange={() => dispatch(toggleBooleanFilter('isNewArrival'))}
                    />
                    New Arrivals
                </label>
            </div>
        </aside>
    );
}

export default FilterSidebar;
