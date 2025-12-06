import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });

    useEffect(() => {
        fetchPaymentData();
    }, []);

    const fetchPaymentData = async () => {
        setLoading(true);
        try {
            // Fetch payments list
            const paymentsResponse = await adminService.getPayments({ limit: 50 }); // Get last 50
            setPayments(paymentsResponse.payments);
            setStats({
                totalRevenue: paymentsResponse.payments.reduce((acc, p) => p.status === 'paid' ? acc + p.amount : acc, 0),
                totalTransactions: paymentsResponse.total
            });

            // Fetch revenue chart data (last 6 months)
            const today = new Date();
            const sixMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 6));
            const revenueResponse = await adminService.getRevenueReport(sixMonthsAgo.toISOString(), today.toISOString());
            setRevenueData(revenueResponse.revenue || []);

        } catch (error) {
            console.error("Failed to fetch payment data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async (id) => {
        const reason = prompt("Enter refund reason:");
        if (!reason) return;

        try {
            await adminService.refundPayment(id, reason);
            alert("Refund processed successfully");
            fetchPaymentData(); // Refresh
        } catch (error) {
            alert("Refund failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleMarkPaid = async (id) => {
        if (!confirm("Mark this payment as manually paid?")) return;
        try {
            await adminService.markPaymentPaid(id, { paymentMethod: 'manual', description: 'Admin marked as paid' });
            fetchPaymentData();
        } catch (error) {
            alert("Failed to update payment: " + (error.response?.data?.message || error.message));
        }
    };

    // Chart Config
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Revenue' },
        },
    };

    const chartData = {
        labels: revenueData.map(d => d._id),
        datasets: [
            {
                label: 'Revenue (PKR)',
                data: revenueData.map(d => d.revenue),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Payments & Subscriptions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    {loading ? <p>Loading chart...</p> : <Line options={chartOptions} data={chartData} />}
                </div>

                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 font-medium">Total Revenue (Visible)</p>
                        <p className="text-4xl font-bold text-green-600">PKR {stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Transactions</p>
                        <p className="text-4xl font-bold text-gray-900">{stats.totalTransactions}</p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <button onClick={fetchPaymentData} className="text-primary-600 hover:text-primary-800 text-sm font-medium">Refresh</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{payment.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{payment.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PKR {payment.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {payment.status === 'paid' && (
                                            <button onClick={() => handleRefund(payment._id)} className="text-red-600 hover:text-red-900 ml-4">Refund</button>
                                        )}
                                        {payment.status === 'pending' && (
                                            <button onClick={() => handleMarkPaid(payment._id)} className="text-green-600 hover:text-green-900 ml-4">Mark Paid</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {payments.length === 0 && <p className="p-8 text-center text-gray-500">No transactions found.</p>}
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
