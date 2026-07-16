# ARTISANCONNECT: THESIS DEFENSE Q&A PREPARATION

*This document contains likely questions the academic panel (lecturers/professors) will ask you during your oral defense, along with the strategic answers you should provide to secure an 'A' grade.*

---

### Category 1: Problem & Relevance

**Q1: Why did you build this when we already have platforms like Jiji, Tonaton, and even Facebook Marketplace?**
**Your Answer:** 
"While Jiji and Facebook Marketplace are excellent for selling physical goods (like a used phone), they are fundamentally flawed for service-based jobs. They operate as open classifieds with a 'buyer-beware' model. They don't hold funds, and they don't arbitrate disputes. If I hire a plumber on Jiji and he demands GHS 200 for materials and runs away, the platform offers no protection. ArtisanConnect is not a classified ad board; it is a *managed marketplace* that introduces Escrow to solve this specific trust deficit."

**Q2: What is the significance of this project to the Ghanaian economy?**
**Your Answer:** 
"Over 80% of Ghana's workforce is in the informal sector. Because of the trust deficit and fear of scams, economic activity is stifled—people delay repairs, and artisans struggle to find consistent work. By providing institutional trust through Escrow and Identity Verification (Ghana Card), this platform provides a blueprint for formalizing the gig economy, protecting consumers, and guaranteeing income for blue-collar workers."

---

### Category 2: Technical Architecture & Choices

**Q3: Why did you choose Next.js and Supabase instead of a simpler stack like PHP/MySQL or WordPress?**
**Your Answer:** 
"A standard CMS like WordPress is entirely inadequate for the complex state-machine logic required by a financial Escrow system. I chose Next.js (App Router) for its highly optimized Server-Side Rendering (SSR), which ensures the app loads fast on mobile networks. I chose Supabase because its underlying PostgreSQL database supports Row Level Security (RLS) out-of-the-box, ensuring users can strictly only access their own financial transactions, which is a mandatory security requirement for this domain."

**Q4: I notice your project relies on simulated payments on localhost rather than a live Paystack/MoMo integration. Why is that? Is the project incomplete?**
**Your Answer:** 
"The project successfully achieved its core academic objective: proving the viability of the Escrow *State Machine*. Integrating live financial APIs requires extensive legal compliance, registered business bank accounts, and incurs per-transaction API fees, which were outside the scope of this academic prototype. Furthermore, running on localhost allowed me to rigorously test the database state transitions without hitting cloud-provider rate limits or dynamic rendering timeouts. The logic to transition from `HELD` to `RELEASED` works perfectly; swapping the simulated ID for a Paystack webhook is a straightforward future enhancement."

**Q5: How does your Escrow system actually work at the database level to prevent fraud?**
**Your Answer:** 
"It relies on strict PostgreSQL ENUM constraints managed by Prisma ORM. When a quote is accepted, the `EscrowPayment` row is created with a strict status of `HELD`. The UI and backend logic mathematically prevent the Artisan from triggering a 'Withdraw' function while the status is `HELD`. It can only transition to `RELEASED` if the Customer's User ID explicitly triggers the confirmation endpoint. If a dispute is filed, it transitions to `FROZEN`, blocking both parties until an Admin intervenes."

---

### Category 3: Artificial Intelligence

**Q6: You mentioned AI. Are you just using a basic chatbot, or how exactly is AI integrated into the system?**
**Your Answer:** 
"The AI is integrated directly into the backend operational logic via the Google Gemini API, not just as a chatbot. It serves two distinct purposes. First, for Hybrid Search: it takes a user's natural language complaint (e.g., 'water leaking') and extracts the semantic intent to query the database using vector embeddings (`pgvector`), matching them to a Plumber without needing exact keyword matches. Second, for Online Dispute Resolution (ODR): it automatically ingests the JSON chat logs of a disputed service and outputs a structured summary of the conflict for the Administrator, drastically reducing manual moderation time."

**Q7: AI can sometimes 'hallucinate' or make mistakes. How do you handle that in dispute resolution?**
**Your Answer:** 
"That is exactly why the AI does not make the final financial decision. The system employs a 'Human-in-the-Loop' architecture. The Gemini AI is only used to *summarize* the chat logs to save the Administrator time reading hundreds of messages. The actual authority to click 'Force Refund' or 'Force Release' remains strictly with the human Administrator, mitigating any risk of AI hallucination."

---

### Category 4: UI/UX and Limitations

**Q8: Why did you design the mobile navigation the way you did (the Bottom Navigation bar)?**
**Your Answer:** 
"I adopted a 'Mobile-First' paradigm because the overwhelming majority of internet access in Ghana is via budget smartphones. I abandoned the traditional 'Hamburger menu' at the top left because it is hard to reach with one hand. Instead, I used a dynamic Bottom Navigation Bar inspired by TikTok, keeping the most critical actions (Home, Search, Profile) within thumb reach to improve accessibility for non-technical demographics."

**Q9: What is the biggest limitation of your current implementation?**
**Your Answer:** 
"Currently, the platform operates as a Web Application requiring continuous internet access. For rural artisans in areas with poor network coverage, this is a barrier. My primary recommendation for future work is integrating a USSD (*711#) gateway, allowing users to query artisan availability and accept quotes via SMS, which would drastically increase the platform's reach across Ghana."
