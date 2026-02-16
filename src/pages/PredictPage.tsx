import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bike,
  Car,
  MapPin,
  Clock,
  CloudSun,
  TrendingUp,
  Calculator,
  IndianRupee,
  Zap,
  Activity,
} from "lucide-react";

interface PredictionResult {
  fare: number;
  surgeMultiplier: number;
  demandStatus: "Low" | "Medium" | "High";
}

const PredictPage = () => {
  const [rideType, setRideType] = useState<string>("");
  const [distance, setDistance] = useState<number[]>([5]);
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [dayType, setDayType] = useState<string>("");
  const [demandLevel, setDemandLevel] = useState<string>("");
  const [trafficCondition, setTrafficCondition] = useState<string>("");
  const [weatherCondition, setWeatherCondition] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);

    try {
      // Helper to capitalize first letter
      const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

      // Helper to title case (for pickup zone)
      const toTitleCase = (str: string) => {
        return str.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      };

      // Mappings to match ML model expected values
      const mapTraffic = (t: string) => {
        if (t === "low") return "Light";
        return capitalize(t);
      };

      const mapWeather = (w: string) => {
        if (w === "foggy") return "Cloudy"; // Map foggy to nearest equivalent
        return capitalize(w);
      };

      const mapRide = (r: string) => (r === "bike" ? "Bike" : "Taxi");

      const payload = {
        ride_type: mapRide(rideType),
        distance: distance[0],
        time_of_day: capitalize(timeOfDay),
        day_type: capitalize(dayType),
        demand_level: capitalize(demandLevel),
        traffic_condition: mapTraffic(trafficCondition),
        weather_condition: mapWeather(weatherCondition),
        pickup_zone: toTitleCase(pickupLocation),
      };

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();

      const demandStatus: "Low" | "Medium" | "High" =
        demandLevel === "high" ? "High" :
          demandLevel === "medium" ? "Medium" : "Low";

      setPrediction({
        fare: data.final_fare,
        surgeMultiplier: data.surge_multiplier,
        demandStatus,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      // In a real app we would show a toast/alert here
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = rideType && timeOfDay && dayType && demandLevel && trafficCondition && weatherCondition && pickupLocation;

  const getSurgeBadgeClass = (status: string) => {
    switch (status) {
      case "Low": return "surge-badge-low";
      case "Medium": return "surge-badge-medium";
      case "High": return "surge-badge-high";
      default: return "";
    }
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Calculator className="h-3.5 w-3.5 mr-2" />
              Smart Pricing Prediction
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold">Smart Pricing Prediction (Manual Mode)</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter ride details to generate a precise fare estimate using our trained Random Forest machine learning model.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input Form */}
            <Card className="lg:col-span-3 academic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ride Details
                </CardTitle>
                <CardDescription>
                  Fill in all the fields to get accurate fare prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ride Type */}
                <div className="space-y-2">
                  <Label>Ride Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["bike", "taxi"].map((type) => (
                      <div
                        key={type}
                        className={`
                            cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 transition-all
                            ${rideType === type
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}
                          `}
                        onClick={() => setRideType(type)}
                      >
                        {type === "bike" ? <Bike className="h-6 w-6" /> : <Car className="h-6 w-6" />}
                        <span className="capitalize font-medium">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Distance</Label>
                    <span className="text-sm font-medium text-primary">{distance[0]} km</span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    max={50}
                    min={1}
                    step={0.5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>

                {/* Dropdowns Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Time of Day */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time of Day
                    </Label>
                    <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                        <SelectItem value="night">Night (9PM - 6AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Day Type */}
                  <div className="space-y-2">
                    <Label>Day Type</Label>
                    <Select value={dayType} onValueChange={setDayType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekday">Weekday</SelectItem>
                        <SelectItem value="weekend">Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Demand Level */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Demand Level
                    </Label>
                    <Select value={demandLevel} onValueChange={setDemandLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select demand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Traffic Condition */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Traffic Condition
                    </Label>
                    <Select value={trafficCondition} onValueChange={setTrafficCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select traffic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weather Condition */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CloudSun className="h-4 w-4" />
                      Weather Condition
                    </Label>
                    <Select value={weatherCondition} onValueChange={setWeatherCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weather" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clear">Clear</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="foggy">Foggy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pickup Location */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Pickup Location
                    </Label>
                    <Input
                      placeholder="Enter zone/area name"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Predict Button */}
                <button
                  className="btn-primary w-full flex items-center justify-center gap-2 h-12 text-lg"
                  onClick={handlePredict}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5" />
                      Predict Fare
                    </>
                  )}
                </button>
              </CardContent>
            </Card>

            {/* Prediction Result */}
            <div className="lg:col-span-2 space-y-4">
              <Card className={`academic-card transition-all duration-500 ${prediction ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    Prediction Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {prediction ? (
                    <div className="space-y-6 animate-scale-in">
                      {/* Main Fare */}
                      <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-sm text-muted-foreground mb-2">Predicted Fare</p>
                        <div className="flex items-center justify-center gap-1">
                          <IndianRupee className="h-10 w-10 text-primary" />
                          <span className="text-5xl font-bold text-primary">{prediction.fare}</span>
                        </div>
                      </div>

                      {/* Surge & Demand */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Zap className="h-4 w-4 text-warning" />
                            <p className="text-xs text-muted-foreground">Surge</p>
                          </div>
                          <p className="text-2xl font-bold">{prediction.surgeMultiplier}x</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Demand</p>
                          <Badge className={`text-sm ${getSurgeBadgeClass(prediction.demandStatus)}`}>
                            {prediction.demandStatus}
                          </Badge>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-center text-muted-foreground">
                        Fare dynamically adjusted based on demand, time, and traffic using Random Forest ML model.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Fill in the form and click predict to see the estimated fare</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Model Info */}
              <Card className="academic-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">ML Model</p>
                      <p className="font-medium">Random Forest Regressor</p>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      92% Accuracy
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PredictPage;
