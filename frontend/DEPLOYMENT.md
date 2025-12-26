# Frontend Deployment Guide

This guide covers deploying the React + Vite frontend to various cloud platforms.

## Prerequisites

- Backend API deployed at: `https://react-fastapi-health-app.onrender.com`
- Git repository connected to your deployment platform
- Environment variable `VITE_API_BASE_URL` configured

## Option 1: Vercel (Recommended) ⭐

Vercel is optimized for React/Vite applications and offers excellent performance and developer experience.

### Steps:

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your Git repository
   - Configure project settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_BASE_URL=https://react-fastapi-health-app.onrender.com
     ```
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be available at: `https://your-project.vercel.app`

### Advantages:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Free tier with generous limits
- ✅ Built-in analytics

---

## Option 2: Render.com

Since you're already using Render for the backend, you can deploy the frontend there too.

### Steps:

1. **Create Static Site**
   - Go to [render.com](https://render.com) dashboard
   - Click "New" → "Static Site"

2. **Connect Repository**
   - Connect your Git repository
   - Configure settings:
     - **Name**: `health-management-frontend` (or your choice)
     - **Branch**: `main` (or your default branch)
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`

3. **Configure Environment Variables**
   - Go to Environment tab
   - Add:
     ```
     VITE_API_BASE_URL=https://react-fastapi-health-app.onrender.com
     ```

4. **Deploy**
   - Click "Create Static Site"
   - Render will build and deploy your app
   - Your app will be available at: `https://your-project.onrender.com`

### Advantages:
- ✅ Same platform as backend (easier management)
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Custom domain support

---

## Option 3: Netlify

Netlify is another excellent option for static site hosting.

### Steps:

1. **Sign up/Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     VITE_API_BASE_URL=https://react-fastapi-health-app.onrender.com
     ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy
   - Your app will be available at: `https://your-project.netlify.app`

### Advantages:
- ✅ Free tier with good limits
- ✅ Automatic deployments
- ✅ Built-in form handling
- ✅ Edge functions support

---

## Option 4: Cloudflare Pages

Cloudflare Pages offers excellent global performance.

### Steps:

1. **Sign up/Login to Cloudflare**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Navigate to Pages

2. **Connect Repository**
   - Click "Create a project"
   - Connect your Git repository
   - Configure:
     - **Project name**: Your choice
     - **Production branch**: `main`
     - **Build command**: `cd frontend && npm run build`
     - **Build output directory**: `frontend/dist`

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     ```
     VITE_API_BASE_URL=https://react-fastapi-health-app.onrender.com
     ```

4. **Deploy**
   - Click "Save and Deploy"
   - Your app will be available at: `https://your-project.pages.dev`

---

## Important: CORS Configuration

After deploying your frontend, **update your backend CORS settings** on Render.com:

1. Go to your backend service on Render.com
2. Navigate to Environment tab
3. Update `CORS_ORIGINS` to include your frontend URL:
   ```
   CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.onrender.com,http://localhost:3000,http://localhost:5173
   ```
4. Redeploy the backend service

---

## Testing Your Deployment

After deployment, test these endpoints:

1. **Homepage**: Should load without errors
2. **API Connection**: Check browser console for API calls
3. **Patient List**: Should fetch patients from backend
4. **Patient Registration**: Should create new patients
5. **Search**: Should filter patients

---

## Troubleshooting

### Build Fails

- Check that `VITE_API_BASE_URL` is set in environment variables
- Verify Node.js version (should be 18+)
- Check build logs for specific errors

### API Calls Fail (CORS Error)

- Verify `CORS_ORIGINS` includes your frontend domain
- Check that backend is running and accessible
- Verify `VITE_API_BASE_URL` is correct

### 404 Errors on Routes

- For Vercel: Add `vercel.json` with rewrites (see below)
- For Netlify: Add `_redirects` file in `public/` folder
- For others: Configure SPA routing in platform settings

---

## Recommended: Vercel Configuration

Update `vercel.json` at project root:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures client-side routing works correctly.

---

## Quick Start (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? health-management-frontend
# - Directory? ./
# - Override settings? No

# Set environment variable
vercel env add VITE_API_BASE_URL production
# Enter: https://react-fastapi-health-app.onrender.com

# Deploy to production
vercel --prod
```

Your app will be live at the provided URL!

