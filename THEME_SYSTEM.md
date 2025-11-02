# Theme System Documentation ✅ WORKING

## Overview
The Hummusery application now has a fully functional light/dark theme system with user preference persistence.

## Features

### 🎨 Theme Options
- **Light Theme**: Clean, bright interface with white backgrounds
- **Dark Theme**: Easy on the eyes with dark backgrounds (default)

### 💾 Persistence
- **Logged-in Users**: Theme preference saved to database and synced across devices
- **Guest Users**: Theme preference saved to localStorage
- **Auto-restore**: Theme preference restored on page reload/revisit

### 🔄 Theme Switching
- **Settings Page**: Full theme selector with descriptions
- **Navbar Toggle**: Quick theme toggle button (sun/moon icon)
- **Smooth Transitions**: CSS transitions for seamless theme changes

## Implementation Details

### Files Created/Modified

#### New Files:
- `src/app/context/ThemeContext.tsx` - Theme state management
- `src/app/components/ThemeSelector.tsx` - Theme selection component
- `src/app/api/user/theme/route.ts` - API for theme persistence

#### Modified Files:
- `src/app/layout.tsx` - Added ThemeProvider
- `src/app/globals.css` - Added theme CSS variables
- `src/app/db/models/User.ts` - Added theme field
- `src/app/context/AuthContext.tsx` - Added theme to user type
- `src/app/settings/page.tsx` - Added theme selector
- `src/app/components/Navbar.tsx` - Made theme-aware + added toggle

### CSS Variables
The theme system uses CSS custom properties for consistent theming:

```css
/* Light Theme */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --card-bg: #f8fafc;
  --card-border: #e2e8f0;
  /* ... */
}

/* Dark Theme */
:root.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card-bg: #1e293b;
  --card-border: #334155;
  /* ... */
}
```

### Theme Context API

```typescript
const { theme, setTheme, toggleTheme, loading } = useTheme();

// Set specific theme
setTheme("light" | "dark");

// Toggle between themes
toggleTheme();

// Current theme
console.log(theme); // "light" | "dark"
```

## Usage Examples

### Using Theme in Components
```tsx
import { useTheme } from "@/app/context/ThemeContext";

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div className={`
      bg-white dark:bg-gray-900 
      text-gray-900 dark:text-white
      border-gray-200 dark:border-gray-700
    `}>
      Current theme: {theme}
    </div>
  );
}
```

### Tailwind Classes
Use Tailwind's dark mode classes:
- `bg-white dark:bg-gray-900` - Background colors
- `text-gray-900 dark:text-white` - Text colors
- `border-gray-200 dark:border-gray-700` - Border colors

## API Endpoints

### GET /api/user/theme
Fetch user's theme preference (requires authentication)

**Response:**
```json
{
  "success": true,
  "theme": "dark"
}
```

### PATCH /api/user/theme
Update user's theme preference (requires authentication)

**Request:**
```json
{
  "theme": "light"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Theme updated successfully",
  "theme": "light"
}
```

## Database Schema

The `users` collection now includes an optional `theme` field:

```typescript
interface User {
  // ... existing fields
  theme?: "light" | "dark";
}
```

## Browser Support
- Modern browsers with CSS custom properties support
- Graceful fallback to dark theme for older browsers
- localStorage support for guest users

## Performance
- CSS transitions for smooth theme switching
- Minimal JavaScript overhead
- Efficient re-renders using React context