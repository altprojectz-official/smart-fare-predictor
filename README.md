# Smart Price Suggestion System

## Project Overview

The **Smart Price Suggestion System** is a machine learning–based mini project that simulates how modern ride-hailing platforms (like Uber or Ola) estimate fares dynamically. It processes inputs such as **distance, time of day, traffic conditions, and weather** to generate a realistic price suggestion using a trained **Random Forest Regressor** model.

## Key Features

-   **Smart Booking Mode**: Simulates a real-world booking experience with live route calculation (OSRM) and weather context.
-   **Manual Prediction Mode**: Allows users to manually input ride parameters to test the ML model's logic.
-   **Analytics Dashboard**: Visualizes pricing trends, demand distribution, and system activity.
-   **System Architecture**: Explains the step-by-step flow from user input to price generation.

## Technology Stack

### Frontend
-   **React** (Vite) for the user interface
-   **TypeScript** for type safety
-   **Tailwind CSS** for styling and responsiveness
-   **Recharts** for data visualization

### Backend
-   **Python (FastAPI)** for the REST API
-   **Scikit-Learn** for the Machine Learning model
-   **Pandas & NumPy** for data processing
-   **SQLite** for storing prediction history locally

## Installation & Setup

### 1. Backend Setup (API & ML Model)

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the backend server:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API will be running at `http://localhost:8000`.

### 2. Frontend Setup (User Interface)

Open a new terminal and navigate to the project root:
```bash
cd smart-fare-predictor-main
```
*(If you are in the backend folder, type `cd ..` first)*

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open your browser and visit: `http://localhost:5173`

## Project Workflow

1.  **User enters pickup/drop locations.**
2.  **System calculates route distance** using Open Source Routing Machine (OSRM).
3.  **Contextual factors** (Traffic, Weather, Time) are fetched or simulated.
4.  **ML Model predicts base fare** based on historical data patterns.
5.  **Surge Pricing Logic** adjusts the final fare based on demand.
6.  **Results are displayed** to the user and logged in the dashboard.

## Author

**I. Mohamed Arshath**
B.Sc Artificial Intelligence & Machine Learning
