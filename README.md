# RecapAnytime

RecapAnytime turns a user’s exported TikTok data into an interactive, developer-style recap slide deck, including a printable, thermal-styled Receiptify recap receipt.

---

## Technical Stack

- **Monorepo**: npm workspaces
- **Frontend**: Next.js App Router, Tailwind CSS, Framer Motion, Lucide icons (deployed on Vercel)
- **Backend**: Node.js, Express, Multer, Prisma, Zod, JSZip (deployed on Render)
- **Database**: PostgreSQL (Prisma)

---

## Directory Structure

```text
RecapAnytime/
  apps/
    web/             # Next.js App Router Frontend
    api/             # Express API Backend
  packages/
    shared/          # Common types shared across frontend/backend
  package.json       # Monorepo packages root script
  README.md
```

---

## Local Development Setup

### 1. Install dependencies

From the root directory:
```bash
npm install
```

### 2. Compile shared package

```bash
npm run build
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory:
```env
PORT=4000
DATABASE_URL=postgresql://user:password@host:port/database
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
MAX_UPLOAD_MB=50
DELETE_TOKEN_SECRET=change_this_secret
NODE_ENV=development
```

For frontend settings:
Configure a local `.env.local` or root `.env`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup (Prisma)

Run migrations to setup PostgreSQL database tables:
```bash
cd apps/api
npx prisma db push
npx prisma generate
```

### 5. Running the Application

Start the API backend (runs on port `4000` by default):
```bash
npm run dev:api
```

In a new terminal, start the Next.js frontend (runs on port `3000` by default):
```bash
npm run dev:web
```

---

## Simulation and Testing

To test the parser's capabilities against large data volumes, you can generate a simulated user data export:

```bash
# Generate simulated export JSON containing 5,000 items
npm run dummy-data -- 5000
```

This creates a valid `dummy_tiktok_data.json` inside `apps/api/` representing:
- Watch logs
- TikTok Shop transactions
- Profile configurations
- Comments and searches

You can upload this generated file directly to the `/upload` endpoint to test parsing!

---

## Deployment instructions

### Render Backend Web Service
- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm run start`

### Vercel Frontend
- **Root Directory**: `apps/web`
- **Framework Preset**: `Next.js`
- Set `NEXT_PUBLIC_API_BASE_URL` pointing to your Render service address.
