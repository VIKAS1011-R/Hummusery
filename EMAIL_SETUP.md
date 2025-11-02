# Email Verification Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Secret (if not already set)
JWT_SECRET=your-super-secret-jwt-key

# Base URL (for production)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Security → 2-Step Verification
3. Turn on 2-Step Verification

### 2. Generate App Password
1. Go to Google Account → Security
2. 2-Step Verification → App passwords
3. Select "Mail" and your device
4. Copy the generated 16-character password
5. Use this as `EMAIL_PASSWORD` (not your regular Gmail password)

### 3. Alternative Email Providers

#### SendGrid (Recommended for Production)
```bash
# Replace Gmail config with:
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

#### Outlook/Hotmail
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=outlook
```

## Testing Email Service

1. Start your development server
2. Sign up with a new account
3. Check your email for the verification code
4. Test both OTP and fallback link methods

## Production Considerations

1. **Use a dedicated email service** (SendGrid, Mailgun, etc.)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email deliverability**
4. **Set up email templates** in your email service
5. **Configure rate limiting** for email sending

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular password
   - Enable 2-Factor Authentication first

2. **Emails not sending**
   - Check your EMAIL_USER and EMAIL_PASSWORD
   - Verify Gmail "Less secure app access" is not blocking

3. **Emails going to spam**
   - Set up proper DNS records
   - Use a professional email service
   - Include unsubscribe links

4. **Rate limiting**
   - Gmail has sending limits (500 emails/day for free accounts)
   - Consider upgrading to Google Workspace or use SendGrid

## Email Templates

The system includes:
- ✅ OTP verification email with fallback link
- ✅ Welcome email after successful verification
- ✅ Responsive HTML templates
- ✅ Plain text fallbacks
- ✅ Professional branding

## Security Features

- ✅ 6-digit OTP with 10-minute expiration
- ✅ Fallback verification link (24-hour expiration)
- ✅ Rate limiting on resend requests
- ✅ Secure token generation
- ✅ Email verification status tracking