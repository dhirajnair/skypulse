# SkyPulse | Astronomical Context Engine

SkyPulse is an intelligent interface designed to consolidate astronomical data from multiple sources into integrated scientific summaries.

## Google DeepMind - Vibe Code with Gemini 3 Pro

This project was created as a demonstration for **"Google DeepMind - Vibe Code with Gemini 3 Pro in AI Studio"**. It showcases how advanced AI models can rapidly generate complex, aesthetically polished, and functional web applications.

## Architecture & Sandboxed Implementation

This application runs entirely within the browser environment of Google AI Studio. To ensure a smooth "Vibe Coding" experience without requiring external backend infrastructure or complex local setup, specific architectural choices were made:

### 1. Simulated Data Pipeline
Real astronomical services (SIMBAD, VizieR, MAST) typically require server-side proxies to handle CORS (Cross-Origin Resource Sharing) and specific query protocols (TAP/VOTable).
*   **Implementation**: The `services/mockDataService.ts` simulates these external API calls, introducing realistic network latency and generating scientifically plausible random data for stars and exoplanets.
*   **Benefit**: Guarantees stability and performance in the preview environment without hitting external rate limits or CORS errors.

### 2. Browser-Based Database
*   **Implementation**: Instead of a traditional SQL/NoSQL backend, the app uses `lib/db.ts` to act as a wrapper around the browser's `localStorage`.
*   **Benefit**: Allows the application to maintain state (processing queues, session history) across page reloads, mimicking a persistent web application.

### 3. AI Integration
*   **Implementation**: The application uses the real `@google/genai` SDK.
*   **Function**: It takes the (simulated) physical parameters—RA, Dec, Magnitude, Spectral Type—and sends them to Gemini to generate a coherent, human-readable scientific summary.

## Features

*   **Landing Interface**: Accepts batch inputs of astronomical identifiers (e.g., Gaia DR3, TIC IDs).
*   **Processing View**: Visualizes the asynchronous "data fetching" process with status indicators.
*   **Results Dashboard**: A sortable, filterable table of cross-matched objects.
*   **Object Detail View**:
    *   **Sky Map**: D3.js visualization of celestial coordinates.
    *   **Light Curve**: Recharts visualization of photometric time-series data.
    *   **Gemini Summary**: Generative AI text summarizing the object's characteristics.
    *   **Print Mode**: Specialized CSS for generating clean PDF reports.

## Tech Stack

*   **Framework**: React 19
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)
*   **Visualization**: D3.js, Recharts
*   **Icons**: Lucide React

---

## 🏆 Kaggle Submission Writeup

Use the details below for your submission form.

### Title
**SkyPulse: The Astronomical Context Engine**

### Subtitle
Bridging the gap between raw celestial data and scientific insight using Gemini.

### Project Description (Summary)
*Word count: ~160 words*

SkyPulse is an intelligent research dashboard designed to solve the problem of fragmented astronomical data. Researchers often struggle to synthesize information from disconnected catalogs (like SIMBAD or VizieR) to understand a single celestial object.

Built entirely within Google AI Studio using Gemini 3 Pro, SkyPulse accepts list of astronomical identifiers and simulates a cross-match across major databases. It instantly visualizes the object's celestial position using D3.js and renders photometric light curves using Recharts.

The core innovation is the integration of the **Gemini API**. By feeding retrieved physical parameters—coordinates, magnitude, spectral type—into the model, SkyPulse generates a coherent, scientifically grounded summary of the object. This transforms raw, tabular numbers into a human-readable narrative, instantly providing context about the object's nature (e.g., differentiating a "Main Sequence Star" from an "Exoplanet Host"). The application demonstrates how Large Language Models can act as reasoning engines that bridge the gap between hard scientific data and human understanding.

### How I Built It
I utilized **Google AI Studio** and the **Gemini 3 Pro** model to "Vibe Code" this application. 
1.  **Iterative Design**: I started with a high-level prompt for a "Space-themed scientific dashboard" and iteratively refined the UI components using Gemini's code generation capabilities.
2.  **Mocking Complexity**: To ensure the app runs flawlessly in a browser-only preview, I used Gemini to write a robust mock data service that simulates complex asynchronous API calls to astronomical backends.
3.  **AI Integration**: I implemented the `@google/genai` SDK to drive the "Intelligent Summary" feature, allowing the app to generate dynamic text based on the specific data of the selected star or planet.


Video Demo: https://www.loom.com/share/56e82b7824894d35ab93434d361e2e23
Idea credit: hanasoge@tifr.res.in

### Why It Matters (Impact)
Scientific data is exploding in volume but often lacks accessibility. Tools like SkyPulse demonstrate how AI can serve as an intermediate layer, synthesizing complex, multi-source datasets into actionable insights. This reduces the cognitive load on researchers, students, and enthusiasts, allowing them to focus on the *meaning* of the data rather than the mechanics of retrieval.

### Selected Track
Gemini 2.5/3.0 Track (Vibe Coding)
