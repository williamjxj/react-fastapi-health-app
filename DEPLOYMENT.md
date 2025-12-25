# Deployment Guide: Patient Management System

This application consists of three independent services:
1. **Frontend**: React + Vite application (deploy to Vercel)
2. **Backend API**: FastAPI + PostgreSQL service (deploy to Render)
3. **Json-Server**: Mock API for local development (not deployed)

## Deployment Architecture

```
┌─────────────┐         ┌─────────────┐
│   Vercel    │────────▶│    Render   │
│  (Frontend) │  HTTP   │  (Backend)  │
│  Port 3000  │         │  Port 8000  │
└─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │ PostgreSQL  │
                        │  Database   │
                        └─────────────┘
```

## Frontend Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project Settings**:
   - **Root Directory**: Set to `frontend/`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)

3. **Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
   - Set for: Production, Preview, and Development

4. **Deploy**:
   - Vercel will automatically deploy on push to main branch
   - Or manually trigger deployment from dashboard

### Alternative: Vercel CLI

```bash
cd frontend
vercel login
vercel
# Follow prompts, set root directory to current directory
vercel env add VITE_API_BASE_URL production
# Enter your Render backend URL
vercel --prod
```

### Vercel Configuration

The `vercel.json` at project root is configured for frontend deployment:

```json
{
  "rootDirectory": "frontend",
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist"
}
```

## Backend Deployment to Render

### Prerequisites
- Render account
- PostgreSQL database (Render provides managed PostgreSQL)

### Steps

1. **Create PostgreSQL Database**:
   - Go to Render Dashboard → New → PostgreSQL
   - Choose a name (e.g., `patient-management-db`)
   - Select region
   - Create database
   - Note the **Internal Database URL** and **External Connection String**

2. **Create Web Service**:
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository

3. **Configure Service**:
   - **Name**: `patient-management-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend/`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**:
   - Go to Environment tab
   - Add the following:
     ```
     DATABASE_URL=<Internal Database URL from PostgreSQL service>
     ENVIRONMENT=production
     PORT=10000
     ```
   - **Note**: Use Internal Database URL for better performance (same network)

5. **Deploy**:
   - Render will automatically deploy on push to main branch
   - First deployment may take 5-10 minutes

### Database Migrations

Migrations run automatically during build via `alembic upgrade head` in the build command.

To run migrations manually:
```bash
# SSH into Render shell or use Render Shell
cd backend
alembic upgrade head
```

### Health Check

Render will automatically check:
- Endpoint: `/health`
- Expected: 200 OK response

Ensure your `backend/app/main.py` has a health check endpoint.

## Json-Server (Local Development Only)

Json-server is **not deployed** and is intended for local development only.

### Local Setup

```bash
cd json-server
npm install
npm start
```

Available at `http://localhost:3001`

### Switching Between Backends

Update `frontend/.env`:

```bash
# For FastAPI backend (production)
VITE_API_BASE_URL=http://localhost:8000
# Or for deployed backend
VITE_API_BASE_URL=https://your-backend-url.onrender.com

# For json-server (local development)
VITE_API_BASE_URL=http://localhost:3001
```

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_BASE_URL`: Backend API URL
  - Production: `https://your-backend-url.onrender.com`
  - Development: `http://localhost:8000` or `http://localhost:3001`

### Backend (Render)
- `DATABASE_URL`: PostgreSQL connection string (provided by Render)
- `ENVIRONMENT`: `production` or `development`
- `PORT`: Automatically set by Render (usually 10000)

## Post-Deployment Checklist

### Frontend
- [ ] Verify frontend loads at Vercel URL
- [ ] Test patient registration from deployed frontend
- [ ] Test patient search functionality
- [ ] Verify API calls are going to correct backend URL
- [ ] Check browser console for errors
- [ ] Test on mobile devices

### Backend
- [ ] Verify API is accessible at Render URL
- [ ] Test `GET /patients` endpoint
- [ ] Test `POST /patients` endpoint
- [ ] Verify database connection
- [ ] Check API documentation at `/docs`
- [ ] Verify health check endpoint `/health`

### Integration
- [ ] Frontend can fetch patients from backend
- [ ] Frontend can create patients via backend
- [ ] CORS is configured correctly (if needed)
- [ ] All API endpoints respond correctly

## Troubleshooting

### Frontend Issues

**CORS Errors**:
- Ensure backend CORS is configured to allow Vercel domain
- Check `backend/app/main.py` for CORS middleware

**Environment Variables Not Working**:
- Ensure variables are prefixed with `VITE_` for Vite
- Redeploy after adding environment variables
- Check Vercel build logs for variable injection

**API Not Found**:
- Verify `VITE_API_BASE_URL` is set correctly
- Check that backend service is running
- Verify API routes match between frontend and backend

### Backend Issues

**Database Connection Errors**:
- Verify `DATABASE_URL` is correct
- Use Internal Database URL for better performance
- Check database is running and accessible

**Migration Errors**:
- Check build logs for migration errors
- Verify `alembic.ini` paths are correct
- Ensure database user has proper permissions

**Port Issues**:
- Render sets `$PORT` automatically
- Use `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Don't hardcode port numbers

### General Issues

**Build Failures**:
- Check build logs in Vercel/Render dashboard
- Verify all dependencies are in `package.json` or `requirements.txt`
- Ensure root directory is set correctly

**Service Communication**:
- Verify network connectivity between services
- Check firewall rules if applicable
- Test API endpoints directly with curl/Postman

## Cost Considerations

### Vercel (Frontend)
- **Free Tier**: Sufficient for most projects
- Includes: 100GB bandwidth, unlimited deployments
- **Pro**: $20/month for additional features

### Render (Backend)
- **Free Tier**: Available but with limitations
  - Spins down after 15 minutes of inactivity
  - 750 hours/month free
- **Starter**: $7/month for always-on service
- **PostgreSQL**: Free tier available (90 days, then $7/month)

### Recommendations
- Use free tiers for development/testing
- Upgrade to paid tiers for production with traffic
- Consider Render Starter plan for always-on backend

## Alternative Deployment Options

### Frontend Alternatives
- **Netlify**: Similar to Vercel, free tier available
- **Cloudflare Pages**: Free, fast CDN
- **GitHub Pages**: Free but limited (static only)

### Backend Alternatives
- **Railway**: Similar to Render, free tier available
- **Fly.io**: Good for global distribution
- **DigitalOcean App Platform**: Simple PaaS
- **AWS/GCP/Azure**: More control, more complexity

## Monitoring and Logs

### Vercel
- View logs in Vercel Dashboard → Deployments → View Function Logs
- Monitor performance in Analytics tab

### Render
- View logs in Render Dashboard → Service → Logs
- Set up alerts for service downtime
- Monitor database usage in PostgreSQL dashboard

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use Internal Database URL when possible
3. **CORS**: Configure CORS to allow only your frontend domain
4. **API Keys**: Store securely in environment variables
5. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Next Steps

After successful deployment:
1. Set up custom domains (optional)
2. Configure CI/CD for automatic deployments
3. Set up monitoring and alerts
4. Configure backup strategy for database
5. Set up staging environment for testing
