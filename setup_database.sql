-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ARTISAN', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "IdentityStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'QUOTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('HELD', 'RELEASED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('USER', 'REVIEW', 'REQUEST', 'QUOTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT,
    "supabase_uid" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "business_name" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "service_radius_km" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "availability_status" TEXT NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "ArtisanProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_super" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanIdentity" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "ghana_card_no" TEXT,
    "card_image_url" TEXT,
    "selfie_url" TEXT,
    "status" "IdentityStatus" NOT NULL DEFAULT 'PENDING',
    "verified_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "ArtisanIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtisanService" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "subcategory_id" TEXT NOT NULL,
    "description" TEXT,
    "price_min" DECIMAL(10,2),
    "price_max" DECIMAL(10,2),
    "embedding" vector(1024),

    CONSTRAINT "ArtisanService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "before_image_url" TEXT,
    "after_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilitySchedule" (
    "id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AvailabilitySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "preferred_date" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowPayment" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "fee_amount" DECIMAL(10,2) NOT NULL,
    "status" "EscrowStatus" NOT NULL DEFAULT 'HELD',
    "payment_ref" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMP(3),

    CONSTRAINT "EscrowPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "sentiment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteArtisan" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "artisan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteArtisan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_type" "EntityType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "assigned_to" TEXT,
    "ai_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_id" TEXT,
    "target_type" "EntityType",
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInteraction" (
    "id" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "user_id" TEXT,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to_email" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "provider_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebase_uid_key" ON "User"("firebase_uid");
CREATE UNIQUE INDEX "User_supabase_uid_key" ON "User"("supabase_uid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "CustomerProfile_user_id_key" ON "CustomerProfile"("user_id");
CREATE UNIQUE INDEX "ArtisanProfile_user_id_key" ON "ArtisanProfile"("user_id");
CREATE UNIQUE INDEX "AdminProfile_user_id_key" ON "AdminProfile"("user_id");
CREATE UNIQUE INDEX "ArtisanIdentity_artisan_id_key" ON "ArtisanIdentity"("artisan_id");
CREATE UNIQUE INDEX "ArtisanIdentity_ghana_card_no_key" ON "ArtisanIdentity"("ghana_card_no");
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "EscrowPayment_quote_id_key" ON "EscrowPayment"("quote_id");
CREATE UNIQUE INDEX "EscrowPayment_payment_ref_key" ON "EscrowPayment"("payment_ref");
CREATE UNIQUE INDEX "Review_request_id_key" ON "Review"("request_id");
CREATE UNIQUE INDEX "FavoriteArtisan_customer_id_artisan_id_key" ON "FavoriteArtisan"("customer_id", "artisan_id");

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanProfile" ADD CONSTRAINT "ArtisanProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanIdentity" ADD CONSTRAINT "ArtisanIdentity_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanService" ADD CONSTRAINT "ArtisanService_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtisanService" ADD CONSTRAINT "ArtisanService_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySchedule" ADD CONSTRAINT "AvailabilitySchedule_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowPayment" ADD CONSTRAINT "EscrowPayment_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteArtisan" ADD CONSTRAINT "FavoriteArtisan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteArtisan" ADD CONSTRAINT "FavoriteArtisan_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "ArtisanProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "AdminProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "AdminProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
