-- Drop existing tables if they exist
DROP TABLE IF EXISTS "public"."restaurant_profiles" CASCADE;
DROP TABLE IF EXISTS "public"."organization_members" CASCADE;
DROP TABLE IF EXISTS "public"."organizations" CASCADE;
DROP TYPE IF EXISTS "public"."MemberRole" CASCADE;

-- Create enum types
CREATE TYPE "public"."MemberRole" AS ENUM ('owner', 'courier');

-- Create tables
CREATE TABLE "public"."organizations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."organization_members" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."MemberRole" NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "organization_members_organization_id_user_id_key" UNIQUE ("organization_id", "user_id"),
    CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE
);

CREATE TABLE "public"."restaurant_profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "organization_id" UUID NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "settings" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "restaurant_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "restaurant_profiles_organization_id_key" UNIQUE ("organization_id"),
    CONSTRAINT "restaurant_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organization_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."restaurant_profiles" ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON "public"."organizations" TO authenticated;
GRANT ALL ON "public"."organization_members" TO authenticated;
GRANT ALL ON "public"."restaurant_profiles" TO authenticated;

-- Add RLS policies
CREATE POLICY "Users can view their own memberships"
ON "public"."organization_members" FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can view organizations they are members of"
ON "public"."organizations" FOR ALL
TO authenticated
USING (
    id IN (
        SELECT organization_id 
        FROM "public"."organization_members" 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view restaurant profiles of their organizations"
ON "public"."restaurant_profiles" FOR ALL
TO authenticated
USING (
    organization_id IN (
        SELECT organization_id 
        FROM "public"."organization_members" 
        WHERE user_id = auth.uid()
    )
); 