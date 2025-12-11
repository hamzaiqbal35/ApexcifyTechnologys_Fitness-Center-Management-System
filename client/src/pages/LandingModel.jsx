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
            <main className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-200/30 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-6 min-h-[800px]">

                    {/* Block 1: Main Content (Large, Dark, Call to Action) */}
                    <div className="md:col-span-2 md:row-span-2 bg-gray-900 rounded-[2rem] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-gray-200/50">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-primary-200 mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                Now offering Online Coaching
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6 tracking-tight">
                                Redefine <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-200 to-white">Your Limits.</span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                                Experience fitness reimagine with world-class trainers and state-of-the-art facilities. Your journey to greatness starts here.
                            </p>
                        </div>

                        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4">
                            {user ? (
                                <Link to="/dashboard" className="btn-primary w-full py-4 text-center justify-center text-lg rounded-xl shadow-lg shadow-primary-500/25 border border-primary-400 hover:scale-[1.02] active:scale-95 transition-all">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn-primary w-full py-4 text-center justify-center text-lg rounded-xl shadow-lg shadow-primary-500/25 border border-primary-400 hover:scale-[1.02] active:scale-95 transition-all">
                                        Join Now
                                    </Link>
                                    <Link to="/login" className="px-6 py-4 rounded-xl bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 text-center backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-95">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Block 2: Tall Visual (Right Side) */}
                    <div className="md:col-span-1 md:row-span-2 relative rounded-[2rem] overflow-hidden group shadow-xl shadow-gray-200/50">
                        <img
                            src={hero1}
                            alt="Athlete"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <span className="text-primary-400 font-bold tracking-wider text-xs uppercase mb-2">Strength</span>
                            <h3 className="text-white text-2xl font-display font-bold leading-tight">Forged in Iron</h3>
                        </div>
                    </div>

                    {/* Block 3: Stats (Top Right) */}
                    <div className="md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-center items-center text-center group hover:border-primary-100 transition-colors relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="relative z-10">
                            <div className="text-5xl font-display font-bold text-gray-900 mb-2 tracking-tighter">5k+</div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Happy Members</p>
                        </div>
                    </div>

                    {/* Block 4: Feature (Middle Right) */}
                    <div className="md:col-span-1 md:row-span-1 bg-primary-600 rounded-[2rem] p-8 flex flex-col justify-between text-white relative overflow-hidden group shadow-xl shadow-primary-500/30">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 transition-transform duration-500 group-hover:scale-150 blur-2xl"></div>
                        <div className="flex justify-between items-start z-10">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">24/7</span>
                        </div>
                        <div className="z-10">
                            <p className="text-3xl font-display font-bold mb-1">Open</p>
                            <p className="text-primary-100 text-sm">Access Anytime</p>
                        </div>
                    </div>

                    {/* Block 5: Bottom Visual 1 (Bottom Left) */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-[2rem] overflow-hidden group shadow-lg">
                        <img
                            src={hero2}
                            alt="Yoga"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute bottom-6 left-6">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white font-medium text-sm">
                                Yoga & Mind
                            </div>
                        </div>
                    </div>

                    {/* Block 6: Bottom Visual 2 (Bottom Middle) */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-[2rem] overflow-hidden group shadow-lg">
                        <img
                            src={hero3}
                            alt="Cardio"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute bottom-6 left-6">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white font-medium text-sm">
                                HIIT & Cardio
                            </div>
                        </div>
                    </div>

                    {/* Block 7: Community/Extra (Bottom Right Wide) */}
                    <div className="md:col-span-2 md:row-span-1 bg-white rounded-[2rem] p-8 border border-gray-100 flex items-center justify-between relative overflow-hidden group shadow-xl shadow-gray-200/50 hover:border-primary-200 transition-all">
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                        <div className="relative z-10 max-w-sm">
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">Join the Community</h3>
                            <p className="text-gray-500 text-sm">Be part of a movement that celebrates every milestone.</p>
                        </div>
                        <div className="relative z-10 flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Member" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-4 border-white bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600 shadow-sm">
                                +2k
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
