# APPENDIX A: DATABASE SCHEMA ARCHITECTURE

The following schema defines the Entity-Relationship (ER) model utilizing the Prisma Object-Relational Mapper (ORM). This architecture strictly enforces referential integrity across the two-sided marketplace.

## A.1 Prisma Schema Definition
```prisma
// This schema manages the user hierarchy, extending the generic User model
// into specialized CustomerProfile and ArtisanProfile entities.

model User {
  id             String          @id @default(uuid())
  supabase_uid   String          @unique
  email          String          @unique
  first_name     String
  last_name      String?
  phone_number   String?
  role           Role            @default(CUSTOMER)
  
  customer_profile CustomerProfile?
  artisan_profile  ArtisanProfile?
  admin_profile    AdminProfile?
}

model ArtisanProfile {
  id              String          @id @default(uuid())
  user_id         String          @unique
  user            User            @relation(fields: [user_id], references: [id], onDelete: Cascade)
  business_name   String?
  bio             String?
  experience_years Int?           @db.SmallInt
  address         String?
  latitude        Float?
  longitude       Float?
  is_verified     Boolean         @default(false)
  is_available    Boolean         @default(true)
  average_rating  Decimal         @default(0.0) @db.Decimal(3, 2)
  review_count    Int             @default(0)
  
  // Relations
  services        ArtisanService[]
  portfolio       PortfolioItem[]
  requests        ServiceRequest[]
  quotes          Quote[]
  reviews         Review[]
}

model EscrowPayment {
  id          String         @id @default(uuid())
  quote_id    String         @unique
  quote       Quote          @relation(fields: [quote_id], references: [id])
  amount      Decimal        @db.Decimal(10, 2)
  fee_amount  Decimal        @db.Decimal(10, 2)
  status      EscrowStatus   @default(HELD)
  payment_ref String         @unique
  created_at  DateTime       @default(now())
  released_at DateTime?
}
```

# APPENDIX B: AI SEMANTIC SEARCH ENGINE

## B.1 Vector Embeddings & Natural Language Processing
The platform utilizes Google's Gemini-2.5-Pro model to interpret user intent. Traditional searches fail when a user searches for "broken pipe" instead of "plumber". The Gemini model performs a zero-shot classification to map colloquial queries to standard database taxonomy.

### B.1.1 API Payload Example (Intent Extraction)
```json
{
  "contents": [{
    "parts": [{
      "text": "Identify the primary service category for this query: 'my sink is leaking water everywhere'"
    }]
  }],
  "generationConfig": {
    "temperature": 0.1,
    "topK": 1,
    "topP": 0.8
  }
}
```

### B.1.2 Response Output
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Plumbing\",\n  \"confidence\": 0.98,\n  \"keywords\": [\"sink\", \"leaking\", \"water\"]\n}"
          }
        ],
        "role": "model"
      }
    }
  ]
}
```

# APPENDIX C: REAL-TIME NOTIFICATIONS ARCHITECTURE

## C.1 Supabase Realtime WebSocket Protocol
To achieve zero-latency messaging, the platform connects to the PostgreSQL logical replication stream via Supabase WebSockets.

### C.1.1 Client Subscription Logic
```typescript
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Subscribe to any changes on the Message table
    const channel = supabase
      .channel('global_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Message' },
        () => {
          // Whenever a message is inserted, updated, or deleted, refresh the exact unread count
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
```

# APPENDIX D: EXHAUSTIVE TESTING PROTOCOL

## D.1 End-to-End Test Cases
The following 15 test cases were manually executed to validate the platform's stability.

| Test ID | Module | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-001 | Auth | Register new Customer account | JWT generated, row inserted into `User` and `CustomerProfile` | As expected | PASS |
| TC-002 | Auth | Register new Artisan account | JWT generated, row inserted into `User` and `ArtisanProfile` | As expected | PASS |
| TC-003 | Map | Render Mapbox container | Canvas mounts, map loads without API errors | As expected | PASS |
| TC-004 | Map | Artisan Coordinate Injection | `latitude`/`longitude` plots teardrop marker precisely | As expected | PASS |
| TC-005 | Search | Exact Text Match | Typing "Small Boat" returns matching artisan profile | As expected | PASS |
| TC-006 | Search | Gemini NLP Hybrid Match | Typing "broken pipe" returns Plumbers via API intent | As expected | PASS |
| TC-007 | Escrow | Generate Quote | Artisan inputs GHS 500, creates `Quote` record (PENDING) | As expected | PASS |
| TC-008 | Escrow | Accept Quote (Simulation) | Customer clicks accept, `EscrowPayment` record created (HELD) | As expected | PASS |
| TC-009 | Chat | Send Message | Sender posts message, database `INSERT` successful | As expected | PASS |
| TC-010 | Chat | Real-time Badge Trigger | Recipient receives `postgres_change`, badge increments to 1 | As expected | PASS |
| TC-011 | Chat | Real-time Badge Clear | Recipient opens chat, `markMessagesAsRead` fires, badge clears | As expected | PASS |
| TC-012 | Dispute | Customer files dispute | `ServiceRequest` status moves to DISPUTED | As expected | PASS |
| TC-013 | Dispute | Artisan locked out | Artisan "Release Funds" button is disabled/hidden | As expected | PASS |
| TC-014 | Admin | AI Dispute Summarization | Admin dashboard invokes Gemini to summarize chat logs | As expected | PASS |
| TC-015 | Admin | Escrow Refund | Admin forces REFUND, `EscrowPayment` status moves to REFUNDED | As expected | PASS |

# APPENDIX E: GIG ECONOMY LITERATURE REVIEW (EXTENDED)
While digital gig platforms have revolutionized urban mobility (e.g., Uber), the transition for manual artisanal trades remains heavily stunted by the "Trust Deficit". According to the International Labour Organization (ILO), over 85% of employment in Africa is informal. Formalizing this via digital escrow acts as a profound economic catalyst. Escrow mathematics rely on finite state machines: a transaction exists in strict states (PENDING, HELD, RELEASED, REFUNDED). By mathematically preventing a `RELEASED` state if a `DISPUTED` flag is active, software can mechanically enforce trust where social structures fail.
