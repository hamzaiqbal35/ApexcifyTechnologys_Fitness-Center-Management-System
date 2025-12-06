import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

const LandingPage = () => {
    const { user } = useAuth();



    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navbar */}
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 transition-all duration-300">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">F</div>
                            <span className="font-display font-bold text-2xl text-gray-900 tracking-tight">FitTrack</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8">
                            {['Features', 'Classes', 'Pricing'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative group py-2"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="btn-primary shadow-lg shadow-primary-500/20 px-6 py-2.5 rounded-full text-base"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-600 font-medium hover:text-gray-900 transition-colors px-4 py-2"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="btn-primary shadow-lg shadow-primary-500/20 px-6 py-2.5 rounded-full text-base transition-transform hover:scale-105"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

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
