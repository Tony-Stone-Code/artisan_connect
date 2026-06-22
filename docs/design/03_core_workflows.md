# Deliverable 3: Core Workflow Diagrams

## 3.1 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase Auth
    participant API

    User->>Frontend: Register / Login
    Frontend->>Supabase Auth: Sign Up / Sign In
    Supabase Auth-->>User: (If new) Email Verification
    User->>Supabase Auth: Clicks verification link
    Supabase Auth-->>Frontend: Returns JWT
    Frontend->>API: Authenticated Request (******
    API-->>Frontend: Protected Data
```

## 3.2 Ghana Card Verification Flow (Groq Vision)

```mermaid
sequenceDiagram
    participant Artisan
    participant Frontend
    participant VerificationService
    participant GroqVision
    participant Admin
    participant DB

    Artisan->>Frontend: Uploads Card Image + Selfie
    Frontend->>VerificationService: Submit Images
    VerificationService->>GroqVision: Extract details from image
    GroqVision-->>VerificationService: JSON (name, number, DOB, expiry)
    VerificationService->>DB: Save to admin queue with AI summary
    DB-->>Admin: New pending verification
    Admin->>VerificationService: Review (card image + AI extraction + selfie)
    Admin->>VerificationService: Approve/Reject
    VerificationService->>DB: Update verification_status
    VerificationService-->>Artisan: Send notification
```

## 3.3 AI-Powered Search Flow (Groq Only)

```mermaid
sequenceDiagram
    participant Customer
    participant SearchService
    participant GroqLLM
    participant GroqEmbed
    participant pgvector
    participant Mapbox

    Customer->>SearchService: Natural Language Query (e.g. "I need a plumber quickly")
    SearchService->>GroqLLM: Extract intent & clarify requirements
    GroqLLM-->>SearchService: Intent (type: Plumber, urgency: high)
    SearchService->>GroqEmbed: Generate vector from clarified intent
    GroqEmbed-->>SearchService: Float Array
    SearchService->>pgvector: Similarity Search
    pgvector-->>SearchService: Candidate Profiles
    SearchService->>Mapbox: Calculate distances
    Mapbox-->>SearchService: Distances
    SearchService->>SearchService: Composite Score Ranking
    SearchService->>GroqLLM: Generate results summary
    GroqLLM-->>SearchService: "Found 5 verified plumbers near you..."
    SearchService-->>Customer: Ranked Profiles + AI Summary
```

## 3.4 Service Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending : Customer Creates Request
    Pending --> Quoted : Artisan sends quote
    Pending --> Cancelled : Customer cancels
    Quoted --> Accepted : Customer accepts quote
    Quoted --> Rejected : Customer rejects quote
    Quoted --> Cancelled : Artisan or Customer cancels
    Accepted --> In_Progress : Escrow funded
    In_Progress --> Completed : Artisan finishes work
    In_Progress --> Disputed : Issue arises
    Completed --> Confirmed : Customer confirms
    Completed --> Disputed : Customer unhappy
    Confirmed --> [*] : Escrow released
    Disputed --> Resolved : Admin resolves
    Resolved --> [*]
```

## 3.5 Quoting & Price Negotiation Flow

```mermaid
sequenceDiagram
    participant Customer
    participant QuotingService
    participant Artisan
    participant EscrowService

    Customer->>QuotingService: Creates Service Request
    QuotingService-->>Artisan: Request Notification
    Artisan->>QuotingService: Send Price Quote (amount, desc)
    QuotingService-->>Customer: Review Quote
    alt Customer Accepts
        Customer->>QuotingService: Accept Quote
        QuotingService->>EscrowService: Trigger Escrow funding
    else Customer Rejects
        Customer->>QuotingService: Reject / Counter
        QuotingService-->>Artisan: Notify rejection
    end
```

## 3.6 Escrow Payment Flow

```mermaid
sequenceDiagram
    participant Customer
    participant PaymentService
    participant EscrowHold
    participant Artisan

    Customer->>PaymentService: Pays quoted amount
    PaymentService->>EscrowHold: Funds held in Escrow
    Note over Customer, Artisan: Job In Progress -> Completed
    Customer->>PaymentService: Confirms job completion
    PaymentService->>EscrowHold: Release Funds
    EscrowHold-->>Artisan: Funds deposited
```

## 3.7 Messaging Flow (WebSocket)

```mermaid
sequenceDiagram
    participant CustomerClient
    participant WebSocketServer
    participant DB
    participant ArtisanClient

    CustomerClient->>WebSocketServer: Connect
    ArtisanClient->>WebSocketServer: Connect
    CustomerClient->>WebSocketServer: Emit 'send_message'
    WebSocketServer->>DB: Store message
    WebSocketServer->>ArtisanClient: Emit 'receive_message'
    ArtisanClient->>WebSocketServer: Emit 'typing_indicator'
    WebSocketServer->>CustomerClient: Emit 'typing_indicator'
```
