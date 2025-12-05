import React from 'react';

const Subscription = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Manage Subscription</h2>
            <div className="card text-center py-10">
                <h3 className="text-xl font-medium text-gray-900">Current Plan: Free Tier</h3>
                <p className="text-gray-500 mt-2">Upgrade to Pro to access exclusive classes and diet plans.</p>
                <button className="mt-6 btn-primary">Upgrade Now (Stripe Integration)</button>
            </div>
        </div>
    );
};

export default Subscription;
