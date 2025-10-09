# Vercel-Ready Next.js Template

A production-ready Next.js template optimized for Vercel deployment with TypeScript, Tailwind CSS, and ESLint.

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 📝 TypeScript for type safety
- 🔍 ESLint for code quality
- 🚀 Vercel deployment optimized
- 📡 API routes included
- 🔐 Authentication system
- 👨‍💼 Admin dashboard for order management
- 🍽️ Restaurant order tracking system

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see your app.

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Orders Management
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get specific order
- `PATCH /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Delete order

### Other
- `GET /api/hello` - Returns a welcome message
- `POST /api/hello` - Accepts and echoes back JSON data

## Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 3: Git Integration
1. Push your code to GitHub
2. Connect your repository at [vercel.com](https://vercel.com)
3. Deploy automatically on every push

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── layout.tsx        # Admin layout
│   │   │   └── page.tsx          # Admin orders page
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── orders/           # Order management endpoints
│   │   │   └── hello/            # Example endpoint
│   │   ├── components/           # Reusable components
│   │   │   ├── OrderCard.tsx     # Order display component
│   │   │   ├── Navbar.tsx        # Navigation component
│   │   │   └── ...               # Other components
│   │   ├── context/              # React contexts
│   │   │   ├── AuthContext.tsx   # Authentication context
│   │   │   └── ToastContext.tsx  # Toast notifications
│   │   ├── login/                # Login page
│   │   ├── signup/               # Registration page
│   │   ├── settings/             # User settings
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
├── public/                       # Static assets
├── middleware.ts                 # Route protection middleware
└── package.json
```

## Environment Variables

Create a `.env.local` file for local development:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, set environment variables in your Vercel dashboard.

## Admin Dashboard

The admin dashboard provides order management functionality for restaurant staff:

### Features
- **Order Overview**: View all current orders with real-time status
- **Order Cards**: Each order displays:
  - Order number and timestamp
  - Customer information
  - Item details with veg/non-veg indicators
  - Total amount in INR (₹)
  - Current status
- **Status Management**: Update order status through dropdown:
  - 🟡 Pending - New orders awaiting preparation
  - 🔵 Preparing - Orders currently being prepared
  - 🟠 Ready for Pickup - Orders ready for customer collection
  - 🟢 Completed - Finished orders

### Access
- Navigate to `/admin` after logging in
- Protected route - requires authentication
- Available in both desktop and mobile navigation

### Order Status Workflow
1. **Pending** → Order received, awaiting kitchen preparation
2. **Preparing** → Kitchen is actively preparing the order
3. **Ready** → Order is complete and ready for customer pickup
4. **Completed** → Order has been collected by customer
