import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { bookingService } from '../services/classService.js';

const QRModal = ({ booking, onClose }) => {
    const [tokenData, setTokenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        generateToken();
    }, [booking._id]);

    useEffect(() => {
        if (!tokenData?.expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date();
            const expires = new Date(tokenData.expiresAt);
            const diff = Math.floor((expires - now) / 1000);

            if (diff <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [tokenData]);

    const generateToken = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingService.generateQR(booking._id);
            setTokenData(data);
            // Calculate initial time immediately to avoid flicker
            if (data.expiresAt) {
                const diff = Math.floor((new Date(data.expiresAt) - new Date()) / 1000);
                setTimeLeft(diff > 0 ? diff : 0);
            }
        } catch (error) {
            console.error("Failed to generate QR", error);
            setError("Failed to generate QR Code");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Check In</h3>
                    <p className="text-sm text-gray-500 mb-6">{booking.classId?.name || 'Class'}</p>

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-2 rounded text-sm">
                            {error}
                            <button onClick={generateToken} className="ml-2 underline font-bold">Retry</button>
                        </div>
                    )}

                    <div className="flex justify-center mb-6">
                        {loading ? (
                            <div className="h-64 w-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : timeLeft > 0 ? (
                            <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-100">
                                <QRCodeSVG
                                    value={JSON.stringify({
                                        b: booking._id,
                                        t: tokenData?.token
                                    })}
                                    size={200}
                                    level="H"
                                />
                            </div>
                        ) : (
                            <div className="h-64 w-64 flex flex-col items-center justify-center bg-red-50 rounded-lg text-red-600">
                                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>QR Expired or Invalid</p>
                                <button onClick={generateToken} className="mt-2 text-sm underline font-medium">Regenerate</button>
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-6">
                        {timeLeft > 0 && (
                            <p className="text-sm font-medium text-primary-600">
                                Expires in: <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Scan at the gym reception</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full btn-secondary"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRModal;
