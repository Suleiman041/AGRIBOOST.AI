# AgriBoost AI - Intelligent Farming Assistant for Nigeria

## 🌍 Overview
AgriBoost AI is a cutting-edge, mobile-first web application designed to empower Nigerian farmers with real-time agricultural intelligence. By bridging the gap between advanced technology and local farming needs, AgriBoost provides precision farming tools, market data, and expert diagnostics in native languages (Hausa, Yoruba, Igbo, and English).

It is built as a Progressive Web App (PWA) capable of running on low-end devices, with a focus on accessibility and offline-ready features.

---

## 🚀 Key Features

### 1. 🗣️ Multi-Language Support available on the "sidebar"
- **Native Localization**: The entire interface and AI responses instantly translate between **English**, **Hausa**, **Yoruba**, and **Igbo**.
- **Context-Aware AI**: The AI Advisor and automated news feeds generate content specifically in the user's selected language.

### 2. 🔐 Secure Farmer Identity
- **Supabase Authentication**: Secure email/password login system.
- **Cloud Profiles**: User preferences (language, name, subscription status) are synced to the cloud, allowing farmers to switch devices without losing data.

### 3. 🛰️ Precision GPS & Satellite Mapping
- **Real-Time Geolocation**: Automatically detects the farmer's exact latitude and longitude.
- **Satellite View**: Integrates Google Maps Satellite imagery to show the specific farm plot.
- **Reverse Geocoding**: Automatically identifies the verified city and region to calibrate weather and soil data.

### 4. 🌿 AI Crop Doctor (Computer Vision)
- **Instant Diagnosis**: Farmers can take a photo of a sick plant.
- **Llama 3.2 Vision Integration**: The app analyzes the image to identify pests, diseases (e.g., Early Blight, Armyworm), or nutrient deficiencies.
- **Actionable Advice**: Provides immediate, chemical and organic remedies in the local language.

### 5. 🌦️ Hyper-Local Weather & News
- **Live Weather**: Real-time temperature, humidity, and condition reports based on GPS coordinates (via Open-Meteo).
- **Agri-Intelligence News**: Generates dynamic, location-specific agricultural alerts (e.g., "Heavy rain expected in Kaduna, pause fertilizer application") using GenAI.

### 6. 📈 Real-Time Market Intelligence
- **Commodity Ticker**: Live tracking of prices for crops like Maize, Rice, Yam, Sorgum, and Cocoa.
- **Trend Analysis**: Visual indicators (Up/Down/Steady) to help farmers decide when to sell.
- **Filter & Search**: Powerful filtering by region (Lagos, Kano, Benue, etc.) and crop type.

### 7. 🤖 AI Farming Advisor
- **Chat Interface**: A WhatsApp-like chat experience where farmers can ask incomplete or complex questions.
- **Contextual Awareness**: The AI knows the farmer's location and weather context to give specific advice (e.g., "When should I plant maize _here_?").
- **Rich Formatting**: Responses are formatted with bolding and lists for easy reading on small mobile screens.

### 8. 📱 Offline USSD Capability (Simulation)
- **Bridge for Feature Phones**: Demonstrates how the AI technology works for farmers without smartphones via `*347*88#`.
- **Interactive Simulator**: A fully functional Nokia-style phone interface in the browser to test USSD menu flows for users without internet.

---

## 📱 Application Pages

### **1. Authentication (Login/Signup)**
- A premium, glassmorphism-styled entry point.
- Features a dynamic agricultural background.
- Handles user registration and secure session management.

### **2. Dashboard (Home)**
- The command center. Shows a "Good Morning" greeting, current weather summary, crop health status quick-glance, and the live news ticker.

### **3. Farm Location**
- Dedicated mapping interface.
- Allows manual coordinate entry (perfect for remote farms where GPS is spotty).
- "Open in Maps" integration.

### **4. AI Crop Scan**
- Camera interface for capturing plant health issues.
- Displays confidence score and severity of identified diseases.

### **5. Market Prices**
- A data-dense table view of current crop prices across Nigerian markets.

### **6. AI Advisor**
- A conversational history view for chatting with the AI agronomist.

### **7. Subscription**
- **AgriBoost Pro**: Information on the premium tier (N2,500/mo) which unlocks Satellite Field Mapping and Priority AI access.

### **8. Settings**
- Profile management.
- Persistent language switching.

---

## 🛠️ Technical Stack

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Advanced Glassmorphism & Animations)
- **AI/LLM**: Groq API (Llama 3.2 90b & Llama 3.2 Vision)
- **Database & Auth**: Supabase (PostgreSQL)
- **APIs**: Open-Meteo (Weather), BigDataCloud (Geolocation)
