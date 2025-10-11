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
- 📋 Dynamic menu system with MongoDB integration
- 🔍 Menu filtering and search functionality

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

### Menu Management
- `GET /api/menu` - Get all menu items (supports query params: includeUnavailable, category, vegOnly)
- `POST /api/menu` - Create new menu item
- `GET /api/menu/[id]` - Get specific menu item
- `PATCH /api/menu/[id]` - Update menu item
- `DELETE /api/menu/[id]` - Delete menu item
- `POST /api/menu/seed` - Seed database with sample menu items

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
│   │   │   ├── menu/             # Menu management endpoints
│   │   │   └── hello/            # Example endpoint
│   │   ├── components/           # Reusable components
│   │   │   ├── OrderCard.tsx     # Order display component
│   │   │   ├── Navbar.tsx        # Navigation component
│   │   │   └── ...               # Other components
│   │   ├── context/              # React contexts
│   │   │   ├── AuthContext.tsx   # Authentication context
│   │   │   └── ToastContext.tsx  # Toast notifications
│   │   ├── db/                   # Database layer
│   │   │   ├── models/           # Data models (User, MenuItem)
│   │   │   ├── services/         # Database services
│   │   │   └── seeds/            # Database seeding scripts
│   │   ├── login/                # Login page
│   │   ├── signup/               # Registration page
│   │   ├── settings/             # User settings
│   │   ├── menu/                 # Menu browsing page
│   │   ├── contact/              # Contact page
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

## Menu System

The application features a comprehensive menu management system:

### User Menu Experience (`/menu`)
- **Dynamic Menu Display**: Fetches menu items from MongoDB in real-time
- **Advanced Filtering**: Filter by category, vegetarian/non-vegetarian, or search by name/ingredients
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Category Organization**: Items grouped by categories (Grab-and-Go Treats, Shawarma Combos, Indian Combos, etc.)
- **Visual Indicators**: Clear veg/non-veg symbols and availability status
- **Price Display**: Formatted in INR with proper localization

### Homepage Menu Section
- **Featured Items**: Shows first 4 menu items as signature dishes
- **Dynamic Loading**: Fetches from database with loading states
- **Fallback Handling**: Graceful error handling if API fails
- **Call-to-Action**: "View Full Menu" button linking to complete menu page

### Admin Menu Management
- **Add New Items**: Comprehensive form with validation
- **Edit Items**: Full editing capability with pre-populated forms
- **Delete Items**: Safe deletion with confirmation prompts
- **Visual Management**: Card-based layout with edit/delete options
- **Real-time Updates**: Instant reflection of changes
- **Category Management**: Organized by food categories
- **Availability Control**: Toggle item availability for customers

## Admin Access Control

The application now implements proper role-based access control for admin functionality:

### Security Features
- **Role-based Authentication**: Only users with `role: "admin"` can access admin routes
- **Multiple Protection Layers**:
  - Middleware-level route protection (`middleware.ts`)
  - Component-level role checking in admin pages
  - UI elements hidden for non-admin users
- **JWT Token Validation**: Admin role verified in JWT tokens
- **Automatic Redirects**: Non-admin users redirected to home page

### Admin User Creation
To create an admin user, use the API endpoint:
```bash
POST /api/admin/create
```

Default admin credentials (change after first login):
- **Email**: `admin@hummusery.com`
- **Password**: `admin123`
- **Role**: `admin`

### Access Behavior
- **Regular Users**: Cannot see admin links in navigation
- **Admin Users**: See admin panel link in both desktop and mobile navigation
- **Unauthorized Access**: Automatic redirect with error message
- **Route Protection**: `/admin/*` routes protected at middleware level## Menu 
Categories

The application now uses specialized restaurant categories:

### Available Categories
1. **Grab-and-Go Treats** - Quick snacks and light bites
2. **Shawarma Combos** - Traditional shawarma meals with sides
3. **Indian Combos** - Indian-style combination meals
4. **The Grand Feast** - Premium large portion meals
5. **Rice And Noodles Bowls** - Rice and noodle-based dishes
6. **Veg Rolls** - Vegetarian roll options
7. **Chicken Rolls** - Chicken-based roll varieties
8. **Chinese Veg Rolls** - Chinese-style vegetarian rolls
9. **Chinese Chicken Rolls** - Chinese-style chicken rolls

### Category Features
- **Smart Emojis**: Each category has appropriate emoji representations
- **Filtering**: Users can filter menu by category on the menu page
- **Admin Management**: Categories available in admin panel for new items
- **Responsive Display**: Categories organize menu items for better browsing##
 Database Management

### Menu Items Management
- **Add Items**: Use admin panel or `POST /api/menu` endpoint
- **Edit Items**: Full CRUD operations via admin interface
- **Delete Items**: Individual item deletion with confirmation
- **Clear All**: Use `DELETE /api/menu/clear` to remove all menu items
- **Seed Data**: Use `POST /api/menu/seed` to populate with sample items

### Data Flow
1. **Fresh Start**: Database starts empty, no sample items
2. **Admin Control**: All menu items managed through admin panel
3. **Real-time Updates**: Changes immediately visible to users
4. **Persistent Storage**: All data stored in MongoDB database## C
ontact Page

The application features a dedicated contact page for customer inquiries:

### Contact Page Features (`/contact`)
- **Professional Layout**: Clean, dedicated page for contact information
- **Contact Information**: Complete business details including:
  - Physical address with clear location
  - Phone number with availability hours
  - Email address with response time expectations
  - Business hours for each day of the week
- **Interactive Contact Form**: Full-featured form with:
  - Name, email, and message fields
  - Form validation and required field indicators
  - Loading states during submission
  - Success confirmation messages
  - Professional styling with focus states
- **Responsive Design**: Optimized for all device sizes
- **SEO Optimized**: Proper metadata and page structure

### Navigation
- **Navbar Integration**: "Contact Us" link navigates to dedicated page
- **No Scroll Issues**: Eliminates all hash navigation and scroll positioning problems
- **Clean URLs**: Simple `/contact` route for easy sharing and bookmarking
- **Consistent Experience**: Same navigation behavior across all pages