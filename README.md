# Delivery Hub - Restaurant Dashboard

## Overview
Delivery Hub is a centralized platform for restaurants to manage and track deliveries from multiple delivery platforms (Takeaway, Deliveroo, UberEats, Menute, etc.) in one unified interface.

## Key Features
- **Unified Order Management**: View and manage orders from multiple delivery platforms in one dashboard
- **Real-time Map Tracking**: 
  - Live visualization of all orders on an interactive map (powered by OpenFreeMap)
  - Real-time courier tracking
  - Order status updates
- **Multi-platform Integration**:
  - Takeaway
  - Deliveroo
  - UberEats
  - Menute
  - More platforms to be added
- **Courier Management**:
  - View active couriers
  - Track courier locations in real-time
  - Monitor delivery status

## Authentication & Onboarding Flow

### Current Implementation
1. **Admin Actions**
   1. **Create Organization** (via SQL or Supabase Table Editor)
      ```sql
      INSERT INTO organizations (id, name, created_at, updated_at)
      VALUES (gen_random_uuid(), 'Restaurant Name', NOW(), NOW());
      ```
   2. **Invite Restaurant Owner** (via Supabase Dashboard)
      - Go to Authentication > Users > Invite users
      - Enter restaurant owner's email
      - System sends invitation email automatically

2. **Restaurant Owner Flow**
   - Owner receives invitation email with magic link
   - Clicking the link redirects to `/sign-up` with access token
   - Creates account and verifies email
   - Completes onboarding process:
     1. Restaurant Details (name, description, logo)
     2. Contact Information
     3. Location (with map preview)
     4. Opening Hours
   - System automatically links user to organization during onboarding

3. **Access Control**
   - Public routes: `/sign-in`, `/sign-up`, `/reset-password`
   - Protected routes require authentication
   - Admin routes (`/admin/*`) require owner role
   - Onboarding can only be completed once

### Future Plans
- [ ] Add public registration request page
  - Restaurant owners can submit request to join platform
  - Admin receives notification
  - Admin can approve/deny request
  - Upon approval, system sends invitation
- [ ] Enhanced onboarding
  - Add delivery radius settings
  - Platform integrations setup
  - Menu management
  - Staff management

## Tech Stack
- Next.js (React framework)
- TypeScript
- NextUI (UI components)
- Tailwind CSS
- Supabase (Auth & Database)
- Prisma (ORM)
- OpenFreeMap (Map integration)

## Development Setup

### Prerequisites
- Node.js 18+
- npm/yarn
- Supabase account

### Environment Variables
Copy `.env.example` to `.env` and fill in:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=your_database_url
```

### Installation
```bash
# Install dependencies
npm install

# Run database migrations
npx supabase db push

# Start development server
npm run dev
```

### Database Migrations
```bash
# Create new migration
npm run db:migration

# Push migrations to database
npm run db:push

# Generate TypeScript types
npm run db:types
```

## Contributing
[Contributing guidelines to be added]

## License
[License information to be added]
