# Deployment Guide

This application is designed to automatically detect the correct URL in any deployment environment.

## Environment Variables for Production

### Required Environment Variables
```env
# Database
DATABASE_URL=mongodb+srv://admin:hummusery@your-cluster.mongodb.net/Hummusery_Data?retryWrites=true&w=majority

# JWT Secret (generate a new one for production)
JWT_SECRET=your-production-jwt-secret-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key
```

### Optional Environment Variables
```env
# Only set if automatic URL detection doesn't work
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

**Automatic URL Detection:** ✅ Works automatically using `VERCEL_URL`

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `.next`

**Automatic URL Detection:** ✅ Works automatically using `URL`

### Railway
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically

**Automatic URL Detection:** ✅ Works automatically using `RAILWAY_STATIC_URL`

### Heroku
1. Create a Heroku app
2. Add environment variables using `heroku config:set`
3. Deploy using Git or GitHub integration

**Automatic URL Detection:** ⚠️ Requires manual configuration of `NEXT_PUBLIC_APP_URL`

### Custom Server
For custom deployments, set the `NEXT_PUBLIC_APP_URL` environment variable:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## URL Detection Priority

The application automatically detects URLs in this order:

1. **Browser Environment:** Uses `window.location.origin`
2. **Vercel:** Uses `VERCEL_URL` environment variable
3. **Netlify:** Uses `URL` environment variable
4. **Custom:** Uses `NEXT_PUBLIC_APP_URL` environment variable
5. **Railway:** Uses `RAILWAY_STATIC_URL` environment variable
6. **Development:** Falls back to `http://localhost:3000`

## Testing Deployment

After deployment, test these features:
- [ ] Email verification links work correctly
- [ ] Password reset links work correctly
- [ ] Payment redirects work correctly
- [ ] All email templates show correct URLs

## Security Notes

### Production Checklist
- [ ] Use production MongoDB Atlas cluster
- [ ] Generate new JWT_SECRET for production
- [ ] Use Razorpay live keys (not test keys)
- [ ] Set up proper email service (Gmail with app password)
- [ ] Configure MongoDB Atlas IP whitelist for production
- [ ] Test all email flows in production environment

### Environment Variables Security
- Never commit `.env` files to version control
- Use your deployment platform's environment variable management
- Rotate secrets regularly
- Use different secrets for staging and production