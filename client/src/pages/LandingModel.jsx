import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingNavbar from '../components/LandingNavbar';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

import api from '../services/api';

const LandingPage = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, plansRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/subscription-plans')
                ]);
                // Filter only unique class names
                const uniqueClasses = [];
                const seenNames = new Set();
                classesRes.data.forEach(cls => {
                    if (!seenNames.has(cls.name)) {
                        seenNames.add(cls.name);
                        uniqueClasses.push(cls);
                    }
                });
                setClasses(uniqueClasses);
                setPlans(plansRes.data);
            } catch (error) {
                console.error("Failed to fetch landing data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            {/* Navbar */}
            <LandingNavbar />

            {/* Bento Grid Hero Section */}
            <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen flex flex-col justify-center">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-4 h-full min-h-[800px] md:min-h-[600px]">

                    {/* Block 1: Main Content (Large, Dark) */}
                    <div className="md:col-span-2 md:row-span-3 bg-gray-900 rounded-3xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white mb-6 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
                                New Classes Available
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                                Transform Your Body, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">Transform Your Life</span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-md">
                                Expert trainers, personalized plans, and a community that drives you forward. Join the revolution today.
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4">
                            {user ? (
                                <Link to="/dashboard" className="btn-primary w-full sm:w-auto justify-center text-center py-4 text-lg shadow-lg shadow-primary-500/30">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn-primary w-full sm:w-auto justify-center text-center py-4 text-lg shadow-lg shadow-primary-500/30">
                                        Start Journey
                                    </Link>
                                    <a href="#features" className="px-6 py-4 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all border border-white/10 text-center w-full sm:w-auto backdrop-blur-sm">
                                        Explore Features
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Block 2: Hero Image 1 (Vertical on right top) */}
                    <div className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden group">
                        <img
                            src={hero1}
                            alt="Training Session"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <p className="text-white font-bold text-lg">High Intensity</p>
                        </div>
                    </div>

                    {/* Block 3: Stats Block (Small) */}
                    <div className="md:col-span-1 md:row-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-primary-200 transition-colors">
                        <div className="text-4xl font-display font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">500+</div>
                        <p className="text-sm text-gray-500 font-medium">Active Members</p>
                    </div>

                    {/* Block 4: Feature Block (Small) */}
                    <div className="md:col-span-1 md:row-span-1 bg-primary-600 rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
                        <svg className="w-8 h-8 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                            <p className="text-2xl font-bold">15+</p>
                            <p className="text-primary-100 text-sm">Expert Trainers</p>
                        </div>
                    </div>

                    {/* Block 5: Hero Image 2 (Small Square) */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group">
                        <img
                            src={hero2}
                            alt="Yoga Class"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <div>
                                <h3 className="text-white text-lg font-bold mb-1">Muscle Building</h3>
                                <p className="text-gray-200 text-xs">Push Limits</p>
                            </div>
                        </div>
                    </div>

                    {/* Block 6: Hero Image 3 (Small Square) */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group">
                        <img
                            src={hero3}
                            alt="Meditation"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <div>
                                <h3 className="text-white text-lg font-bold mb-1">Yoga & Cardio</h3>
                                <p className="text-gray-200 text-xs">Find Balance</p>
                            </div>
                        </div>
                    </div>
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

            {/* Classes Section */}
            <div id="classes" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Our Courses</h2>
                        <p className="mt-2 text-3xl font-display font-bold text-gray-900 sm:text-4xl">Find Your Perfect Course</p>
                        <p className="mt-4 text-xl text-gray-500">Join our expert-led classes designed for all fitness levels.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center text-gray-500">Loading classes...</div>
                        ) : classes.length > 0 ? (
                            classes.slice(0, 6).map((cls) => (
                                <div key={cls._id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                {cls.intensity || 'All Levels'}
                                            </div>
                                            <span className="text-sm text-gray-500">{cls.duration} min</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{cls.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cls.description}</p>

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            <span className="truncate">Trainer: {cls.trainerId?.name || 'Expert Trainer'}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                            <span className="text-sm font-medium text-gray-900">
                                                {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {user ? (
                                                <Link to="/dashboard/classes" className="text-primary-600 font-medium text-sm hover:text-primary-700">Book Now →</Link>
                                            ) : (
                                                <Link to="/login" className="text-primary-600 font-medium text-sm hover:text-primary-700">Login to Book →</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">No classes scheduled at the moment.</div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link to={user ? "/dashboard/classes" : "/login"} className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            View Full Schedule
                        </Link>
                    </div>
                </div>
            </div>

            {/* Prices Section */}
            <div id="prices" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Membership Plans</h2>
                        <p className="mt-2 text-3xl font-display font-bold text-gray-900 sm:text-4xl">Choose Your Plan</p>
                        <p className="mt-4 text-xl text-gray-500">Flexible options to fit your lifestyle and goals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {loading ? (
                            <div className="col-span-full text-center text-gray-500">Loading plans...</div>
                        ) : plans.length > 0 ? (
                            plans.map((plan) => (
                                <div key={plan._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative flex flex-col">
                                    {plan.isPopular && (
                                        <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                            POPULAR
                                        </div>
                                    )}
                                    <div className="p-8 flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline mb-6">
                                            <span className="text-4xl font-extrabold text-gray-900">Rs. {plan.price}</span>
                                            <span className="ml-2 text-gray-500">/{plan.interval}</span>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm">{plan.description}</p>

                                        <ul className="space-y-4 mb-8">
                                            {plan.features?.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-8 bg-gray-50 border-t border-gray-100">
                                        {user ? (
                                            <Link
                                                to="/dashboard/subscription"
                                                className="block w-full text-center btn-primary py-3 rounded-xl shadow-lg shadow-primary-500/20"
                                            >
                                                Choose {plan.name}
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/signup"
                                                className="block w-full text-center btn-primary py-3 rounded-xl shadow-lg shadow-primary-500/20"
                                            >
                                                Get Started
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">No plans available at the moment.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:order-1 md:mt-0 flex flex-col md:flex-row items-center gap-4">
                        <Link to="/contact" className="text-sm text-gray-500 hover:text-primary-600">Contact Us</Link>
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; 2025 FitTrack, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
