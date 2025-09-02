# Yellorn Frontend Integration Guide 🚀

This guide helps you set up and deploy the Yellorn frontend with your preferred hosting platform.

## 🎯 Quick Start

### Local Development

1. **Start Backend** (in one terminal):
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open**: http://localhost:3000

### Full Stack with Docker

```bash
# Run everything with Docker Compose
docker-compose -f docker-compose.frontend.yml up -d --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 🌐 Deployment Options

### 1. Vercel (Recommended - Free Tier Available)

**Why Vercel?**
- ✅ **Free tier**: 100GB bandwidth/month
- ✅ **Global CDN**: Fast worldwide delivery
- ✅ **Auto deployments**: Deploy on Git push
- ✅ **Custom domains**: Easy domain setup
- ✅ **Environment variables**: Easy config management

**Setup:**
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build:prod`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-api.com/api/v1`
5. Deploy automatically on push

**Cost**: Free for personal use, $20/month for teams

### 2. Netlify (Great Alternative - Free Tier Available)

**Why Netlify?**
- ✅ **Free tier**: 100GB bandwidth/month
- ✅ **Form handling**: Built-in form processing
- ✅ **Edge functions**: Serverless functions at the edge
- ✅ **Split testing**: A/B testing built-in

**Setup:**
1. Connect your GitHub repo to Netlify
2. Build command: `npm run build:prod`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-api.com/api/v1`

**Cost**: Free for personal use, $19/month for teams

### 3. GitHub Pages (Free but Limited)

**Pros:**
- ✅ **Completely free**
- ✅ **GitHub integration**

**Cons:**
- ❌ **No environment variables** (hardcode API URL)
- ❌ **Public repos only** (for free tier)

**Setup:**
```bash
# Build and deploy to gh-pages branch
npm run build:prod
npx gh-pages -d dist
```

### 4. AWS S3 + CloudFront (Scalable)

**Why AWS?**
- ✅ **Highly scalable**: Handle millions of users
- ✅ **Global CDN**: CloudFront for fast delivery
- ✅ **Custom domains**: Route 53 integration

**Setup:**
1. Create S3 bucket with static website hosting
2. Upload `dist/` contents to S3
3. Set up CloudFront distribution
4. Configure custom domain with Route 53

**Cost**: ~$1-5/month for small sites

### 5. Firebase Hosting (Google)

**Why Firebase?**
- ✅ **Fast SSD storage**: Quick content delivery
- ✅ **Global CDN**: Google's infrastructure
- ✅ **SSL certificates**: Automatic HTTPS

**Setup:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Cost**: Free tier available, pay as you scale

## 🔧 Configuration

### Environment Variables

Create `frontend/.env.local`:
```env
# Required
VITE_API_URL=https://your-api-domain.com/api/v1

# Optional
VITE_APP_NAME=Yellorn Universe
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
```

### Custom Domain Setup

**For Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**For Netlify:**
1. Go to Site Settings → Domain management
2. Add custom domain
3. Update DNS records as instructed

## 🚀 Performance Optimization

### Code Splitting
Already configured in `vite.config.ts`:
```javascript
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      three: ['three', '@react-three/fiber', '@react-three/drei'],
      api: ['axios', '@tanstack/react-query'],
    },
  },
},
```

### Caching Strategy
- **Static assets**: 1 year cache (immutable)
- **JSON files**: 1 hour cache
- **HTML**: No cache (for updates)

### Bundle Analysis
```bash
cd frontend
npm run build:prod
npx vite-bundle-analyzer dist
```

## 🔒 Security Considerations

### Content Security Policy
Already configured in `nginx.conf`:
```nginx
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'";
```

### HTTPS Enforcement
- **Vercel/Netlify**: Automatic HTTPS
- **Custom servers**: Use Let's Encrypt

### Environment Variables
- ✅ Use `VITE_` prefix for client-side variables
- ❌ Never expose secrets in frontend code
- ✅ API authentication should be handled by backend

## 📊 Monitoring & Analytics

### Error Tracking
Add error tracking service:
```javascript
// In src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring
Add performance monitoring:
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Analytics
Add analytics service:
```javascript
// Google Analytics 4
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID');
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Included)
- **Automatic testing**: Type check + lint on PR
- **Automatic deployment**: Deploy to Vercel on push
- **Preview deployments**: Preview for PRs

### Custom Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths: [frontend/**]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build:prod
      - name: Deploy to your platform
        run: # Your deployment commands
```

## 💰 Cost Comparison

| Platform | Free Tier | Bandwidth | Custom Domain | Serverless Functions |
|----------|-----------|-----------|---------------|---------------------|
| **Vercel** | ✅ | 100GB/month | ✅ | ✅ |
| **Netlify** | ✅ | 100GB/month | ✅ | ✅ |
| **GitHub Pages** | ✅ | 100GB/month | ✅ | ❌ |
| **AWS S3** | 5GB/month | Pay per GB | ✅ | Extra cost |
| **Firebase** | 10GB/month | 360MB/day | ✅ | ✅ |

## 📞 Support

### Common Issues

**Build fails with memory error:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build:prod
```

**TypeScript errors:**
```bash
# Run type checking
npm run type-check
```

**3D scene doesn't render:**
- Check browser WebGL support
- Verify Three.js dependencies
- Check console for errors

### Getting Help

1. **GitHub Issues**: Report bugs and feature requests
2. **Discord**: Join the Yellorn community
3. **Documentation**: Check README files
4. **Logs**: Always check browser console and network tabs

---

**Ready to deploy your AI agents to the digital universe!** 🌍✨
