# Deliverable 5: AI & Intelligence Layer Design

## Overview
This platform utilizes a 100% **Groq-only AI architecture**. Groq handles both embeddings and LLM inference, ensuring ultra-fast responses (sub-200ms) with zero OpenAI dependency.

## 1. Semantic Search Pipeline (100% Groq)

### Step 1: Smart Query Understanding (Groq LLM)
- **Model:** `llama-3.3-70b-versatile` via Groq
- **Process:** Customer enters raw text. LLM extracts intent.
- **Output (JSON):**
  ```json
  {
    "service_type": "Plumbing",
    "specific_issue": "Toilet leak",
    "urgency": "medium",
    "search_query": "plumber toilet leak repair"
  }
  ```

### Step 2: Embedding Generation (Groq Embeddings)
- **Model:** Groq embedding model
- **Process:** The `search_query` from Step 1 is embedded into a vector.
- **Storage:** Stored in PostgreSQL using the `pgvector` extension with HNSW indexing.

### Step 3: Composite Ranking
- **Formula:** `Final Score = (0.40 × Semantic) + (0.30 × Distance) + (0.20 × Rating) + (0.10 × Verification)`
- **Tools:** `pgvector` for Semantic, Mapbox Distance API for Distance.

### Step 4: Results Summary (Groq LLM)
- **Process:** Generates a conversational summary of top results.
- **Example:** "Found 5 verified plumbers near you. Kwame A. is the closest (1.2km) and highly rated."

## 2. Groq-Powered Smart Features

| Feature | Trigger | Model | Output |
|---------|---------|-------|--------|
| **Query Understanding** | Search initiated | `llama-3.3-70b` | JSON with intent, urgency, keywords |
| **Profile Bio Generator** | Artisan edits profile | `llama-3.3-70b` | Polished, professional bio text |
| **Review Sentiment** | Customer submits review | `llama-3.3-70b` | Sentiment enum (positive/neutral/negative) |
| **Request Clarification** | Customer creates request | `llama-3.3-70b` | Clear, detailed request description |
| **Card OCR (Vision)** | Artisan uploads ID | Groq Vision (e.g. LLaVA)| Extracted name, DOB, ID number |
| **Dispute Summary** | Admin opens dispute | `llama-3.3-70b` | Concise case summary based on chat history |

## 3. Fallbacks and Reliability
- **Rate Limits:** Groq free tier limit is 30 requests/min.
- **Caching:** Cache repeated search intents (TTL 1hr).
- **Graceful Degradation:** If Groq LLM is down, fallback to keyword search using PostgreSQL `tsvector` / ILIKE.
