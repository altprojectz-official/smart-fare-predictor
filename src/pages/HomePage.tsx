import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bike,
  TrendingUp,
  Cpu,
  ArrowRight,
  Brain,
  CloudSun,
  Activity
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

const HomePage = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Machine Learning–Based Price Suggestion",
    },
    {
      icon: TrendingUp,
      title: "Dynamic Pricing Logic Simulation",
    },
    {
      icon: CloudSun,
      title: "Context-Aware Price Suggestions",
    },
    {
      icon: Bike,
      title: "Support for Bike and Taxi Ride Modes",
    }
  ];

  const workflowSteps = [
    "User selects pickup location, drop location, and ride type",
    "System calculates travel distance",
    "Time, traffic, and weather context are evaluated",
    "Machine learning model processes the inputs",
    "Suggested ride price is displayed to the user"
  ];

  const technologies = [
    "Machine Learning",
    "Regression Models",
    "Python Backend",
    "REST APIs",
    "React Frontend"
  ];

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-transparent">
        <div className="absolute inset-0 bg-transparent" />

        <div className="container relative py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8 animate-slide-up flex flex-col items-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Cpu className="h-3.5 w-3.5 mr-2" />
                Developed By - <span className="text-black">I. Mohamed Arshath</span>
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  <span className="text-black">Smart Price Suggestion System</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                  A machine learning–based system that suggests ride prices dynamically using real-time contextual inputs.
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Inspired by real-world bike and taxi ride pricing platforms.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/predict">
                  <button className="btn-primary flex items-center gap-2 group text-lg px-8 py-3">
                    Try Price Suggestion
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link to="/architecture">
                  <button className="btn-secondary text-lg px-8 py-3">
                    Explore System Architecture
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SYSTEM OVERVIEW SECTION */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Smart Price Suggestion Overview</h2>
          <div className="h-1 w-20 bg-slate-200 mx-auto rounded-full" />
          <p className="text-lg text-slate-600 leading-relaxed">
            The Smart Price Suggestion System simulates how modern ride platforms generate price suggestions for bike and taxi rides.
            The system analyzes travel distance, time of travel, traffic conditions, and environmental context to suggest an appropriate ride price using machine learning logic.
          </p>
        </div>
      </section>

      {/* 3. INDUSTRY-INSPIRED PRICING WORKFLOW */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Pricing Workflow Inspired by Ride Platforms</h2>
          <div className="h-1 w-20 bg-slate-200 mx-auto rounded-full" />
          <p className="text-lg text-slate-600 leading-relaxed">
            Popular ride platforms dynamically suggest prices instead of using fixed fare values.
            This project demonstrates a similar backend workflow where multiple ride-related inputs are processed and a suggested price is generated using a trained machine learning model.
          </p>
        </div>
      </section>

      {/* 4. HOW THE SYSTEM SUGGESTS PRICES */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How Price Suggestion Works</h2>
            <div className="h-1 w-20 bg-slate-200 mx-auto rounded-full" />
          </div>

          <div className="grid gap-8 md:grid-cols-5 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-white p-4 relative z-10">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center mb-4 text-lg font-bold shadow-sm">
                  {index + 1}
                </div>
                <p className="text-slate-700 font-medium text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. KEY SYSTEM CAPABILITIES */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1">
              <Activity className="h-3.5 w-3.5 mr-2" />
              Key Capabilities
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <Card
                  key={index}
                  className="academic-card hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="pt-6 text-center">
                    <div className="h-12 w-12 mx-auto rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-800">{cap.title}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGIES USED */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Technologies Used in the System</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="px-5 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              A smart pricing system implementation
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Demonstrates how ride price suggestions are generated using machine learning, inspired by real-world ride platforms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/predict">
              <button className="btn-primary flex items-center gap-2 group text-lg px-8 py-3">
                Try Price Suggestion
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/architecture">
              <button className="btn-secondary text-lg px-8 py-3">
                View Pricing Workflow
              </button>
            </Link>
            <Link to="/architecture">
              <button className="btn-secondary text-lg px-8 py-3">
                Explore System Architecture
              </button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
