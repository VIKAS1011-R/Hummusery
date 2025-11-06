# Hummusery - Production Deployment Guide

## 🚀 Production Checklist

### Environment Setup
- [ ] Set up production MongoDB database
- [ ] Configure environment variables in `.env.production`
- [ ] Set up Razorpay production keys
- [ ] Configure SMTP for email services
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS

### Security Configuration
- [ ] Generate strong JWT secret (minimum 32 characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Review and test all API endpoints
- [ ] Ensure no debug endpoints are accessible

### Performance Optimization
- [ ] Enable compression in reverse proxy
- [ ] Set up CDN for static assets
- [ ] Configure database connection pooling
- [ ] Set up monitoring and logging
- [ ] Configure caching strategies

## 📋 Required Environment Variables

```bash
NODE_ENV=production
DATABASE_URL=mongodb://your-production-db
JWT_SECRET=your-super-secure-jwt-secret
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com
```

## 🔧 Deployment Commands

```bash
# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start production server
npm start

# Health check
npm run health-check
```

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Monitor database connections
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor payment processing
- Track user authentication flows

## 🔒 Security Features Enabled

- HTTPS enforcement
- Security headers (HSTS, CSP, etc.)
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- XSS protection

## 🚨 Emergency Procedures

### Database Issues
1. Check connection health: `GET /api/health`
2. Review connection logs
3. Verify environment variables
4. Check MongoDB Atlas/server status

### Payment Issues
1. Verify Razorpay configuration
2. Check webhook endpoints
3. Review payment logs
4. Contact Razorpay support if needed

### Application Errors
1. Check application logs
2. Verify all environment variables
3. Test database connectivity
4. Review recent deployments

## 📈 Performance Monitoring

- Database query performance
- API response times
- Memory usage
- CPU utilization
- Error rates
- User session metrics

## 🔄 Backup Strategy

- Daily database backups
- Configuration backups
- Code repository backups
- Environment variable backups (encrypted)

## 📞 Support Contacts

- Technical Lead: [Your Contact]
- Database Admin: [Your Contact]
- DevOps Team: [Your Contact]
- Payment Support: Razorpay Support