# Deployment Guide: Patient Management System to Vercel

This application consists of two services:
1. **Frontend**: React + Vite application
2. **Backend API**: json-server mock API

## Deployment Options

### Option 1: Deploy Both Services Separately (Recommended)

#### Step 1: Deploy json-server API

1. Create a new repository for the API service (or use a subdirectory)
2. Create a Vercel serverless function or use a separate service:

**Option A: Deploy json-server as a separate Vercel project**

Create a new Vercel project with this structure:
```
api/
  ├── db.json
  ├── package.json
  └── vercel.json
```

`api/package.json`:
```json
{
  "name": "patient-api",
  "version": "1.0.0",
  "scripts": {
    "start": "json-server --watch db.json --port 3001"
  },
  "dependencies": {
    "json-server": "^1.0.0-beta.3"
  }
}
```

`api/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/serverless.js"
    }
  ]
}
```

**Option B: Use a free json-server hosting service**

- Use [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for testing
- Use [my-json-server](https://my-json-server.typicode.com/) (GitHub-based)
- Use [Railway](https://railway.app/) or [Render](https://render.com/) for free hosting

#### Step 2: Update Frontend API URL

Update `src/lib/api/patientService.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
```

Create `.env.production`:
```
VITE_API_BASE_URL=https://your-api-url.vercel.app
```

#### Step 3: Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Set environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-api-url.vercel.app`

5. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Use Vercel Serverless Functions (Advanced)

Create API routes in your Vercel project:

1. Create `api/patients.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import db from '../db.json'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(db.patients)
  } else if (req.method === 'POST') {
    // Handle POST logic
    res.status(201).json({ ...req.body, id: Date.now() })
  }
}
```

2. Update `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/patients",
      "destination": "/api/patients"
    }
  ]
}
```

### Option 3: Use External API Service (Easiest for POC)

1. **Deploy json-server to Railway** (free tier available):
   - Go to [Railway](https://railway.app/)
   - Create new project
   - Connect GitHub repo
   - Add `db.json` file
   - Set start command: `npx json-server db.json --port $PORT`
   - Railway provides a public URL

2. **Update frontend environment variable**:
   ```
   VITE_API_BASE_URL=https://your-railway-app.up.railway.app
   ```

3. **Deploy frontend to Vercel** as normal

## Recommended Setup for This Project

### Quick Start (Using Railway for API)

1. **Deploy API to Railway**:
   ```bash
   # Create a minimal package.json for Railway
   echo '{"scripts":{"start":"json-server db.json --port $PORT"}}' > api-package.json
   
   # Push to Railway or use Railway CLI
   ```

2. **Deploy Frontend to Vercel**:
   ```bash
   # Set environment variable
   vercel env add VITE_API_BASE_URL production
   # Enter your Railway API URL when prompted
   
   # Deploy
   vercel --prod
   ```

### Environment Variables

Create `.env.production`:
```
VITE_API_BASE_URL=https://your-api-service-url.com
```

Or set in Vercel Dashboard:
- Project Settings → Environment Variables
- Add `VITE_API_BASE_URL` for Production, Preview, and Development

## Post-Deployment Checklist

- [ ] Verify API is accessible at the configured URL
- [ ] Test patient registration from deployed frontend
- [ ] Test patient search functionality
- [ ] Verify CORS is configured correctly (if needed)
- [ ] Check browser console for any errors
- [ ] Test on mobile devices

## Troubleshooting

### CORS Issues
If you see CORS errors, add CORS headers to your API service or use a CORS proxy.

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_` for Vite
- Redeploy after adding environment variables
- Check Vercel build logs for variable injection

### API Not Found
- Verify the API URL is correct
- Check that the API service is running
- Ensure routes match between frontend and backend

## Alternative: Single Repository with Monorepo

If you want to keep everything in one repo, consider:
- Using Vercel's monorepo support
- Creating separate `vercel.json` files for each service
- Using Vercel's project linking feature

