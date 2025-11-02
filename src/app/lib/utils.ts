/**
 * Get the base URL for the application
 * Automatically detects the correct URL based on environment
 */
export function getBaseUrl(): string {
  // In browser environment, use window.location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In server environment, check various environment variables
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Netlify automatically sets URL
  if (process.env.URL) {
    return process.env.URL;
  }
  
  // Custom environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Railway automatically sets RAILWAY_STATIC_URL
  if (process.env.RAILWAY_STATIC_URL) {
    return `https://${process.env.RAILWAY_STATIC_URL}`;
  }
  
  // Heroku automatically sets the port
  if (process.env.PORT) {
    return `https://your-app-name.herokuapp.com`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
}

/**
 * Get the API base URL
 */
export function getApiUrl(): string {
  return `${getBaseUrl()}/api`;
}

/**
 * Build a full URL from a path
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}