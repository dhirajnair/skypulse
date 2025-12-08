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
