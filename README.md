# Allo Health Reservation System

A Next.js application implementing a high-concurrency reservation system for medical products across multiple warehouses.

## Features
- **Race Condition Prevention**: Uses pessimistic locking (`SELECT ... FOR UPDATE`) in Postgres to ensure that stock is accurately decremented and no overselling occurs under high concurrency.
- **Data Model**: Supports multiple products and warehouses with a junction table for inventory management.
- **Live Countdown**: A real-time countdown timer on the confirmation page that tracks reservation expiry.
- **Automatic Expiry Logic**: Reservations are set to expire after 15 minutes.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Production Expiry Mechanism
In a production environment, simply setting an `expiresAt` timestamp is not enough. We need a mechanism to release the reserved stock back into the inventory.

### Implementation Strategy
The recommended approach is a **background worker** combined with a **distributed task queue** (e.g., BullMQ with Redis) or a **database-level scheduler** (e.g., `pg_cron`).

1. **Scheduled Job**: A cron job runs every 60 seconds.
2. **Query**: It identifies all `Reservation` records where `status = 'ACTIVE'` and `expiresAt < NOW()`.
3. **Atomic Recovery**: For each expired reservation, the system executes a transaction:
   - Increment the `Inventory.quantity` for the associated `productId` and `warehouseId`.
   - Update the `Reservation.status` to `'EXPIRED'`.
4. **Consistency**: Using a database transaction ensures that stock is never lost or double-counted during recovery.

## How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up a PostgreSQL database and add the connection string to `.env`:
   `DATABASE_URL="postgresql://user:password@localhost:5432/allo_health"`
4. Run migrations and seed data:
   `npx prisma migrate dev --name init`
   `npx prisma db seed`
5. Start the development server: `npm run dev`.
