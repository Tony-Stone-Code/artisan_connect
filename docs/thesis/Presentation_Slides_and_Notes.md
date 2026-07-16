# ARTISANCONNECT: FINAL YEAR PROJECT PRESENTATION

*This document outlines the slide structure for your PowerPoint presentation, alongside the exact speaker notes you should use during your defense.*

---

## Slide 1: Title Slide
**Visual:** 
*   Project Title: "ArtisanConnect: An AI-Powered, Trust-Centric Digital Marketplace for the Ghanaian Informal Sector"
*   Your Name & Student ID
*   Institution: Ghana Communication Technology University (GCTU)
*   Department of Computer Science / IT
*   Date

**Speaker Notes:**
> "Good morning, Mr. Chairman, panel of examiners, and fellow students. My name is [Your Name]. Today, I am proud to present my final year project titled 'ArtisanConnect,' a digital marketplace designed specifically to formalize and secure the informal artisanal sector here in Ghana."

---

## Slide 2: The Problem Statement
**Visual:** 
*   Bullet points: 
    *   80% of Ghana's workforce is in the informal sector.
    *   High "Trust Deficit" between consumers and artisans.
    *   Prepayment Scams vs. Uncompensated Labor.
    *   Limitations of current platforms (e.g., Jiji Ghana): Open directories, no escrow, no dispute management.

**Speaker Notes:**
> "The informal sector is the backbone of Ghana’s economy, employing over 80% of the workforce. However, hiring an artisan like a plumber or carpenter today is highly inefficient. Consumers fear prepayment scams and poor quality work, while artisans fear doing hard manual labor and not getting paid. While platforms like Jiji exist, they are merely open bulletin boards. They don't secure your money, and they don't help you if a dispute arises. This creates a massive 'trust deficit'."

---

## Slide 3: Project Objectives
**Visual:**
*   1. Build an **Escrow Payment System** to secure funds.
*   2. Implement **AI Hybrid Search** to bridge the digital literacy gap.
*   3. Create a **Mobile-First UX** for the Ghanaian demographic.
*   4. Automate **Dispute Resolution** using Large Language Models (LLMs).

**Speaker Notes:**
> "To solve this, the primary objective of ArtisanConnect was to build an institutionally trusted platform. Specifically, I aimed to implement a secure Escrow state machine that locks funds during a job, integrate Google's Gemini AI to understand natural language search queries, and utilize that same AI to automatically summarize chat logs to resolve disputes efficiently."

---

## Slide 4: System Architecture & Tech Stack
**Visual:**
*   Show the High-Level Architecture Diagram (from Chapter 3).
*   Logos: Next.js, Supabase (PostgreSQL), Prisma ORM, Google Gemini AI, TailwindCSS.

**Speaker Notes:**
> "ArtisanConnect was built using a modern, serverless architecture to ensure high performance on mobile networks. The frontend is powered by Next.js 15, while the database relies on Supabase’s PostgreSQL. I utilized Prisma ORM to ensure all database queries were strictly typed and secure against SQL injection. Finally, the application interfaces with the Gemini AI REST API to handle our natural language processing."

---

## Slide 5: Core Feature 1 - The Escrow State Machine
**Visual:**
*   Diagram showing funds moving: `HELD` -> `IN PROGRESS` -> `RELEASED` or `FROZEN`.

**Speaker Notes:**
> "The heart of the trust mechanism is the Escrow State Machine. When a customer accepts a quote, the system simulates securing the funds, marking the database status as 'HELD'. The artisan knows the money is safe, so they begin work. Crucially, the system mathematically restricts the artisan from withdrawing the money until the customer confirms satisfaction, at which point the state transitions to 'RELEASED'."

---

## Slide 6: Core Feature 2 - AI Integration
**Visual:**
*   Screenshot of a colloquial search query ("water leaking from ceiling") returning a "Plumber".
*   Screenshot of the Admin Dashboard showing an AI-generated Dispute Summary.

**Speaker Notes:**
> "To cater to everyday Ghanaians, the platform uses AI Hybrid Search. If a user types 'water leaking from my ceiling,' traditional keyword databases fail because the word 'plumber' isn't there. ArtisanConnect uses Gemini to extract the semantic intent and uses PostgreSQL vector search to find the right artisan. Furthermore, if a job goes wrong, the AI instantly summarizes the chat logs between the user and artisan, allowing admins to resolve disputes in seconds rather than reading hundreds of messages."

---

## Slide 7: Demonstration (Live Demo / Video)
**Visual:**
*   Play a 2-minute pre-recorded video or perform a live walkthrough of the Localhost environment.
*   *Key things to show: The mobile bottom navigation, AI search, accepting a quote (Escrow HELD), and the Admin dispute panel.*

**Speaker Notes:**
> "I will now briefly demonstrate the core workflow of the platform operating within our local development environment..." *(Walk them through the steps)*.

---

## Slide 8: Limitations & Future Work
**Visual:**
*   **Limitations:** Localhost deployment (due to Vercel dynamic server constraints), simulated payments (no live Paystack integration yet).
*   **Future Work:** Native Mobile App (React Native) for offline caching, USSD (*711#) integration for rural access, Live Mobile Money (MoMo) Escrow.

**Speaker Notes:**
> "While the core architectural logic is fully functional, the current scope was limited to a localized environment to simulate the complex state machines without incurring live banking API costs or cloud rendering timeouts. Moving forward, the goal is to integrate the Paystack API for live Mobile Money transactions, and critically, to develop a USSD gateway so artisans without smartphones in rural areas can access the platform."

---

## Slide 9: Conclusion
**Visual:**
*   Summary statement: "Transforming the informal sector through Institutional Trust."
*   "Thank You"
*   "Questions?"

**Speaker Notes:**
> "In conclusion, ArtisanConnect proves that by integrating rigorous Escrow protocols and artificial intelligence, we can replace the risky 'buyer-beware' classifieds with a secure, managed marketplace. This provides a clear blueprint for formalizing and empowering Ghana's blue-collar gig economy. Thank you for your time, I now welcome any questions."
