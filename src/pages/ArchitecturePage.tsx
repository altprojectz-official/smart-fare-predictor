import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Database,
  Brain,
  ArrowRight,
  Check,
  UserCircle,
  Filter,
  Sliders,
  LineChart,
} from "lucide-react";

const ArchitecturePage = () => {
  const steps = [
    {
      icon: UserCircle,
      title: "1. User Input",
      description: "User enters basic ride details like pickup, drop, and vehicle type.",
    },
    {
      icon: Filter,
      title: "2. Data Preprocessing",
      description: "Cleans location inputs and converts text into a usable format.",
    },
    {
      icon: Sliders,
      title: "3. Feature Engineering",
      description: "Calculates distance, time, traffic, and weather indicators.",
    },
    {
      icon: Brain,
      title: "4. ML Model",
      description: "Estimates base ride price using a Random Forest model.",
    },
    {
      icon: Cpu,
      title: "5. Prediction Engine",
      description: "Adjusts price with traffic, weather, and surge multipliers.",
    },
    {
      icon: LineChart,
      title: "6. Price Dashboard",
      description: "Displays suggested price, distance, and calculation breakdown.",
    },
  ];

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Cpu className="h-3.5 w-3.5 mr-2" />
              System Architecture
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold">System Architecture</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This page explains how the Smart Price Suggestion System works from start to finish.
              It shows how user inputs are processed step by step to generate a ride price, similar to how real ride-hailing apps work internally.
            </p>
          </div>

          {/* Architecture Flow */}
          <Card className="glass-card w-full overflow-hidden border-slate-200/60 shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>ML Pipeline Flow</CardTitle>
                  <CardDescription>
                    The system follows a simple pipeline where each step performs one clear task.
                  </CardDescription>
                </div>
                {/* Scroll Hint */}
                <div className="md:hidden text-xs text-muted-foreground flex items-center gap-1 animate-pulse bg-slate-100 px-3 py-1 rounded-full w-fit">
                  Scroll to view full pipeline <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div
                className="flex flex-row items-center gap-0 overflow-x-auto pb-8 pt-6 px-6 scroll-smooth w-full no-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-center flex-shrink-0 group">
                      {/* Step Card */}
                      <div className="flex flex-col items-center text-center w-[200px] flex-shrink-0 px-2 relative z-10 transition-transform duration-300 hover:-translate-y-1">
                        <div className="h-14 w-14 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg ring-4 ring-blue-100">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="font-semibold text-base mb-2 text-slate-800">{step.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed px-2 line-clamp-3">
                          {step.description}
                        </p>
                      </div>

                      {/* Connector Arrow */}
                      {index < steps.length - 1 && (
                        <div className="flex-shrink-0 flex items-center justify-center mx-2 text-slate-300">
                          <ArrowRight className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Step Details (Replaces old 'How It Works') */}
          <Card className="glass-card border-slate-200/60">
            <CardHeader>
              <CardTitle>Pipeline Step-by-Step</CardTitle>
              <CardDescription>Detailed breakdown of how the system processes your request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    User Input
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 ml-1">
                    <li>Pickup location</li>
                    <li>Drop location</li>
                    <li>Vehicle type (Bike or Taxi)</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">These inputs are the starting point for price estimation.</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    Data Preprocessing
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 ml-1">
                    <li>Cleaning location inputs</li>
                    <li>Converting text into a usable format</li>
                    <li>Ensuring values are valid and consistent</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">This step makes sure the system can work with the data correctly.</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                    Feature Engineering
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 ml-1">
                    <li>Distance between pickup and drop</li>
                    <li>Time-based information</li>
                    <li>Traffic and weather indicators</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">These values help the system understand the ride conditions better.</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                    ML Model
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 ml-1">
                    <li>The model is trained using past ride data</li>
                    <li>Learns patterns between distance, time, and pricing</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">Based on the inputs, the model predicts an initial fare.</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">5</span>
                    Prediction Engine
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 ml-1">
                    <li>Traffic level</li>
                    <li>Weather conditions</li>
                    <li>Surge or demand multiplier</li>
                    <li>Selected vehicle type</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">This step ensures the price feels realistic, just like real ride apps.</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">6</span>
                    Price Dashboard
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 ml-1">
                    <li>Suggested ride price</li>
                    <li>Travel distance</li>
                    <li>Weather and traffic status</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">This helps users clearly understand the suggested fare.</p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Input Features
                </CardTitle>
                <CardDescription>The system uses the following inputs to estimate the ride price</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Vehicle type (Bike / Taxi)",
                    "Distance between locations",
                    "Time of travel",
                    "Day type (weekday or weekend)",
                    "Traffic condition",
                    "Weather condition",
                    "Pickup and drop locations",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Model Details
                </CardTitle>
                <CardDescription>How the machine learning core functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Algorithm Used</span>
                    <Badge className="bg-blue-600 hover:bg-blue-700">Random Forest Regressor</Badge>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Purpose</span>
                    <span className="font-medium text-sm text-right max-w-[180px]">To estimate ride price based on multiple inputs</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Training Data</span>
                    <span className="font-medium text-sm">Historical ride information</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Validation</span>
                    <span className="font-medium text-sm">Cross-validated to improve accuracy</span>
                  </div>

                  <div className="pt-2 text-xs text-slate-500 italic text-center">
                    "The model helps simulate how pricing decisions are made in real-world systems."
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ArchitecturePage;
