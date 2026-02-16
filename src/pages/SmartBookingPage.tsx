import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Bike,
    Car,
    MapPin,
    Navigation,
    Loader2,
    Sparkles,
    Zap,
    Wind,
    Activity,
    IndianRupee,
    Cpu,
    Search
} from "lucide-react";
import RideStatusModal from "@/components/modals/RideStatusModal";
import { cn } from "@/lib/utils";

// Types for the Smart Predict Response
interface SmartPredictResponse {
    base_fare: number;
    final_fare: number;
    surge_multiplier: number;
    context: {
        distance_km: number;
        duration_min: number;
        weather: string;
        traffic: string;
        demand: string;
    };
    explanation: {
        traffic_impact: string;
        weather_impact: string;
        demand_impact: string;
    };
}

interface LocationSuggestion {
    display_name: string;
    lat: string;
    lon: string;
}

const SmartBookingPage = () => {
    // Inputs
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [rideType, setRideType] = useState<"bike" | "taxi">("taxi");

    // Coords State (Lat, Lon)
    const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
    const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);

    // Autocomplete State
    const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
    const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion[]>([]);
    const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
    const [showDropSuggestions, setShowDropSuggestions] = useState(false);

    // Flow State
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<SmartPredictResponse | null>(null);
    const [loadingStep, setLoadingStep] = useState("");

    // --- Autocomplete Logic ---
    const fetchSuggestions = async (query: string, setSuggestions: (data: LocationSuggestion[]) => void) => {
        if (query.length < 3) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error("Autocomplete failed", error);
        }
    };

    const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPickup(val);
        // Clear coords if user modifies text manually, to force re-selection or backend fallback
        setPickupCoords(null);

        if (val.length > 2) {
            fetchSuggestions(val, setPickupSuggestions);
            setShowPickupSuggestions(true);
        } else {
            setShowPickupSuggestions(false);
        }
    };

    const handleDropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDrop(val);
        setDropCoords(null);

        if (val.length > 2) {
            fetchSuggestions(val, setDropSuggestions);
            setShowDropSuggestions(true);
        } else {
            setShowDropSuggestions(false);
        }
    };

    const selectPickup = (place: LocationSuggestion) => {
        setPickup(place.display_name);
        setPickupCoords([parseFloat(place.lat), parseFloat(place.lon)]);
        setShowPickupSuggestions(false);
    };

    const selectDrop = (place: LocationSuggestion) => {
        setDrop(place.display_name);
        setDropCoords([parseFloat(place.lat), parseFloat(place.lon)]);
        setShowDropSuggestions(false);
    };

    // --- Main Prediction Logic ---
    const handlePredict = async () => {
        if (!pickup || !drop) {
            toast.error("Please enter both pickup and drop locations");
            return;
        }

        setLoading(true);
        setPrediction(null);

        // Simulation Steps for UI Experience
        const steps = [
            "Fetching real coordinates & routes...",
            "Calculating distance on live map...",
            "Checking local weather...",
            "Analyzing traffic conditions...",
            "Generating final price..."
        ];

        let stepIdx = 0;
        setLoadingStep(steps[0]);

        // Start animation loop
        const stepInterval = setInterval(() => {
            stepIdx++;
            if (stepIdx < steps.length) {
                setLoadingStep(steps[stepIdx]);
            }
        }, 800);

        try {
            // Include coords if available
            const payload = {
                pickup: pickup,
                drop: drop,
                ride_type: rideType,
                pickup_coords: pickupCoords, // [lat, lon] or null
                drop_coords: dropCoords      // [lat, lon] or null
            };

            const response = await fetch("/api/smart-predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Prediction failed");
            }

            const data: SmartPredictResponse = await response.json();

            // Ensure we show at least a bit of the loading state for UX, but don't block indefinitely
            // If the API was super fast, wait a tiny bit to show "Generating..."
            // If it was slow, show immediately.
            clearInterval(stepInterval);
            setLoadingStep("Finalizing...");

            setTimeout(() => {
                setPrediction(data);
                setLoading(false);
            }, 600);

        } catch (error) {
            clearInterval(stepInterval);
            setLoading(false);
            console.error(error);
            toast.error("Failed to suggest price. Please try simpler location names or check network.");
        }
    };

    const [showRideModal, setShowRideModal] = useState(false);

    return (
        <MainLayout>
            <RideStatusModal isOpen={showRideModal} onClose={() => setShowRideModal(false)} />

            <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50">
                <div className="container py-8 max-w-6xl">

                    {/* Header Section */}
                    <div className="mb-8 space-y-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-3 py-1">
                            <Sparkles className="h-3.5 w-3.5" />
                            Smart AI Mode
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Smart Price Estimator
                        </h1>
                        <p className="text-slate-600 max-w-3xl text-lg">
                            A smart price suggestion system that demonstrates how ride apps estimate fares in the backend using real maps and weather data.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT PANEL: Inputs */}
                        <div className="lg:col-span-5 space-y-6">
                            <Card className="border-slate-200 shadow-sm bg-white">
                                <CardHeader className="bg-slate-50/50 border-b pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-md">
                                            <Car className="h-5 w-5 text-blue-600" />
                                        </div>
                                        Ride Details
                                    </CardTitle>
                                    <CardDescription>
                                        Enter any city, area, or landmark to get started.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-6">

                                    {/* Pickup Input */}
                                    <div className="space-y-2 relative">
                                        <Label>Pickup Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="e.g. Gandhipuram, Coimbatore"
                                                className="pl-9"
                                                value={pickup}
                                                onChange={handlePickupChange}
                                                // Small delay to allow click on suggestion
                                                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                                            />
                                        </div>
                                        {/* Suggestions Dropdown */}
                                        {showPickupSuggestions && pickupSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                                                {pickupSuggestions.map((s, i) => (
                                                    <div
                                                        key={i}
                                                        className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer flex items-center gap-2 border-b last:border-0"
                                                        onClick={() => selectPickup(s)}
                                                    >
                                                        <Search className="h-3 w-3 text-slate-400 shrink-0" />
                                                        <span className="truncate">{s.display_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Drop Input */}
                                    <div className="space-y-2 relative">
                                        <Label>Drop Location</Label>
                                        <div className="relative">
                                            <Navigation className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="e.g. Valparai"
                                                className="pl-9"
                                                value={drop}
                                                onChange={handleDropChange}
                                                onBlur={() => setTimeout(() => setShowDropSuggestions(false), 200)}
                                            />
                                        </div>
                                        {/* Suggestions Dropdown */}
                                        {showDropSuggestions && dropSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                                                {dropSuggestions.map((s, i) => (
                                                    <div
                                                        key={i}
                                                        className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer flex items-center gap-2 border-b last:border-0"
                                                        onClick={() => selectDrop(s)}
                                                    >
                                                        <Search className="h-3 w-3 text-slate-400 shrink-0" />
                                                        <span className="truncate">{s.display_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Vehicle Selector */}
                                    <div className="space-y-2">
                                        <Label>Vehicle Preference</Label>
                                        <Tabs value={rideType} onValueChange={(v) => setRideType(v as "bike" | "taxi")} className="w-full">
                                            <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100">
                                                <TabsTrigger value="taxi" className="h-10">Taxi</TabsTrigger>
                                                <TabsTrigger value="bike" className="h-10">Bike</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={handlePredict}
                                            disabled={loading || !pickup || !drop}
                                            className="w-full btn-primary h-12 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : "Get Price Suggestion"}
                                        </button>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT PANEL: Results & Brain */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Loading State */}
                            {loading && (
                                <div className="h-full flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full border-4 border-blue-100 animate-pulse" />
                                        <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                                        <Cpu className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-medium text-slate-800 animate-pulse">
                                        {loadingStep}
                                    </h3>
                                    <p className="text-slate-500 text-sm max-w-xs text-center">
                                        Connecting to global positioning satellites and weather stations...
                                    </p>
                                </div>
                            )}

                            {/* Idle State */}
                            {!loading && !prediction && (
                                <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400">
                                    <Navigation className="h-16 w-16 mb-4 opacity-20" />
                                    <p className="font-medium">Enter locations to start prediction</p>
                                    <p className="text-sm mt-1 max-w-xs text-center opacity-70">
                                        Try searching for "Ukkadam" to "Valparai" or any real route.
                                    </p>
                                </div>
                            )}

                            {/* Results State */}
                            {!loading && prediction && (
                                <div className="animate-in slide-in-from-bottom-4 duration-700 space-y-6">

                                    {/* Main Price Card */}
                                    <Card className="border-blue-100 shadow-md bg-white overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                                            <p className="opacity-90 font-medium mb-1 tracking-wide uppercase text-xs">Suggested Ride Fare</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <IndianRupee className="h-8 w-8" />
                                                <span className="text-5xl font-bold tracking-tight">{prediction.final_fare}</span>
                                            </div>
                                            <p className="text-sm opacity-80 mt-2">
                                                Based on {prediction.context.distance_km} km real-world distance
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">Weather</p>
                                                <div className="flex items-center justify-center gap-2 mt-1 text-slate-800 font-medium">
                                                    <Wind className="h-4 w-4 text-blue-500" />
                                                    {prediction.context.weather}
                                                </div>
                                            </div>
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">Traffic</p>
                                                <div className="flex items-center justify-center gap-2 mt-1 text-slate-800 font-medium">
                                                    <Activity className="h-4 w-4 text-amber-500" />
                                                    {prediction.context.traffic}
                                                </div>
                                            </div>
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">Surge</p>
                                                <div className="flex items-center justify-center gap-2 mt-1 text-slate-800 font-medium">
                                                    <Zap className="h-4 w-4 text-purple-500" />
                                                    {prediction.surge_multiplier}x
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-6">
                                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-blue-600" />
                                                How was this calculated?
                                            </h4>
                                            <ul className="space-y-3 text-sm text-slate-600">
                                                <li className="flex gap-2 items-start">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                    <span>
                                                        <span className="font-medium text-slate-900">Real Map Data:</span> We calculated the exact road distance of {prediction.context.distance_km} km between the selected points using OSRM.
                                                    </span>
                                                </li>
                                                <li className="flex gap-2 items-start">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                    <span>
                                                        <span className="font-medium text-slate-900">Live Conditions:</span> {prediction.explanation.weather_impact} and {prediction.explanation.traffic_impact} were detected and factored into the price.
                                                    </span>
                                                </li>
                                                <li className="flex gap-2 items-start">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                    <span>
                                                        <span className="font-medium text-slate-900">Base Rate:</span> Standard {rideType === 'bike' ? 'Bike' : 'Taxi'} pricing model applied.
                                                    </span>
                                                </li>
                                            </ul>

                                            <button
                                                className="w-full btn-secondary mt-6 border-slate-200"
                                                onClick={() => setShowRideModal(true)}
                                            >
                                                Confirm & Book Mock Ride
                                            </button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SmartBookingPage;
