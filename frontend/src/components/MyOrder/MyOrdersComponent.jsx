import React, { useEffect, useState } from 'react';
import userOrderService from '../../services/order'; // adjust path
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MyOrderComponent = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: [],
        year: []
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await userOrderService.myOrders();
                if (res?.success) {
                    setOrders(res.data || []);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = (status) => {
        setFilters(prev => ({
            ...prev,
            status: prev.status.includes(status)
                ? prev.status.filter(s => s !== status)
                : [...prev.status, status]
        }));
    };

    const handleYearChange = (year) => {
        setFilters(prev => ({
            ...prev,
            year: prev.year.includes(year)
                ? prev.year.filter(y => y !== year)
                : [...prev.year, year]
        }));
    };

    const filteredOrders = orders.filter(order => {
        const orderYear = new Date(order.createdAt).getFullYear();
        const matchesStatus = filters.status.length === 0 || filters.status.includes(order.status);
        const matchesYear = filters.year.length === 0 || filters.year.includes(orderYear.toString());
        const matchesSearch = order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesYear && matchesSearch;
    });

    if (loading) return <div className="p-6 text-center">Loading your orders...</div>;

    return (
        <div className="flex p-6 bg-gray-100 min-h-screen gap-6">
            {/* Filters */}
            <div className="w-1/4 bg-white p-4 rounded shadow space-y-4">
                <h3 className="font-semibold text-lg mb-2">Filters</h3>
                <div>
                    <p className="font-medium mb-1">Order Status</p>
                    {['PLACED', 'DELIVERED', 'CANCELLED', 'RETURNED'].map(status => (
                        <div key={status}>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.status.includes(status)}
                                    onChange={() => handleStatusChange(status)}
                                    className="form-checkbox"
                                />
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </label>
                        </div>
                    ))}
                </div>
                <div>
                    <p className="font-medium mb-1">Order Time</p>
                    {['2025', '2024', '2023', '2022', '2021', 'Older'].map(year => (
                        <div key={year}>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.year.includes(year)}
                                    onChange={() => handleYearChange(year)}
                                    className="form-checkbox"
                                />
                                {year}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Orders */}
            <div className="flex-1 space-y-4">
                {/* Search bar */}
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Search your orders here"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
                    />
                    <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
                        Search Orders
                    </button>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 bg-white rounded shadow">
                        No More Results To Display
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order._id}
                            onClick={() => navigate(`/profile/order/${order._id}`)}

                            className="bg-white p-4 rounded shadow flex flex-row gap-4 items-center">
                            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded">
                                <img src={order.items[0]?.image} alt={order.items[0]?.name} className="max-h-full max-w-full" />
                            </div>
                            <div className="flex-1">
                                {/* <p className="text-sm bg-yellow-50 px-2 py-1 rounded inline-block mb-1">
                                    Lingraj Changti shared this order with you.
                                </p> */}
                                <p className="font-semibold">{order.items[0]?.name}</p>
                                <p className="text-gray-500 text-sm">Color: {order.items[0]?.color}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹{order.finalAmount}</p>
                                <p className={`flex items-center gap-2 text-sm mt-1`}>
                                    <span className={`h-3 w-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                    {order.status === 'DELIVERED' && `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}`}
                                    {order.status === 'CANCELLED' && `Cancelled on ${new Date(order.updatedAt).toLocaleDateString()}`}
                                    {order.status === 'PLACED' && `On the way`}
                                </p>
                                <p className="text-gray-500 text-xs">Your item has been {order.status === 'DELIVERED' ? 'delivered' : order.status === 'CANCELLED' ? 'cancelled' : 'shipped'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrderComponent;
