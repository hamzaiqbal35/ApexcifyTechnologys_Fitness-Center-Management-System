import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../../services/subscriptionService';
import { useAuth } from '../../../contexts/AuthContext';

const PlanCard = ({ plan, onSubscribe, isCurrent }) => (
    <div className={`card relative flex flex-col ${isCurrent ? 'ring-2 ring-primary-500 border-transparent' : ''}`}>
        {isCurrent && (
            <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                Current Plan
            </span>
        )}
        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">Rs. {plan.price}</span>
                <span className="ml-1 text-gray-500">/{plan.interval}</span>
            </div>
            <p className="mt-4 text-gray-500 text-sm">{plan.description}</p>
        </div>

        <ul className="space-y-3 mb-6 flex-1">
            {plan.features?.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-sm text-gray-700">{feature}</span>
                </li>
            ))}
        </ul>

        <button
            onClick={() => onSubscribe(plan._id)}
            disabled={isCurrent}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isCurrent
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                }`}
        >
            {isCurrent ? 'Active' : 'Subscribe Now'}
        </button>
    </div>
);

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Import trainingPlanService dynamically if needed, or assume it's available. 
            // Better to import it at top. Adding it to imports in next step if missed.
            const [plansData, subsData, workoutPlansData] = await Promise.all([
                subscriptionService.getPlans(),
                subscriptionService.getMySubscriptions(),
                import('../../../services/trainingPlanService').then(m => m.trainingPlanService.getWorkoutPlans())
            ]);

            setPlans(plansData);
            setWorkoutPlans(workoutPlansData);

            // Find active subscription
            const active = subsData.find(s => ['active', 'trialing'].includes(s.status));
            setCurrentSubscription(active);

        } catch (error) {
            console.error("Failed to load plans", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        alert('Redirecting to payment...');
        try {
            console.log('Subscribe to plan:', planId);
        } catch (error) {
            alert('Failed to start subscription flow');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading plans...</div>;

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Membership Plans Section */}
            <section>
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Flexible Plans for Your Fitness Journey</h2>
                    <p className="mt-4 text-lg text-gray-500">Choose a membership plan that fits your schedule and goals.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            isCurrent={currentSubscription?.planId?._id === plan._id}
                            onSubscribe={handleSubscribe}
                        />
                    ))}
                </div>
            </section>

            {/* Workout Plans Section */}
            <section className="border-t pt-10">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Specialized Workout Plans</h2>
                    <p className="mt-4 text-gray-500">Expert-designed plans by our top trainers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workoutPlans.map((plan) => (
                        <div key={plan._id} className="card hover:shadow-lg transition-all transform hover:-translate-y-1 bg-white border border-gray-100 p-6 rounded-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{plan.title}</h3>
                                    <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full mt-2 inline-block">
                                        {plan.difficultyLevel || 'General'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-gray-900">
                                        {plan.price > 0 ? `PKR ${plan.price}` : 'Free'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mt-3 line-clamp-2">{plan.description}</p>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs text-gray-400">By {plan.trainerId?.name || 'Trainer'}</span>
                                {plan.price > 0 ? (
                                    <button
                                        className="btn-primary text-sm px-4 py-2"
                                        onClick={() => alert(`Purchase functionality for ${plan.title} coming soon!`)}
                                    >
                                        Buy Now
                                    </button>
                                ) : (
                                    <a
                                        href={plan.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-800 text-sm font-medium hover:underline flex items-center"
                                    >
                                        Download PDF
                                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    {workoutPlans.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-400 bg-gray-50 rounded-lg">
                            No specialized workout plans available at the moment.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Plans;
