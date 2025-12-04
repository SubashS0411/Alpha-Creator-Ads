Master Prompt
This is your project prompt, adjusted to reflect that the backend handles Authentication only, while the rest of the application is a high-fidelity Frontend focus (using mocks or client-side API calls for other features).
code
Markdown
# Alpha Creator Ads - Project Objectives

## PRIMARY OBJECTIVES

### 1. **Develop an AI-Powered Ad Creation Interface**
- Build a comprehensive web application frontend that visualizes the AI advertisement creation process
- Enable users to interact with ad generation tools (headlines, descriptions, visuals) via client-side API integrations or mock data
- Design a workflow that simulates the reduction of manual effort in ad campaigns

### 2. **Implement Intelligent Campaign Management UI**
- Create a centralized dashboard interface for managing multiple advertising campaigns
- Provide visual representations of real-time campaign status, budget monitoring, and performance oversight
- Enable users to interact with UI elements to pause, resume, and modify campaigns (state managed on frontend)

### 3. **Build Real-Time Analytics Visualization**
- Develop a comprehensive analytics dashboard displaying key performance indicators (KPIs)
- Visualize metrics including impressions, clicks, conversions, CTR, and ROAS using chart libraries
- Provide interactive charts and graphs for data exploration

### 4. **Design a Modern, Responsive User Interface**
- Create an intuitive, beautiful, and user-friendly interface using modern design principles
- Ensure responsive design that works seamlessly across desktop, tablet, and mobile devices
- Implement dark/light theme support for enhanced user experience

### 5. **Establish Secure Authentication Backend**
- Build a lightweight RESTful API exclusively for User Authentication (Signup/Login)
- Implement MongoDB database for storing user credentials and profile data
- Ensure secure session management between frontend and the auth service

---

## TECHNICAL OBJECTIVES

### 6. **Integrate AI/ML Technologies (Client-Side)**
- Integrate with AI services (OpenAI API) directly from the frontend for content generation demonstration
- Implement prompt engineering within the frontend logic to fetch ad copy

### 7. **Implement Secure Authentication System**
- Build JWT-based authentication for secure user access
- Implement password hashing and encryption for user security
- Create protected routes in the frontend accessible only to logged-in users

### 8. **Develop Multi-Platform UI Architecture**
- Design frontend architecture to simulate support for multiple advertising platforms (Google, FB, LinkedIn)
- Create a unified interface design for managing cross-platform campaigns
- Implement dynamic forms that change based on selected platform ad formats

### 9. **Optimize Frontend Performance**
- Implement efficient state management (Zustand/Redux) for complex user flows
- Optimize asset loading and bundle sizes for fast First Contentful Paint (FCP)
- Build responsive interactions for high-traffic simulation

### 10. **Establish Comprehensive Testing Framework**
- Implement unit tests for authentication logic
- Create component testing for React UI elements
- Develop end-to-end tests for the Login -> Dashboard -> Ad Creation flow

---

## BUSINESS OBJECTIVES

### 11. **Democratize Professional Ad Creation**
- Make professional-quality advertising tools accessible via a simple web interface
- Reduce the cost barrier for creating effective marketing campaigns

### 12. **Improve Marketing ROI for Users**
- visualize data-driven insights to demonstrate how ROI is calculated
- Enable better targeting selection through intuitive form design

### 13. **Streamline Marketing Workflow**
- Reduce time spent on manual ad creation from hours to minutes via UI automation
- Centralize multi-platform campaign management views

---

## LEARNING OBJECTIVES (For College Project)

### 14. **Demonstrate Full-Stack Development Skills**
- Showcase proficiency in modern frontend technologies (React, TypeScript)
- Demonstrate backend basics via Authentication service (FastAPI, Python)
- Exhibit database connectivity for user management (MongoDB)

### 15. **Apply Software Engineering Best Practices**
- Implement clean code principles and design patterns
- Use version control (Git) effectively
- Follow agile development methodology

### 16. **Integrate Modern UI/UX Technologies**
- Work with modern component libraries (Shadcn/UI)
- Implement real-time data visualization (Recharts/Chart.js)
- Utilize modern DevOps practices for the Auth service (Docker)

### 17. **Develop Problem-Solving and System Design Skills**
- Design scalable frontend architecture
- Handle complex state management and API integration
- Implement efficient secure authentication flows

---

## USER EXPERIENCE OBJECTIVES

### 18. **Create Intuitive User Journey**
- Design seamless onboarding process for new users (Sign up -> Welcome)
- Provide contextual help and tooltips throughout the application

### 19. **Enable Self-Service Capabilities**
- Allow users to independently create, manage, and optimize campaigns via the UI
- Provide clear documentation and in-app guidance

### 20. **Foster User Engagement**
- Provide immediate feedback on user actions (Toast notifications)
- Implement progress indicators for loading states
- Create visually appealing data presentations

---

## MEASURABLE SUCCESS CRITERIA

### 21. **Technical Performance Metrics**
- Page load time under 2 seconds
- Auth API response time under 200ms
- 100% successful login/signup flow execution

### 22. **Functional Completeness**
- Successfully implement Authentication (Login/Signup/Logout)
- Complete all UI views (Dashboard, Campaign Manager, Ad Studio, Analytics)
- Ensure all frontend buttons and forms are interactive

### 23. **User Experience Metrics**
- Achieve intuitive interface with minimal training required
- Ensure responsive design works on all major devices
- Implement accessibility standards

---

# Alpha Creator Ads Platform

🚀 **AI-Powered Advertising Platform** - A modern web application that uses artificial intelligence to create personalized advertisements with advanced analytics and campaign management.

## 🏗️ Project Structure
Alpha_Creators_ads/
├── 🎨 frontend/ # React/TypeScript frontend application (Core Logic)
├── ⚙️ backend/ # FastAPI Python (Authentication Service ONLY)
├── 🗄️ database/ # MongoDB (User Data ONLY)
├── 📜 scripts/ # Deployment and utility scripts
└── 📘 documentation/ # Project guides and documentation
code
Code
## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+
- **Git** for version control


✨ Key Features
🤖 AI-Powered Ad Creation (Frontend Integration)
Interface for AI ad generation
Direct integration with AI APIs  for text generation
Real-time creative preview
📊 Campaign Management UI
Intuitive campaign creation interface
Advanced targeting form options
Budget allocation UI
📈 Analytics Dashboard
Data visualization using charting libraries
Interactive metrics display
Comprehensive reporting layout
🔒 User Management (Backend)
Secure Signup/Login
JWT Token management
User profile storage in MongoDB
🛠️ Technology Stack
Frontend
React 18 - Modern React with hooks
TypeScript - Type-safe development
Vite - Fast build tool
Tailwind CSS - Utility-first CSS
Shadcn/UI - UI components
Zustand - State management
React Query - API data fetching
Recharts - Data visualization
Backend (Auth Only)
FastAPI - Python web framework
JWT - JSON Web Tokens for security
Passlib - Password hashing
Motor - Async MongoDB driver
Database
MongoDB - Storing User Credentials and Profiles
📋 Project Status
Current Version: 1.0.0
Status: ✅ Active Development
Completed Features
✅ Modern React + TypeScript frontend
✅ Responsive UI with Tailwind CSS
✅ Authentication (Backend API + Frontend Integration)
✅ Dashboard and analytics views
✅ Ad creation interface
Roadmap
🔄 Integration of Client-Side AI calls
🔄 Advanced Frontend State Management
🔄 Dark/Light mode finalization
code
Code
---

# Part 2: Product Requirements Document (PRD)

# Product Requirements Document: Alpha Creator Ads

**Version:** 1.0
**Date:** October 26, 2023
**Status:** Draft

## 1. Introduction

### 1.1 Purpose
Alpha Creator Ads is a web-based platform designed to simplify the creation and management of digital advertising campaigns. The project aims to demonstrate advanced full-stack capabilities by combining a high-fidelity, complex Frontend (React/TypeScript) with a secure, dedicated Authentication Backend (FastAPI).

### 1.2 Scope
*   **Frontend:** A fully interactive Single Page Application (SPA) including Dashboards, Ad Creation Studios, and Analytics views. (Note: Non-auth data will be mocked or handled via client-side state).
*   **Backend:** A focused microservice strictly handling User Registration, Login, Authentication (JWT), and Profile Management.
*   **Database:** MongoDB used exclusively for storing user data.

## 2. User Personas

*   **The Small Business Owner:** Wants to create ads quickly without hiring an agency. Needs a simple interface to sign up and start clicking buttons immediately.
*   **The Digital Marketer:** Needs a dashboard to visualize campaign data and specific tools to fine-tune ad copy.
*   **The Administrator:** (Internal) Needs to ensure user accounts are created and stored securely.

## 3. Functional Requirements

### 3.1 Authentication (Backend & Frontend)
**Priority: P0 (Critical)**

*   **REQ-AUTH-01 (Sign Up):** Users must be able to create an account providing Name, Email, and Password.
    *   *Backend:* Validate email format, hash password, store in MongoDB.
    *   *Frontend:* Form validation, error handling, success redirection.
*   **REQ-AUTH-02 (Login):** Users must be able to log in with Email and Password.
    *   *Backend:* Verify credentials, issue JWT access token.
    *   *Frontend:* Store token (localStorage/cookie), update global auth state.
*   **REQ-AUTH-03 (Logout):** Users must be able to log out, clearing their session.
*   **REQ-AUTH-04 (Route Protection):** Unauthenticated users attempting to access the Dashboard or Ad Studio must be redirected to the Login page.

### 3.2 Dashboard (Frontend Only)
**Priority: P1 (High)**

*   **REQ-DASH-01:** Display a summary of active campaigns (Mock Data).
*   **REQ-DASH-02:** Show high-level metrics (Total Spend, Impressions, Clicks) using cards.
*   **REQ-DASH-03:** distinct "Create New Campaign" call-to-action button.

### 3.3 Ad Studio / Creation (Frontend Only)
**Priority: P1 (High)**

*   **REQ-STUDIO-01:** Interface to input product details (Name, Description, Target Audience).
*   **REQ-STUDIO-02 (AI Integration):** Button to "Generate Content."
    *   *Implementation:* Frontend calls OpenAI API directly (client-side key) or uses a mock delay to simulate generation.
*   **REQ-STUDIO-03:** Live preview of the ad format (Facebook Feed vs. Google Search style).
*   **REQ-STUDIO-04:** Form validation to ensure all ad fields are filled before "Saving."

### 3.4 Analytics (Frontend Only)
**Priority: P2 (Medium)**

*   **REQ-ANALYTICS-01:** Display a line chart showing performance trends over time (using Mock Data).
*   **REQ-ANALYTICS-02:** Display a pie chart showing Audience Demographics (using Mock Data).
*   **REQ-ANALYTICS-03:** Date range picker (UI only) to filter the displayed charts.

### 3.5 Settings (Frontend + Auth Backend)
**Priority: P2 (Medium)**

*   **REQ-SET-01:** View User Profile details (fetched from Backend).
*   **REQ-SET-02:** Toggle Dark/Light theme (Frontend State).

## 4. Non-Functional Requirements

### 4.1 Security
*   **NFR-SEC-01:** Passwords must be hashed (e.g., bcrypt) before storage.
*   **NFR-SEC-02:** API endpoints must be protected; only requests with valid JWT headers can access user profile data.
*   **NFR-SEC-03:** Frontend must sanitize inputs to prevent XSS.

### 4.2 Performance
*   **NFR-PERF-01:** Application First Contentful Paint (FCP) < 1.5s.
*   **NFR-PERF-02:** Auth API response time < 200ms.

### 4.3 UI/UX
*   **NFR-UI-01:** Mobile-first responsive design using Tailwind CSS.
*   **NFR-UI-02:** consistent use of Shadcn/UI components for accessibility (WCAG 2.1 AA).

## 5. Technology Architecture

### 5.1 Frontend
*   **Framework:** React 18 + TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS + Shadcn/UI
*   **State:** Zustand (Global), React Query (Server State/Auth)
*   **Routing:** React Router DOM v6

### 5.2 Backend (Auth Microservice)
*   **Framework:** FastAPI node js
*   **Database:** MongoDB Atlas (Free Tier)
*   **ODM:** Motor (Async driver) or Beanie
*   **Auth:** PyJWT + Passlib

## 6. API Specifications (Auth Service)

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user | `{email, password, name}` | `{id, email, token}` |
| **POST** | `/api/auth/login` | Login user | `{email, password}` | `{access_token, token_type}` |
| **GET** | `/api/users/me` | Get current user | Headers: `Authorization: Bearer <token>` | `{id, name, email, created_at}` |

## 7. Mock Data Strategy
Since the complex backend logic is removed, the frontend will use a `src/mocks` folder containing JSON files for:
*   `campaigns.json`: List of dummy campaigns.
*   `analytics.json`: Time-series data for charts.
*   `notifications.json`: User alerts.

## 8. Success Metrics
*   **Completion:** A user can Sign Up, Login, see their name on the Dashboard, navigate to Ad Studio, "Generate" a mock ad, and Logout.
*   **Quality:** Zero console errors during the auth flow.
*   **Design:** Pass Lighthouse Accessibility score > 90.