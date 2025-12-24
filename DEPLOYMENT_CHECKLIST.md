# Vercel Deployment Checklist

## Pre-Deployment

- [ ] All code is committed and pushed to your Git repository
- [ ] Environment variables are documented in `.env.example`
- [ ] Build runs successfully locally (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] All tests pass (if applicable)
- [ ] No console errors in production build

## Vercel Setup

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Project imported in Vercel dashboard
- [ ] Framework preset set to "Vite" (auto-detected)

## Environment Variables

Configure these in Vercel Project Settings → Environment Variables:

### Required

- [ ] `VITE_API_URL` - Backend API URL
  - Example: `https://api.yourdomain.com/api`
  - Set for: Production, Preview, Development

### Optional

- [ ] `VITE_ENV` - Environment identifier
  - Production: `production`
  - Preview: `staging`
  - Development: `development`

## Build Configuration

Verify in Vercel Project Settings → Build & Development Settings:

- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Node Version: 18.x or higher (recommended)

## Domain Configuration

- [ ] Custom domain added (if applicable)
- [ ] DNS records configured
- [ ] SSL certificate active (automatic with Vercel)

## Post-Deployment

- [ ] Deployment successful (check Vercel dashboard)
- [ ] Production URL accessible
- [ ] All routes work correctly (SPA routing)
- [ ] API connections working
- [ ] Authentication flows tested
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified
- [ ] Performance metrics reviewed

## Monitoring

- [ ] Analytics enabled in Vercel
- [ ] Error tracking configured (optional: Sentry, etc.)
- [ ] Performance monitoring active

## Continuous Deployment

- [ ] Auto-deploy on push to `main` branch enabled
- [ ] Preview deployments for PRs enabled
- [ ] Deployment notifications configured (Slack, email, etc.)

## Rollback Plan

- [ ] Know how to rollback to previous deployment
  - Go to Deployments → Select previous deployment → Promote to Production
- [ ] Have backup of environment variables

## Security

- [ ] Environment variables contain no sensitive data in code
- [ ] API keys are in Vercel environment variables only
- [ ] CORS configured correctly on backend
- [ ] Authentication tokens handled securely

## Performance

- [ ] Images optimized
- [ ] Code splitting configured (Vite default)
- [ ] Lazy loading implemented where appropriate
- [ ] Bundle size reviewed

## Documentation

- [ ] README updated with deployment info
- [ ] Team members have access to Vercel project
- [ ] Deployment process documented

---

## Quick Commands

```bash
# Test build locally
npm run build && npm run preview

# Check for type errors
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Verify all dependencies are in `package.json`
4. Check Node version compatibility

### Routes Return 404

1. Verify `vercel.json` exists in root
2. Check rewrites configuration
3. Clear Vercel cache and redeploy

### Environment Variables Not Working

1. Ensure variables are prefixed with `VITE_`
2. Redeploy after adding variables
3. Check variable names (case-sensitive)

### Slow Performance

1. Review bundle size
2. Enable compression (automatic in Vercel)
3. Implement code splitting
4. Optimize images

---

**Last Updated:** December 2024
