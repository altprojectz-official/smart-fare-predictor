import React, { useEffect, useState } from 'react';

import { Brain, Network, Cpu, Smartphone, Mail, GraduationCap } from 'lucide-react';

const WelcomeOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const closeOverlay = () => {
        setIsVisible(false);
        // Remove from DOM after fade out animation completes
        setTimeout(() => {
            setShouldRender(false);
        }, 700);
    };

    useEffect(() => {
        setShouldRender(true);
        // Small delay to ensure clean mounting before fading in
        setTimeout(() => setIsVisible(true), 100);

        // Total duration: 5-8 seconds as requested
        const timer = setTimeout(() => {
            closeOverlay();
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            onClick={closeOverlay}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-700 ease-in-out cursor-pointer ${isVisible ? 'opacity-100 bg-slate-900/60' : 'opacity-0 bg-slate-900/0'
                }`}
        >
            {/* Main Card */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-lg shadow-xl border border-slate-200 p-10 max-w-5xl w-full flex flex-col md:flex-row overflow-hidden transition-all duration-700 transform cursor-default ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >

                {/* Left Column: Text */}
                <div className="w-full md:w-3/5 flex flex-col justify-center space-y-6 pr-0 md:pr-8">

                    {/* Badge */}
                    <div>
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            Developed By <span className="text-black">I. Mohamed Arshath</span>
                        </span>
                    </div>

                    {/* Main Heading with Typewriter */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                            <span className="text-gradient-blue">
                                Machine Learning–Based
                            </span>{" "}
                            <span className="text-black">Smart Pricing Prediction System</span>
                        </h1>
                        <p className="text-slate-600 text-lg">
                            An academic machine learning project demonstrating intelligent pricing prediction using real-world data.
                        </p>
                    </div>

                    {/* Developer Info */}
                    <div className="pt-4 border-l-4 border-blue-600 pl-4">
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-1">Developed By</p>
                        <h2 className="text-2xl font-bold text-gray-800">
                            I. Mohamed Arshath
                            <div className="h-1 w-24 bg-blue-600 mt-2 rounded-full"></div>
                        </h2>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pt-2">
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span>B.Sc Artificial Intelligence & Machine Learning</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 flex items-center justify-center font-bold text-blue-500 text-xs border border-blue-500 rounded-full">2</div>
                            <span>2nd Year</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">2428C0428</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span>mohamedarshath344@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Smartphone className="w-4 h-4 text-blue-500" />
                            <span>7695994918</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Illustration */}
                <div className="w-full md:w-2/5 relative min-h-[300px] flex items-center justify-center mt-8 md:mt-0">

                    {/* Abstract Orbit Animation */}
                    {/* Illustration Image */}
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                        <img
                            src="/Overlay.svg"
                            alt="AI Ride Prediction"
                            className="w-full h-auto max-w-[300px] object-contain animate-pulse-slow"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WelcomeOverlay;
