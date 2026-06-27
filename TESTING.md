# QA & Testing Guide

This document tracks features that require manual testing or specific setup steps before they can be verified.

## Pending Tests

### 1. Admin Verification Workflow
**Description:** Workflow where an Admin reviews an Artisan's uploaded identity documents and verifies them, granting them a "verified" badge across the platform.

**Testing Steps:**
1. Log in as an Artisan account that is currently unverified.
2. Ensure you have submitted identity verification documents in your profile settings.
3. Log out and log back in as an **Admin** user (or change your `role` to `ADMIN` directly in the database).
4. Navigate to the Admin Dashboard > **Users** (`/admin/users`) or **Verification** (`/admin/verification`).
5. Approve the pending identity verification for the Artisan.
6. Verify that the Artisan now has a blue checkmark badge next to their name in the Admin Users list.
7. Log out and go to the public Artisan Directory (`/artisans`). Verify the blue checkmark appears on their public card and profile.

---

### 2. Artisan Directory & Public Profiles
**Description:** The public-facing discovery portal where users search for and view artisans.

**Testing Steps:**
1. Navigate to `http://localhost:3000/artisans` as an unauthenticated user or customer.
2. Verify that a grid of Artisans is displayed with their names, professions, and ratings.
3. Use the search bar to search for a specific artisan or profession (e.g., "Plumber").
4. Verify the empty state appears beautifully if no results match the search query.
5. Click on an Artisan's card to view their Public Profile (`/artisans/[id]`).
6. Verify that the following tabs/sections render correctly:
   - **About:** Displays their bio.
   - **Services & Pricing:** Displays the specific services they offer and price ranges.
   - **Portfolio:** Displays images of their past work in a gallery format.
   - **Reviews:** Displays customer reviews, ratings, and avatars.

---

### 4. AI Intelligent Matching (Gemini API) & Unified Search
**Description:** A natural language processing tool that takes unstructured problem descriptions from the user, uses Google Gemini to extract the required service category and urgency, and finds the best matching Artisans.

**Prerequisites Before Testing:**
Ensure your `GEMINI_API_KEY` is set in the `.env` file!

**Testing Steps:**
1. Navigate to the Artisan Directory (`/artisans`).
2. In the main search bar, type a messy problem description instead of a keyword. Example: *"My ceiling fan fell down and wires are sparking in Osu."*
3. Click the new **"✨ Ask AI"** button (instead of the normal "Search" button).
4. Verify you are immediately redirected to `/match?prompt=...` and that the page begins "Analyzing Request" automatically.
5. Verify that Gemini extracts the following correctly:
   - Profession: **Electrician**
   - Urgency: **CRITICAL** or **HIGH**
   - Location: **Osu**
6. Verify that the system queries the database and displays Artisans whose services match the extracted profession.
7. Click **Select** on one of the recommended Artisans.
8. Verify you are redirected to the Request form (`/dashboard/requests/new`) and that the artisan, title, description, and location are all perfectly pre-filled.

---

### 5. Location-Aware Discovery (Mapbox)
**Description:** Interactive map integration allowing customers to visualize artisan locations across the city.

**Prerequisites Before Testing:**
Ensure your `NEXT_PUBLIC_MAPBOX_TOKEN` is set in the `.env` file. (Currently, it is set!)

**Testing Steps:**
1. Navigate to the Artisan Directory (`/artisans`).
2. Verify the new toggle switch ("Grid" / "Map") appears next to the search bar.
3. Click **Map**.
4. Verify the page transitions to a large interactive Mapbox interface centered on Accra.
5. Verify that artisans in the database who have `latitude` and `longitude` set appear as markers (pins) on the map.
6. Click on a marker.
7. Verify a popup card opens containing the artisan's name, rating, services, and a "View Profile" button.
8. Click "View Profile" inside the popup and ensure it correctly links to their public profile.
9. Click **Grid** on the toggle to switch seamlessly back to the card grid.

---

### 6. Email Notifications (Resend)
**Description:** Asynchronous transactional emails sent via the Resend API to keep users engaged and informed.

**Prerequisites Before Testing:**
Ensure `RESEND_API_KEY` is set in the `.env` file. Since we are using the test domain, emails can only be delivered to the verified email address attached to the Resend account.

**Testing Steps:**
1. **Welcome Emails:** 
   - Sign up as a new Customer. Check your inbox for a "Welcome to ArtisanConnect" email containing a link to find artisans.
   - Sign up as a new Artisan. Check your inbox for an "Action Required: Verify your ArtisanConnect Account" email reminding you to upload your Ghana Card.
2. **New Request Email:**
   - Log in as a Customer and request a service from an Artisan.
   - Check the inbox for the email: "New Request from [Customer]: [Job Title]" reminding the artisan to view the request.
3. **Status Update Email:**
   - Log in as the Artisan and change the request status (e.g., to `ACCEPTED`).
   - Check the inbox for the email: "Update on your request: [Job Title]" notifying the Customer of the status change.
4. **Database Audit Log:**
   - Open your Supabase Dashboard or database client.
   - Check the `EmailLog` table.
   - Verify that all sent emails have a row with `status: 'SENT'` and the corresponding template name (e.g., `CUSTOMER_WELCOME`, `NEW_REQUEST`).
### 3. Service Requests & Real-Time Chat
**Description:** End-to-end workflow where a Customer requests a service from an Artisan, they manage the request status, and communicate via a real-time websocket chat.

**Prerequisites Before Testing:**
You MUST enable Supabase Realtime for the `Message` table so that chat messages are instantly pushed to the frontend without a page refresh.
1. Go to your Supabase Dashboard SQL Editor.
2. Run the following command:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE "Message";
   ```

**Testing Steps:**
1. Log in as a Customer.
2. Navigate to the Artisan Directory (`/artisans`) and click on an Artisan's profile.
3. Click **Request Service**. Ensure the artisan is pre-selected in the dropdown.
4. Fill out the request form and submit.
5. In the new Request Details page, send a message in the chat.
6. Open a new incognito window, log in as the Artisan, and navigate to the same request.
7. Verify that messages sent by either party appear instantly on the other screen.
8. As the Artisan, test changing the Request Status (e.g., from `PENDING` to `ACCEPTED`, then `IN_PROGRESS`). Verify the Customer sees these status changes.

---

### 7. Escrow Payments & AI Dispute Resolution
**Description:** Testing the end-to-end financial transaction lifecycle where customers pay an artisan via simulated Escrow, and testing the AI-assisted admin dispute mechanism when things go wrong.

**Testing Steps:**
1. Log in as an Artisan, go to `/dashboard/requests`, and find a `PENDING` request.
2. Click **"Send Quote"** and submit a GHS amount for the job.
3. Log out, and log in as the Customer who owns the request. Navigate to the request page.
4. Review the quote and click **"Accept & Pay"**. Ensure the request transitions successfully to `IN_PROGRESS` and the quote status updates to `ACCEPTED`.
5. At this point, click **"File a Dispute"**, provide a reason, and submit it. Verify the banner indicates funds are frozen in Escrow (`DISPUTED`).
6. Log out and log in as an Admin user.
7. Navigate to `/dashboard/admin/disputes`. Verify the dispute is listed.
8. Click into the dispute and hit **"Generate Summary"**.
9. Verify that Gemini 1.5 Flash correctly reads the chat logs and generates an unbiased summary of the dispute.
10. Finalize the dispute by choosing **"Refund Customer"** or **"Release to Artisan"** and verify that the Escrow Payment status transitions correctly (`REFUNDED` or `RELEASED`).
