# AI-Powered SaaS Resume Builder

An enterprise-grade, production-ready AI SaaS platform for creating, customizing, and optimizing resumes. Built with **Spring Boot 3**, **React 18 + Vite**, **Tailwind CSS**, **PostgreSQL**, and **Paystack Payment Gateway**.

---

## Architecture Overview

The repository is structured into three isolated, decoupled modules:

```
resume-builder/
├── backend/        # Spring Boot 3 REST API + Security + Paystack & AI Services
├── frontend/       # User Portal (React + Vite + Live A4 PDF Split-Screen Builder)
└── admin-panel/    # Admin Dashboard (React + Vite + Recharts Analytics & Sales Ledger)
```

---

## Key Features

### User Application (`frontend/`)
- **Live Split-Screen A4 Editor**: Real-time rendering of your resume on an A4 document preview as you type with PDF-accurate print layout.
- **AI Agent & Conversational Extraction**:
  - **Conversational Resume Agent**: Parses natural language instructions, unformatted career notes, and multi-category skills.
  - **Multi-Category Skill Extraction**: Organizes skills into custom category blocks (e.g., *Programming*, *Backend Development*, *DevOps & Cloud*, *Security*, *AI & Agentic Systems*).
  - **AI Executive Summary & Bullet Improver**: Tailors professional summaries and rewrites achievements with strong action verbs.
  - **ATS Compatibility Analyzer**: Scans resume text against job descriptions and outputs a match score with keyword recommendations.
- **Paystack Payment Gateway**: Real Paystack Inline SDK checkout (`PaystackPop.setup`) for instant Pro upgrades with dynamic currency sync (`KES` / `KSh`, `NGN`, `USD`).
- **Full SPA Page Routing & User Portal**:
  - Dedicated `/login`, `/register`, `/plans`, `/templates`, and `/profile` routes with browser history navigation.
  - User Profile dropdown menu with account security, password updates, and subscription management.
- **High-Density Template Gallery**: Filterable and searchable catalog with live miniature PDF previews and modal inspections.

### Admin Panel (`admin-panel/`)
- **Executive Business Dashboard**: Real-time revenue metrics, active user counters, conversion percentages, and interactive **Recharts** revenue graphs.
- **Subscription Plans Manager**: Full CRUD management of SaaS pricing tiers (`/plans`) with custom features, monthly pricing, and billing periods.
- **Template Manager**: Upload, edit, and toggle pricing tiers (**FREE** vs **PRO**) for templates with visual previews.
- **Paginated User Directory**: Search toolbar with debounced queries (`?search=`), tier filtering (`?tier=FREE|PRO`), and page navigation.
- **Paystack Webhook & Payment Ledger**: Real-time monitoring of Paystack transaction references, amounts, and webhook signatures.
- **System Settings & Key Vault**: Configure Paystack Secret/Public Keys, Google Gemini AI API keys, and default system currencies.

### Backend API (`backend/`)
- **Spring Boot 3.3 & Java 17/24**: RESTful micro-architecture with Spring Security + JWT authentication.
- **Google Gemini AI Agent Integration**: Direct Google Generative AI integration with fallback-resilient agent loops and tool calling.
- **PostgreSQL / H2 Database**: Relational schema with optimistic locking (`@Version`) to prevent concurrent edit conflicts.
- **Paystack Webhook HMAC SHA512 Handler**: Secure server-side signature verification ensuring zero payment spoofing.
- **Paginated REST APIs**: Standardized `PageResponse<T>` wrapper for `Pageable` queries (`?page=0&size=10&sort=id,desc`).

---

## Prerequisites & Tech Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Backend Framework** | Java Spring Boot | 3.3.2 |
| **Java JDK** | OpenJDK / Oracle JDK | 17+ (Java 24 verified) |
| **Database** | PostgreSQL / H2 (In-Memory) | 14+ / H2 2.2 |
| **Frontend Framework** | React + Vite | React 18 |
| **Styling** | Tailwind CSS + Lucide Icons | v3.4 |
| **Charts** | Recharts | v2.12 |
| **Payment Gateway** | Paystack REST API & Inline SDK | v1.0 |
| **AI LLM Engine** | Google Gemini API (gemini-1.5-flash) | Generative Language API |

---

## Quick Start Guide

### 1. Backend Setup (`backend/`)

Navigate to the backend directory:
```bash
cd backend
```

#### Running with In-Memory H2 Database (Zero Setup):
```bash
mvn spring-boot:run
```
> The API will start on **`http://localhost:8081/api/v1`**. The H2 console is accessible at `http://localhost:8081/h2-console`.

#### Running with Local PostgreSQL:
1. Ensure PostgreSQL is running locally.
2. Create the database:
   ```sql
   CREATE DATABASE resumedb;
   ```
3. Run the application with the `postgres` profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=postgres
   ```

---

### 2. Frontend User Application (`frontend/`)

In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Access the User Application at **`http://localhost:5173`**.

---

### 3. Admin Panel (`admin-panel/`)

In a new terminal window:
```bash
cd admin-panel
npm install
npm run dev
```
> Access the Admin Panel at **`http://localhost:5174`** (or next available Vite port).

---

## API Endpoint Reference

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user & generate JWT | `{ email, password }` |
| `POST` | `/api/v1/auth/register` | Register new user account | `{ email, password, fullName }` |
| `POST` | `/api/v1/ai/agent-execute` | AI Agent conversational editor & extractor | `{ userInstruction, profession, resumeId }` |
| `POST` | `/api/v1/ai/generate-summary` | Generate AI executive summary | `{ targetRole, experienceYears, skills }` |
| `POST` | `/api/v1/ai/ats-check` | Analyze ATS match percentage | `{ resumeText, jobDescription }` |
| `GET` | `/api/v1/templates` | Fetch published resume templates | `N/A` |
| `GET` | `/api/v1/admin/plans` | Fetch active subscription plans | `N/A` |
| `POST` | `/api/v1/admin/plans` | Create or update subscription plan | `{ name, priceMonthly, currency, features }` |
| `GET` | `/api/v1/admin/dashboard/metrics` | Fetch dashboard KPI analytics & charts | `N/A` |
| `GET` | `/api/v1/admin/users` | Fetch paginated user directory | `?page=0&size=10&search=&tier=&sort=` |
| `GET` | `/api/v1/admin/payments` | Fetch Paystack transactions ledger | `?page=0&size=10&status=` |
| `POST` | `/api/v1/admin/users/{id}/toggle-premium` | Toggle user PRO status | `N/A` |
| `POST` | `/api/v1/payments/webhook` | Paystack HMAC Webhook Listener | Header: `x-paystack-signature` |

---

## License
This project is proprietary SaaS software. All rights reserved.
