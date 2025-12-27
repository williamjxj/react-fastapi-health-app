# CORS Configuration for Production

## Current Issue

The frontend is deployed to Vercel at `https://react-fastapi-health-app.vercel.app`, but the backend CORS is only configured for localhost, causing 404/CORS errors.

## Solution: Update CORS_ORIGINS on Render.com

### Steps:

1. **Go to Render.com Dashboard**
   - Navigate to: https://dashboard.render.com
   - Select your backend service: `react-fastapi-health-app`

2. **Go to Environment Tab**
   - Click on "Environment" in the left sidebar
   - Find the `CORS_ORIGINS` environment variable

3. **Update CORS_ORIGINS**
   - **Current value** (if set): `http://localhost:5173,http://localhost:3000`
   - **New value**:
     ```
     https://react-fastapi-health-app.vercel.app,http://localhost:5173,http://localhost:3000
     ```
   - Or if you want to allow all Vercel preview deployments:
     ```
     https://react-fastapi-health-app.vercel.app,https://*.vercel.app,http://localhost:5173,http://localhost:3000
     ```

4. **Save and Redeploy**
   - Click "Save Changes"
   - Render will automatically redeploy your service
   - Wait for deployment to complete (usually 1-2 minutes)

### Alternative: Allow All Origins (Development Only)

⚠️ **Not recommended for production**, but for testing you can temporarily use:
```
CORS_ORIGINS=*
```

This allows all origins but should only be used for development/testing.

## Verify CORS is Working

After updating, test with:

```bash
curl -X OPTIONS https://react-fastapi-health-app.onrender.com/patients \
  -H "Origin: https://react-fastapi-health-app.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

You should see `access-control-allow-origin: https://react-fastapi-health-app.vercel.app` in the response headers.

## Default CORS Configuration

The backend defaults to:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

This is set in `backend/app/config.py` line 29. For production, you must override this via the `CORS_ORIGINS` environment variable on Render.com.



