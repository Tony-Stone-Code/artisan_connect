-- ==============================================================================
-- PHASE 2: SUPABASE PRODUCTION DATABASE HARDENING
-- Row-Level Security (RLS) Isolation & Performance Indexes
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL PRISMA PRODUCTION TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArtisanProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArtisanIdentity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subcategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArtisanService" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortfolioItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AvailabilitySchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EscrowPayment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FavoriteArtisan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiInteraction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailLog" ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. DROP PRE-EXISTING POLICIES TO PREVENT CONFLICTS
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'User', 'CustomerProfile', 'ArtisanProfile', 'AdminProfile', 'ArtisanIdentity',
        'Category', 'Subcategory', 'ArtisanService', 'PortfolioItem', 'AvailabilitySchedule',
        'ServiceRequest', 'Quote', 'EscrowPayment', 'Review', 'Message',
        'FavoriteArtisan', 'Report', 'AuditLog', 'Notification', 'AiInteraction', 'EmailLog'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. POLICIES: PUBLIC CATALOG TABLES (Read-only to public, mutations server/admin)
-- ------------------------------------------------------------------------------

-- Category: Publicly visible to everyone
CREATE POLICY "category_read_all" ON "Category"
  FOR SELECT TO anon, authenticated
  USING (true);

-- Subcategory: Publicly visible to everyone
CREATE POLICY "subcategory_read_all" ON "Subcategory"
  FOR SELECT TO anon, authenticated
  USING (true);

-- ------------------------------------------------------------------------------
-- 4. POLICIES: ARTISAN DISCOVERY (Profiles, Services, Portfolios, Reviews)
-- ------------------------------------------------------------------------------

-- ArtisanProfile: Visible to all prospective customers and visitors
CREATE POLICY "artisan_profile_read_all" ON "ArtisanProfile"
  FOR SELECT TO anon, authenticated
  USING (true);

-- ArtisanProfile: Artisans can update their own profile
CREATE POLICY "artisan_profile_update_owner" ON "ArtisanProfile"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "ArtisanProfile".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "ArtisanProfile".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- ArtisanService: Publicly viewable
CREATE POLICY "artisan_service_read_all" ON "ArtisanService"
  FOR SELECT TO anon, authenticated
  USING (true);

-- ArtisanService: Artisan owner can manage services
CREATE POLICY "artisan_service_modify_owner" ON "ArtisanService"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ArtisanService".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ArtisanService".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- PortfolioItem: Publicly viewable
CREATE POLICY "portfolio_item_read_all" ON "PortfolioItem"
  FOR SELECT TO anon, authenticated
  USING (true);

-- PortfolioItem: Artisan owner can manage portfolio
CREATE POLICY "portfolio_item_modify_owner" ON "PortfolioItem"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "PortfolioItem".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "PortfolioItem".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- AvailabilitySchedule: Publicly viewable
CREATE POLICY "availability_schedule_read_all" ON "AvailabilitySchedule"
  FOR SELECT TO anon, authenticated
  USING (true);

-- AvailabilitySchedule: Artisan owner can manage schedule
CREATE POLICY "availability_schedule_modify_owner" ON "AvailabilitySchedule"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "AvailabilitySchedule".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "AvailabilitySchedule".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- Review: Publicly viewable by everyone
CREATE POLICY "review_read_all" ON "Review"
  FOR SELECT TO anon, authenticated
  USING (true);

-- Review: Verified customers can insert their review
CREATE POLICY "review_insert_customer" ON "Review"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "CustomerProfile" cp
      JOIN "User" u ON u.id = cp.user_id
      WHERE cp.id = "Review".customer_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- ------------------------------------------------------------------------------
-- 5. POLICIES: SENSITIVE PROFILES & IDENTITY VERIFICATION
-- ------------------------------------------------------------------------------

-- User: Users can read their own profile, or admins can view all
CREATE POLICY "user_read_own_or_admin" ON "User"
  FOR SELECT TO authenticated
  USING (
    supabase_uid = (SELECT auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM "User" admin_u
      WHERE admin_u.supabase_uid = (SELECT auth.uid())::text
        AND admin_u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- User: Users can update their own profile
CREATE POLICY "user_update_own" ON "User"
  FOR UPDATE TO authenticated
  USING (supabase_uid = (SELECT auth.uid())::text)
  WITH CHECK (supabase_uid = (SELECT auth.uid())::text);

-- CustomerProfile: Customer can read their own profile, or admins
CREATE POLICY "customer_profile_read_own_or_admin" ON "CustomerProfile"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "CustomerProfile".user_id
        AND (u.supabase_uid = (SELECT auth.uid())::text OR u.role IN ('ADMIN', 'SUPERADMIN'))
    )
  );

-- CustomerProfile: Customer can update own profile
CREATE POLICY "customer_profile_update_own" ON "CustomerProfile"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "CustomerProfile".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "CustomerProfile".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- ArtisanIdentity (GHANA CARD & BIOMETRIC SELFIE - STRICT PRIVACY)
-- Only the artisan owner or an authorized ADMIN can read
CREATE POLICY "artisan_identity_read_restricted" ON "ArtisanIdentity"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ArtisanIdentity".artisan_id
        AND (u.supabase_uid = (SELECT auth.uid())::text OR u.role IN ('ADMIN', 'SUPERADMIN'))
    )
  );

-- Artisan can insert or update their identity submission
CREATE POLICY "artisan_identity_insert_owner" ON "ArtisanIdentity"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ArtisanIdentity".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

CREATE POLICY "artisan_identity_update_owner_or_admin" ON "ArtisanIdentity"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ArtisanIdentity".artisan_id
        AND (u.supabase_uid = (SELECT auth.uid())::text OR u.role IN ('ADMIN', 'SUPERADMIN'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ArtisanIdentity".artisan_id
        AND (u.supabase_uid = (SELECT auth.uid())::text OR u.role IN ('ADMIN', 'SUPERADMIN'))
    )
  );

-- ------------------------------------------------------------------------------
-- 6. POLICIES: REQUESTS, QUOTES & ESCROW PAYMENTS (Financial Isolation)
-- ------------------------------------------------------------------------------

-- ServiceRequest: Only participant customer, artisan, or admin
CREATE POLICY "service_request_read_participants" ON "ServiceRequest"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "CustomerProfile" cp
      JOIN "User" u ON u.id = cp.user_id
      WHERE cp.id = "ServiceRequest".customer_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "ServiceRequest".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- Quote: Only participant customer, quoting artisan, or admin
CREATE POLICY "quote_read_participants" ON "Quote"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ArtisanProfile" ap
      JOIN "User" u ON u.id = ap.user_id
      WHERE ap.id = "Quote".artisan_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "ServiceRequest" sr
      JOIN "CustomerProfile" cp ON cp.id = sr.customer_id
      JOIN "User" u ON u.id = cp.user_id
      WHERE sr.id = "Quote".request_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- EscrowPayment: Strictly customer, artisan, or admin
CREATE POLICY "escrow_payment_read_participants" ON "EscrowPayment"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Quote" q
      JOIN "ServiceRequest" sr ON sr.id = q.request_id
      JOIN "CustomerProfile" cp ON cp.id = sr.customer_id
      JOIN "User" u ON u.id = cp.user_id
      WHERE q.id = "EscrowPayment".quote_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "Quote" q
      JOIN "ArtisanProfile" ap ON ap.id = q.artisan_id
      JOIN "User" u ON u.id = ap.user_id
      WHERE q.id = "EscrowPayment".quote_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- ------------------------------------------------------------------------------
-- 7. POLICIES: MESSAGING, NOTIFICATIONS & FAVORITES
-- ------------------------------------------------------------------------------

-- Message: Only conversation participants (Customer or Artisan on Request)
CREATE POLICY "message_read_participants" ON "Message"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "ServiceRequest" sr
      JOIN "CustomerProfile" cp ON cp.id = sr.customer_id
      JOIN "User" u ON u.id = cp.user_id
      WHERE sr.id = "Message".request_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "ServiceRequest" sr
      JOIN "ArtisanProfile" ap ON ap.id = sr.artisan_id
      JOIN "User" u ON u.id = ap.user_id
      WHERE sr.id = "Message".request_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- Message: Sender can insert
CREATE POLICY "message_insert_sender" ON "Message"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "Message".sender_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- Notification: User can only read and update their own notifications
CREATE POLICY "notification_read_own" ON "Notification"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "Notification".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

CREATE POLICY "notification_update_own" ON "Notification"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "Notification".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "Notification".user_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- FavoriteArtisan: Customer owner only
CREATE POLICY "favorite_artisan_manage_own" ON "FavoriteArtisan"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "CustomerProfile" cp
      JOIN "User" u ON u.id = cp.user_id
      WHERE cp.id = "FavoriteArtisan".customer_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "CustomerProfile" cp
      JOIN "User" u ON u.id = cp.user_id
      WHERE cp.id = "FavoriteArtisan".customer_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

-- ------------------------------------------------------------------------------
-- 8. POLICIES: REPORTS, AUDIT LOGS, ADMIN PRIVILEGES
-- ------------------------------------------------------------------------------

-- Report: Reporter can view their own reports, Admins can view all
CREATE POLICY "report_read_reporter_or_admin" ON "Report"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "Report".reporter_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

CREATE POLICY "report_insert_reporter" ON "Report"
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = "Report".reporter_id
        AND u.supabase_uid = (SELECT auth.uid())::text
    )
  );

CREATE POLICY "report_admin_action" ON "Report"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- AdminProfile: Strictly Admins only
CREATE POLICY "admin_profile_admin_only" ON "AdminProfile"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- AuditLog: Strictly Admins only
CREATE POLICY "audit_log_admin_only" ON "AuditLog"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- AiInteraction & EmailLog: Internal telemetry (No public read, admin view only)
CREATE POLICY "ai_interaction_admin_only" ON "AiInteraction"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );

CREATE POLICY "email_log_admin_only" ON "EmailLog"
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.supabase_uid = (SELECT auth.uid())::text
        AND u.role IN ('ADMIN', 'SUPERADMIN')
    )
  );


-- ==============================================================================
-- 9. PERFORMANCE INDEXES (Based on supabase-postgres-best-practices)
-- ==============================================================================

-- Composite indexes on ServiceRequest
CREATE INDEX IF NOT EXISTS "idx_servicerequest_customer_created"
  ON "ServiceRequest" ("customer_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_servicerequest_artisan_status"
  ON "ServiceRequest" ("artisan_id", "status");

CREATE INDEX IF NOT EXISTS "idx_servicerequest_status_created"
  ON "ServiceRequest" ("status", "created_at" DESC);

-- Composite indexes on Quote
CREATE INDEX IF NOT EXISTS "idx_quote_request_status"
  ON "Quote" ("request_id", "status");

CREATE INDEX IF NOT EXISTS "idx_quote_artisan_created"
  ON "Quote" ("artisan_id", "created_at" DESC);

-- Conversation Message Timeline (ordered by time)
CREATE INDEX IF NOT EXISTS "idx_message_request_created"
  ON "Message" ("request_id", "created_at" ASC);

-- Unread notifications query
CREATE INDEX IF NOT EXISTS "idx_notification_user_unread"
  ON "Notification" ("user_id", "is_read", "created_at" DESC);

-- Artisan directory filtering & ranking
CREATE INDEX IF NOT EXISTS "idx_artisan_discovery"
  ON "ArtisanProfile" ("is_available", "is_verified", "average_rating" DESC);

-- Geo lookup for artisans with coordinates
CREATE INDEX IF NOT EXISTS "idx_artisan_geo"
  ON "ArtisanProfile" ("latitude", "longitude")
  WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL;

-- Reviews aggregation & listing
CREATE INDEX IF NOT EXISTS "idx_review_artisan_rating"
  ON "Review" ("artisan_id", "rating");

-- Admin Dispute / Report Queue
CREATE INDEX IF NOT EXISTS "idx_report_status_created"
  ON "Report" ("status", "created_at" DESC);

-- Audit Log Timeline
CREATE INDEX IF NOT EXISTS "idx_auditlog_created"
  ON "AuditLog" ("created_at" DESC);

-- Fix unindexed foreign keys on legacy prototype tables
CREATE INDEX IF NOT EXISTS "idx_legacy_messages_quote_req" ON "messages" ("quote_request_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_messages_receiver" ON "messages" ("receiver_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_messages_sender" ON "messages" ("sender_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_payments_artisan" ON "payments" ("artisan_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_payments_customer" ON "payments" ("customer_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_payments_quote_req" ON "payments" ("quote_request_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_portfolio_artisan" ON "portfolio_items" ("artisan_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_quote_img_quote_req" ON "quote_images" ("quote_request_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_quote_req_artisan" ON "quote_requests" ("artisan_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_quote_req_customer" ON "quote_requests" ("customer_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_reviews_artisan" ON "reviews" ("artisan_id");
CREATE INDEX IF NOT EXISTS "idx_legacy_reviews_customer" ON "reviews" ("customer_id");
