# RFP AI-Powered Application

An intelligent Request for Proposal (RFP) platform that connects buyers with vendors using AI-powered matching and automated workflows.

### Live Link: https://rfp-connect.vercel.app/

## 🚀 Features

- **AI-Powered RFP Processing**: Automated parsing and analysis of RFP requirements using OpenAI
- **Smart Vendor Matching**: Intelligent algorithm to match RFPs with suitable vendors
- **Real-time Notifications**: Email notifications for RFP updates and matches
- **User Authentication**: Secure JWT-based authentication for buyers and vendors
- **Background Job Processing**: Redis-powered queue system for async operations
- **Responsive UI**: Modern React frontend with Tailwind CSS and Framer Motion

## 🏗️ System Architecture

### High-Level Architecture

Frontend (Vercel)  
================    
📱 React + TS       
🎨 Tailwind CSS     
⚛️ Redux Toolkit    

  Backend (Render)    
================    
🚀 Express API      
🔐 JWT Auth         
🧠 OpenAI GPT

Services
=========
🗄️ PostgreSQL   
🟥 Redis Queue   
📧 SendGrid

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**: Custom components with Framer Motion animations

### Backend (Node.js + Express)
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Queue System**: BullMQ with Redis
- **AI Integration**: OpenAI API for RFP analysis
- **Email Service**: Nodemailer with SendGrid

## 🗄️ Database Schema & Relationships

### Entity Relationship Diagram

| Table          | Key Fields                                              | Relationships                  |
| -------------- | ------------------------------------------------------- | ------------------------------ |
| Buyers         | id(UUID PK), email(unique), phone(unique), status       | 1:N → RFPs                     |
| Vendors        | id(UUID PK), companyName, mainService, status           | 1:N → VendorProductsM:N → RFPs |
| RFPs           | id(UUID PK), buyerId(FK), title, aiParsed(JSON), status | N:1 ← BuyersM:N → Vendors      |
| RfpVendors     | rfpId(PK), vendorId(PK), score(0-100), accepted         | Junction table                 |
| VendorProducts | id(PK), vendorId(FK), name, price, category             | N:1 ← Vendors                  |


### Table Relationships & Cardinality

#### Core Entities
1. **Buyers** (1:N with RFPs)
   - One buyer can create multiple RFPs
   - Each RFP belongs to exactly one buyer

2. **Vendors** (1:N with VendorProducts)
   - One vendor can have multiple products/services
   - Each product belongs to exactly one vendor

3. **RFPs** (M:N with Vendors through RfpVendors)
   - One RFP can be matched with multiple vendors
   - One vendor can be matched with multiple RFPs

#### Junction Tables
4. **RfpVendors** (Many-to-Many Resolution)
   - Composite Primary Key: (rfpId, vendorId)
   - Stores matching score, notification status, proposal acceptance
   - Links buyers, RFPs, and vendors for the matching process

5. **EmailVerificationTokens** (1:N with Users)
   - Supports both buyer and vendor email verification
   - Time-limited tokens with expiration tracking

### Database Models Detail

#### Buyers Table
```sql
- id (UUID, PK)
- firstName, lastName (STRING, NOT NULL)
- emailAddress (STRING, UNIQUE, NOT NULL)
- phone (STRING, UNIQUE, NOT NULL)
- address, city, state, country, postalCode (STRING)
- passwordHash (STRING, NOT NULL)
- isEmailVerified (BOOLEAN, DEFAULT false)
- emailVerifiedAt (DATE)
- status (ENUM: PENDING_VERIFICATION, ACTIVE, SUSPENDED)
```


### Vendors Table

```sql
- id (UUID, PK)
- vendorCompanyName (STRING, NOT NULL)
- emailAddress (STRING, UNIQUE, NOT NULL)
- mainProductService (STRING)
- passwordHash (STRING, NOT NULL)
- phoneNumber, address, pincode, state (STRING)
- establishedDate (DATE)
- deliveryTimeframe (STRING)
- isEmailVerified (BOOLEAN, DEFAULT false)
- status (ENUM: PENDING_VERIFICATION, ACTIVE, SUSPENDED)
- onboardingCompleted (BOOLEAN, DEFAULT false)
- onboardingProgress (INTEGER, DEFAULT 0)
```


### RFPs Table

```sql
- id (UUID, PK)
- buyerId (UUID, FK → Buyers.id)
- rfpTitle (STRING, NOT NULL)
- buyerExpectations (TEXT, NOT NULL)
- expectedDelivery (STRING, NOT NULL)
- budgetRange (STRING)
- additionalContext (TEXT)
- aiParsedRequirements (JSON) -- AI analysis results
- shortlistedVendorsList (JSON) -- Array of vendor IDs
- rfpStatus (ENUM: Pending, Parsed, Shortlisted, Notified)
- notificationSent (BOOLEAN, DEFAULT false)
- submissionDate (DATE, DEFAULT NOW)
```


### RfpVendors Junction Table

```sql
- rfpId (UUID, PK, FK → RFPs.id)
- vendorId (UUID, PK, FK → Vendors.id)
- buyerId (UUID, FK → Buyers.id)
- vendorScore (INTEGER, DEFAULT 0) -- Matching algorithm score
- notificationSent (BOOLEAN, DEFAULT false)
- proposalAccepted (BOOLEAN, NULL) -- Buyer's decision
```


🤖 AI-Powered Workflow
1. RFP Submission Flow
Buyer submits RFP → Queue Job → AI Analysis → Vendor Matching → Notifications




2. AI Processing Pipeline
Natural Language Processing: OpenAI GPT-4 analyzes RFP requirements

Structured Extraction: Converts free text to structured data:

```json
{
  "summary": "Brief RFP description",
  "businessDomain": "e.g., SaaS, e-commerce",
  "primaryGoal": "Main objective",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "mustHaveFeatures": ["Authentication", "API"],
  "niceToHaveFeatures": ["Analytics", "Mobile"],
  "expectedDelivery": "Cleaned timeline"
}
```



3. Vendor Matching Algorithm
   
Scoring System (0-100 points):

- Tech Stack Match (0-15 pts): 3 pts per matching technology
- Feature Match (0-10 pts): 2 pts per required feature
- Location Proximity (0-5 pts): Same state/region preference
- Delivery Timeline (0-2 pts): Vendor delivery capability
- Product Portfolio (0-5 pts): 0.5 pts per relevant product
- Onboarding Status (0-3 pts): Completed vendor profiles

Minimum Score: 8 points for shortlisting   
*Maximum Results: Top 5 vendors per RFP*

## 🔄 Background Job Processing
### Queue System (BullMQ + Redis)
### RFP Processing Job

- Triggered on RFP submission
- AI parsing of requirements
- Vendor matching algorithm execution
- Email notification dispatch

### Job Flow
```
RFP Submit → Queue Job → AI Parse → Update RFP → Match Vendors → 
Create RfpVendor Records → Send Notifications → Update Status
```



### 📋 Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

### 🛠️ Installation & Setup
1. Clone the Repository
```
git clone <repository-url>
cd rfp-ai-powered-app
```



```bash
2. Environment Configuration
Backend Environment (.env in /backend)
PORT=8080
FE_PORT=3000
PROTOCOL=http
DB_USER=postgres
DB_PASSWORD=Test1234
DB_HOST=localhost
DB_NAME=ai_powered_rfp_db
DB_PORT=5432
JWT_SECRET_KEY=your_secret_key_here
EMAIL_USER=your_email@gmail.com
SENDGRID_API_KEY=your_sendgrid_api_key
OPENAI_SECRET_KEY=your_openai_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

# Frontend Environment (.env in root)
```
REACT_APP_API_URL=http://localhost:8080
```


3. Using Docker (Recommended)
```
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

```bash
4. Manual Setup
Backend Setup
cd backend
npm install
npm run dev
```



```bash
Frontend Setup
npm install
npm start
```



```bash
Database Setup
# Start PostgreSQL and Redis
docker-compose up -d db redis

# Database will be automatically created by Sequelize
```



```bash
🌐 API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration

Buyers
GET /api/buyer - Get buyer profile

POST /api/buyer - Create buyer profile

PUT /api/buyer - Update buyer profile

Vendors
GET /api/vendor - Get vendor profile

POST /api/vendor - Create vendor profile

PUT /api/vendor - Update vendor profile

RFPs
POST /api/rfp - Submit new RFP

GET /api/rfp - Get RFPs (filtered by user role)

Email Verification
POST /api/verify-email - Verify email address
```
🎨 Frontend Structure
src/  
├── components/  
│   ├── pages/          # Page components   
│   └── ui/             # Reusable UI components   
├── context/            # React contexts   
├── entities/           # TypeScript type definitions   
├── guards/             # Route protection   
├── services/           # API service layer   
├── store/              # Redux store configuration   
└── staticData/         # Static content   




🔧 Development
Available Scripts
Frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests




```bash
Backend
npm start          # Start production server
npm run dev        # Start development server with nodemon
```



### Code Style

```bash
ESLint configuration for consistent code style
TypeScript for type safety
Modular architecture with separation of concerns
```
🚀 Deployment
Production Build
# Build frontend
npm run build

# Start backend in production
cd backend && npm start




```bash
Docker Production
docker-compose -f docker-compose.prod.yml up -d
```



### 🤝 Contributing

```bash
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request
```
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

### 🆘 Support
For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

### 🔮 Future Enhancements
 Advanced AI matching algorithms   
 Real-time chat between buyers and vendors   
 Document management system   
 Advanced analytics dashboard   
 Mobile application   
 Multi-language support   
