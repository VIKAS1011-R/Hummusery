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
│   │   ├── cart/                 # Shopping cart page
│   │   ├── orders/               # Order history page
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
- **Consistent Experience**: Same navigation behavior across all pages#

# Shopping Cart System

The application features a comprehensive shopping cart system with persistent storage:

### Cart Features

- **Persistent Storage**: Cart items saved to MongoDB and persist across login sessions
- **User Authentication**: Cart functionality requires user login
- **Real-time Updates**: Cart count and totals update immediately
- **Quantity Management**: Add, update, and remove items with quantity controls

### Cart Functionality (`/cart`)

- **Cart Page**: Dedicated page for cart management
- **Item Display**: Shows item details, quantities, and individual totals
- **Quantity Controls**: Plus/minus buttons to adjust quantities
- **Remove Items**: Individual item removal with confirmation
- **Clear Cart**: Option to clear entire cart
- **Order Summary**: Subtotal, delivery fee, taxes, and total calculation
- **Checkout Ready**: Prepared for checkout integration

### Navigation Integration

- **Cart Icon**: Shopping cart icon in navbar for logged-in users
- **Item Count Badge**: Shows number of items in cart
- **Quick Access**: Click cart icon to navigate to cart page

### Menu Integration

- **Add to Cart**: "Add to Cart" buttons on all menu items
- **Login Prompt**: Non-logged-in users see "Login to Order" button
- **Loading States**: Visual feedback during cart operations
- **Success Messages**: Toast notifications for cart actions

### Technical Implementation

- **Cart Context**: React context for global cart state management
- **Database Model**: MongoDB collection for persistent cart storage
- **API Endpoints**: RESTful API for cart operations (GET, POST, PATCH, DELETE)
- **User Association**: Carts linked to user accounts via userId
- **Automatic Sync**: Cart syncs when user logs in

### Cart Operations

- `GET /api/cart` - Retrieve user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart` - Update item quantity
- `DELETE /api/cart` - Clear entire cart

### User Experience

- **Seamless Integration**: Cart works across all pages
- **Persistent Data**: Items remain in cart between sessions
- **Visual Feedback**: Loading states and success messages
- **Mobile Friendly**: Responsive design for all devices

## Enhanced Menu Cart Integration

### Interactive Menu Features

- **Smart Button States**: Buttons change based on cart status
- **Quantity Controls**: Plus/minus buttons appear when items are in cart
- **Buy Now Functionality**: Direct purchase option for immediate checkout
- **Real-time Cart Status**: Shows "X in cart" for added items
- **Seamless Updates**: Quantity changes update cart immediately

### User Experience Flow

1. **Initial State**: "Add to Cart" button for new items
2. **After Adding**: Quantity controls with current count display
3. **Buy Now**: Green button for direct purchase (adds to cart + redirects)
4. **Quantity Management**: Plus/minus buttons to adjust quantities
5. **Remove Items**: Minus button removes items when quantity reaches 0

### Visual Feedback

- **Loading States**: Disabled buttons during cart operations
- **Color Coding**: Orange for cart actions, green for buy now
- **Count Display**: Clear indication of items in cart
- **Responsive Design**: Works seamlessly on mobile and desktop

## Database Architecture: Hybrid Approach

### Design Decision: Why Separate Cart + Embedded Order History

**Cart Data (Separate Collection):**

- **Rationale**: Carts are temporary, frequently updated, and can be large
- **Benefits**:
  - Better performance (user queries don't load cart data unnecessarily)
  - Scalability (no document size limits for large carts)
  - Separation of concerns (cart operations don't affect user profile)
  - Future flexibility (multiple carts, cart sharing, expiration)

**Order History (Embedded in User Document):**

- **Rationale**: Order history is stable, smaller, and accessed with user profile
- **Benefits**:
  - Single query for user profile + order history
  - Atomic updates for user data
  - Historical data doesn't change frequently
  - Better user experience (profile page shows orders)

### Order History System

**Order History Features (`/orders`):**

- **Complete Order Timeline**: Chronological list of all user orders
- **Order Details**: Items, quantities, prices, and total amounts
- **Status Tracking**: Visual status indicators (pending, preparing, ready, completed, cancelled)
- **Veg/Non-Veg Icons**: Clear dietary indicators for each item
- **Date Formatting**: Localized date and time display
- **Empty States**: Helpful messaging when no orders exist

**User Integration:**

- **Navigation**: "Order History" link in user dropdown menu
- **Authentication**: Protected route requiring user login
- **Real-time Data**: Orders sync when status changes in admin panel

**API Endpoints:**

- `GET /api/orders/history` - Retrieve user's order history
- Automatic order addition when checkout completes
- Status updates sync between admin panel and user history

### Technical Implementation

**User Model Updates:**

```typescript
interface User {
  // ... existing fields
  orderHistory: OrderHistoryItem[];
}

interface OrderHistoryItem {
  orderId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date;
}
```

**UserService Methods:**

- `addOrderToHistory()` - Add completed order to user history
- `getUserOrderHistory()` - Retrieve user's order timeline
- `updateOrderStatusInHistory()` - Sync status changes from admin

### Performance Considerations

**Optimized Queries:**

- Cart operations don't affect user document
- Order history loaded only when needed
- Efficient indexing on userId for both collections
- Projection queries for order history only

**Scalability:**

- Cart collection can handle unlimited items
- Order history has reasonable size limits
- Future-proof for additional features
- Clean separation of concerns

## Restaurant Service Model

### Dine-In Restaurant

The application is designed for a dine-in restaurant service:

**Pricing Structure:**

- **All-Inclusive Pricing**: Menu prices include all applicable taxes
- **No Additional Charges**: No delivery fees, service charges, or hidden costs
- **Transparent Pricing**: What you see is what you pay
- **Dine-In Service**: All orders are for restaurant dining experience

**Cart & Checkout Features:**

- **Simplified Checkout**: No service type selection needed
- **Clear Pricing**: Subtotal equals total amount
- **Restaurant Service**: All orders prepared for dine-in experience
- **Tax-Inclusive**: No additional tax calculations at checkout

**User Experience:**

- **Simple**: Streamlined ordering process for dine-in
- **Transparent**: Clear indication that taxes are included
- **Restaurant Focus**: Messaging emphasizes dine-in experience
- **No Confusion**: Single service type eliminates choice complexity
