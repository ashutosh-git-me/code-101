NHAI Command Center: Decentralized Infrastructure Auditing
A real-time, API-first geographic information system (GIS) and telemetry dashboard built for the National Highways Authority of India (NHAI). This system transforms existing commercial dashcams into decentralized AI edge nodes to automate infrastructure auditing, leveraging a privacy-first, zero-video architecture.

🚀 Live Prototype
Production URL: https://pathsmart-infrastructure.vercel.app/

Demo Access Password: nhai-admin

Note for Judges/Reviewers: This deployment includes a built-in Edge Node Simulator. Once logged in, click "Open Edge Simulator" to test the full Detect → Report → Resolve lifecycle in real-time alongside the live map.

🛑 The Core Problem
India possesses the second-largest road network in the world (6.3 million km), with National Highways carrying 40% of all traffic. Currently, infrastructure auditing relies on manual inspections and delayed contractor reports. This results in high latency, dangerous degradation of assets (potholes, missing signage), and severe operational bottlenecks.

💡 The Solution: Universal Edge Nodes
Instead of deploying expensive proprietary hardware, this system uses an API-first architecture to tap into pre-existing dashcams in commercial fleets. By acting as a central aggregator rather than a hardware manufacturer, the platform achieves nationwide scalability with zero hardware CAPEX.

🏗️ Architectural Highlights
1. The Ghost Node Protocol (Privacy-First)
To guarantee driver privacy and bypass union pushback, the system operates on a strict zero-video policy.

All AI inference happens at the edge.

The node transmits an anonymized 150-byte JSON payload containing only the geographic coordinate and the defect extent.

Result: 100% Infrastructure Visibility, 0% Driver Surveillance.

2. Closed-Loop Autonomy (Detect → Report → Resolve)
The system automates not just the detection of road issues, but the bureaucracy of fixing them.

Detect: The edge node identifies an anomaly (e.g., critical pothole) and plots a live ticket on the Command Center.

Resolve: When a subsequent vehicle drives over the repaired segment, the edge AI detects the smooth pavement and pings a VERIFIED_RESOLVED payload.

Autonomy: The backend instantly reconciles the coordinates and automatically closes the maintenance ticket. Zero manual administrative work required.

3. High-Fidelity NOC Mapping
Built using customized map APIs styled specifically for Network Operations Centers (NOC). It strips away topographical noise to highlight arterial highways, State Highway (SH) networks, and physical highway shields, dynamically rendering colored polylines for active traffic diversions.

💻 Tech Stack
Frontend: Next.js (App Router), React, TailwindCSS

Backend: Vercel Serverless Functions, Next.js API Routes

GIS / Mapping: Google Maps API (Custom JSON Styling) / React Leaflet

Edge Node MVP: Generative Telemetry Simulator (built directly into the web client for frictionless demoing)

🛠️ Local Development Setup
To run this project locally, clone the repository and ensure you have Node.js installed.

Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory and add the following keys:

Code snippet
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
EDGE_SECRET_TOKEN=nhai-edge-secret-2026
ADMIN_PASSWORD=nhai-admin
Run the development server:

Bash
npm run dev
Open http://localhost:3000 with your browser to view the Command Center.

👤 Architect & Developer
Ashutosh Tripathi