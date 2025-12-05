import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

const LandingPage = () => {
    const { user } = useAuth();
    const images = [hero1, hero2, hero3];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-display font-bold text-2xl text-white">FitTrack</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-200 hover:text-white font-medium transition-colors">Features</a>
                            <a href="#classes" className="text-gray-200 hover:text-white font-medium transition-colors">Classes</a>
                            <a href="#pricing" className="text-gray-200 hover:text-white font-medium transition-colors">Pricing</a>
                        </div>
                        <div className="flex space-x-4">
                            {user ? (
                                <Link to="/dashboard" className="btn-primary border-none shadow-lg">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-2 text-white font-medium hover:bg-white/10 rounded-lg transition-colors">
                                        Log in
                                    </Link>
                                    <Link to="/signup" className="btn-primary border-none shadow-lg">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Slider */}
            <main className="relative flex-grow h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Image Slider Background */}
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Fitness Hero ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                    </div>
                ))}

                {/* Hero Content */}
                <div className="relative z-10 mx-auto max-w-2xl text-center px-4">
                    <h1 className="text-4xl font-display font-bold tracking-tight text-white sm:text-6xl animate-slide-up drop-shadow-md">
                        Transform Your Body,<br />
                        <span className="text-primary-400">Transform Your Life</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-200 animate-slide-up animation-delay-200 drop-shadow-sm">
                        Join FitTrack today and get access to expert trainers, personalized workout plans, and a community that supports your fitness journey.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
                        {user ? (
                            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto text-center transform hover:scale-105 transition-transform duration-200">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/signup" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto text-center transform hover:scale-105 transition-transform duration-200">
                                Start Your Journey
                            </Link>
                        )}
                        <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-primary-300 transition-colors">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>

                {/* Slider Indicators - Moved outside content wrapper to be relative to screen bottom */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImage ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </main>

            {/* Features Section */}
            <div id="features" className="py-24 sm:py-32 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary-600">Deploy faster</h2>
                        <p className="mt-2 text-3xl font-display font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to stay fit
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Comprehensive tools to manage your health, workouts, and schedule in one place.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            {/* Feature 1 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0h18M5 10.5h14" />
                                        </svg>
                                    </div>
                                    Class Scheduling
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Easy online booking for all your favorite fitness classes. Never miss a session.
                                </dd>
                            </div>
                            {/* Feature 2 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    Smart Plans
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Personalized workout and diet plans created by expert trainers just for you.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; 2024 FitTrack, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
