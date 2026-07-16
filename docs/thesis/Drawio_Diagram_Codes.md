# ArtisanConnect: Draw.io Diagram Codes

*Instructions: Open [app.diagrams.net](https://app.diagrams.net/). Create a blank diagram. In the top menu, go to **Arrange > Insert > Advanced > Mermaid...** (or PlantUML for the Use Case alternative) and paste the code blocks below to automatically generate customizable shapes.*

---

## 1. System Architecture Diagram (Mermaid)

```mermaid
graph TD
    Client["Client Browser (Mobile / Desktop)"]
    NextJS["Next.js Application Server (Server Actions)"]
    Supabase[("Supabase PostgreSQL DB (with pgvector)")]
    Gemini["Google Gemini API (LLM)"]
    
    Client -- "1. HTTP Request (Search / Action)" --> NextJS
    NextJS -- "2. Natural Language Prompt" --> Gemini
    Gemini -- "3. Vector Embeddings / NLP JSON" --> NextJS
    NextJS -- "4. Prisma ORM (Typed SQL Queries)" --> Supabase
    Supabase -- "5. Relational Data Response" --> NextJS
    NextJS -- "6. Rendered HTML / React Components" --> Client
```

---

## 2. Entity Relationship Diagram (ERD) (Mermaid)

```mermaid
erDiagram
    USER ||--o{ ARTISAN_PROFILE : "creates (if artisan)"
    USER ||--o{ SERVICE_REQUEST : "submits (as customer)"
    ARTISAN_PROFILE ||--o{ SERVICE_REQUEST : "receives"
    ARTISAN_PROFILE ||--o| ARTISAN_IDENTITY : "verifies via"
    SERVICE_REQUEST ||--o{ QUOTE : "has many"
    QUOTE ||--o| ESCROW_PAYMENT : "triggers"
    
    USER {
        uuid id PK
        string role
        string email
    }
    ARTISAN_PROFILE {
        uuid id PK
        uuid user_id FK
        float average_rating
        boolean is_verified
    }
    SERVICE_REQUEST {
        uuid id PK
        uuid customer_id FK
        uuid artisan_id FK
        string status
    }
    ESCROW_PAYMENT {
        uuid id PK
        uuid quote_id FK
        string status
    }
```

---

## 3. Escrow Service Lifecycle Workflow (Sequence Diagram) (Mermaid)

```mermaid
sequenceDiagram
    participant C as Customer
    participant S as System (Escrow)
    participant A as Artisan

    C->>A: Submit Service Request
    A->>C: Send Quote (e.g. GHS 200)
    C->>S: Accept & Pay (Funds HELD)
    S-->>A: Notify Funds Secured
    A->>C: Perform Work
    A->>S: Mark Job as "Completed"
    
    alt Customer Satisfied
        C->>S: Confirm Satisfaction
        S->>A: Release Funds (RELEASED)
    else Customer Unsatisfied
        C->>S: File Dispute
        S->>S: Freeze Funds (FROZEN)
        S-->>Admin: Request AI Mediation
    end
```

---

## 4. Use Case Diagram (PlantUML)
*Note: Draw.io often handles PlantUML better for Use Case diagrams than Mermaid. Go to **Arrange > Insert > Advanced > PlantUML...** and paste this:*

```plantuml
@startuml
left to right direction
actor "Customer" as c
actor "Artisan" as a
actor "Admin" as ad

package "ArtisanConnect Platform" {
  usecase "Search Artisans (AI)" as UC1
  usecase "Request Service" as UC2
  usecase "Pay to Escrow" as UC3
  usecase "File Dispute" as UC4
  usecase "Create Profile" as UC5
  usecase "Send Quote" as UC6
  usecase "Start/Complete Work" as UC7
  usecase "Withdraw Funds" as UC8
  usecase "Verify Identities" as UC9
  usecase "Resolve Disputes (AI)" as UC10
}

c --> UC1
c --> UC2
c --> UC3
c --> UC4

a --> UC5
a --> UC6
a --> UC7
a --> UC8

ad --> UC9
ad --> UC10
@enduml
```
