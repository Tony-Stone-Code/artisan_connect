# Deliverable 1: System Architecture Diagram

## 1. High-Level Architecture

```mermaid
graph TD
    subgraph Presentation Layer [Frontend: Next.js 15, React, Tailwind]
        UI[User Interface]
        State[Client State Management]
        API_Client[API Communication Layer]
        UI --> State
        State --> API_Client
    end

    subgraph External APIs [Third-party Integrations]
        Mapbox[Mapbox GL JS]
        Resend[Resend Email]
    end

    subgraph AI Layer [Groq AI Services]
        GroqLLM[Groq LLM Inference]
        GroqEmbed[Groq Embeddings]
        GroqVision[Groq Vision]
    end

    subgraph Application Layer [Backend: Node.js, Express, Socket.io]
        Gateway[API Gateway / Middleware]
        REST[REST API Controllers]
        WS[WebSocket Server]
        Services[Business Logic Modules]
        
        Gateway --> REST
        Gateway --> WS
        REST --> Services
        WS --> Services
    end

    subgraph Data Layer [Supabase]
        DB[(PostgreSQL)]
        VectorDB[(pgvector)]
        Auth[(Supabase Auth)]
        Storage[(Supabase Storage)]
    end

    API_Client <-->|REST / HTTP| Gateway
    API_Client <-->|WebSocket| WS
    API_Client <--> Mapbox
    
    Services <--> Auth
    Services <--> DB
    Services <--> VectorDB
    Services <--> Storage
    Services <--> Resend
    
    Services <-->|API Calls| GroqLLM
    Services <-->|API Calls| GroqEmbed
    Services <-->|API Calls| GroqVision
```

## 2. Backend Service Architecture

```mermaid
graph TD
    subgraph Middleware [Middleware Pipeline]
        JWT[JWT Validation]
        RBAC[4-tier RBAC]
        RateLimit[Rate Limiting]
        Error[Error Handling]
    end

    subgraph Services [13 Microservice-style Modules]
        AuthSvc[Auth Service]
        UserSvc[User Service]
        SearchSvc[Search Service]
        VerifySvc[Verification Service]
        PaymentSvc[Payment Service]
        MsgSvc[Messaging Service]
        NotifSvc[Notification Service]
        AISvc[AI Service - Groq]
        AvailSvc[Availability Service]
        QuoteSvc[Quoting Service]
        MediaSvc[Media Service]
        ModSvc[Moderation Service]
        AdminSvc[Admin Service]
    end

    Middleware --> AuthSvc
    Middleware --> UserSvc
    Middleware --> SearchSvc
    Middleware --> VerifySvc
    Middleware --> PaymentSvc
    Middleware --> MsgSvc
    Middleware --> NotifSvc
    Middleware --> AISvc
    Middleware --> AvailSvc
    Middleware --> QuoteSvc
    Middleware --> MediaSvc
    Middleware --> ModSvc
    Middleware --> AdminSvc
    
    SearchSvc --> AISvc
    VerifySvc --> AISvc
    ModSvc --> AISvc
    MsgSvc --> AISvc
    UserSvc --> AISvc
```

## 3. Data Flow Diagram: AI Pipeline

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SearchService
    participant GroqLLM
    participant GroqEmbed
    participant pgvector

    User->>Frontend: Enters natural language query
    Frontend->>SearchService: POST /api/search {query}
    SearchService->>GroqLLM: Extract intent & clarify requirements
    GroqLLM-->>SearchService: Clarified Intent JSON
    SearchService->>GroqEmbed: Generate vector from clarified intent
    GroqEmbed-->>SearchService: Float Array (Vector)
    SearchService->>pgvector: Similarity Search (Cosine distance) + Mapbox filter
    pgvector-->>SearchService: Ranked Artisan Profiles
    SearchService->>GroqLLM: Generate results summary
    GroqLLM-->>SearchService: Natural language summary
    SearchService-->>Frontend: Profiles + Summary
    Frontend-->>User: Displays results
```

## 4. AI Integration Map

```mermaid
mindmap
  root((Groq AI Layer))
    Embeddings
      Semantic Search
      Service Matching
    Vision
      Ghana Card OCR
      Document Verification
    LLM Inference
      Query Understanding
      Profile Bio Generation
      Review Sentiment Analysis
      Dispute Summarization
      Customer Recommendations
```

## 5. Infrastructure Diagram

```mermaid
graph LR
    User([User Client])
    
    subgraph Vercel [Frontend Hosting]
        NextApp[Next.js Application]
    end
    
    subgraph Railway [Backend Hosting]
        NodeApp[Node.js API Server]
        WSServer[Socket.io Server]
    end
    
    subgraph Supabase [Data & Auth]
        Postgres[(PostgreSQL + pgvector)]
        SupabaseAuth[Authentication]
        SupabaseStorage[File Storage]
    end
    
    subgraph External [External APIs]
        Groq[Groq API]
        Mapbox[Mapbox API]
        Resend[Resend API]
    end
    
    User <-->|HTTPS| NextApp
    NextApp <-->|REST/WSS| NodeApp
    NextApp <-->|WSS| WSServer
    
    NodeApp <--> Postgres
    NodeApp <--> SupabaseAuth
    NodeApp <--> SupabaseStorage
    
    NodeApp <--> Groq
    NodeApp <--> Resend
    NextApp <--> Mapbox
```
