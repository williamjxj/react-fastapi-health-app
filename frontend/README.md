# Frontend Service

React + Vite application for patient management system.

## Prerequisites

- Node.js 18+ (LTS version recommended)
- npm 9+

## Setup

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Testing

```bash
npm test              # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Code Quality

```bash
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

## Configuration

- **API Base URL**: **Required** - Must be set via `VITE_API_BASE_URL` environment variable
  - **Production**: Create `.env.production` file in `frontend/` directory:
    ```
    VITE_API_BASE_URL=https://react-fastapi-health-app.onrender.com
    ```
  - **Local Development**: Create `.env` file in `frontend/` directory:
    ```
    VITE_API_BASE_URL=http://localhost:8000
    ```
  - **Using command line**:
    ```bash
    VITE_API_BASE_URL=http://localhost:8000 npm run dev
    ```
  - For json-server: `http://localhost:3001`

**Note**: The application will throw an error if `VITE_API_BASE_URL` is not set.

## Project Structure

```
frontend/
├── src/
│   ├── components/    # React components
│   │   ├── patients/  # Patient management components
│   │   └── ui/        # shadcn/ui components
│   ├── lib/           # Utilities, API clients, models
│   ├── App.tsx        # Root component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── tests/             # Test suite
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
└── dist/              # Production build output
```

## Technology Stack

- **React 18.x** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite 5.x** - Build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Vitest** - Testing framework

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guides.

### Quick Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variable**:
   ```bash
   vercel env add VITE_API_BASE_URL production
   # Enter: https://react-fastapi-health-app.onrender.com
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Other Platforms

- **Render.com**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-2-rendercom)
- **Netlify**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-3-netlify)
- **Cloudflare Pages**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-4-cloudflare-pages)

### Important Notes

- **Environment Variable**: Must set `VITE_API_BASE_URL` in your hosting platform
- **CORS**: Update backend `CORS_ORIGINS` to include your frontend domain
- **SPA Routing**: Configure redirects for client-side routing (see DEPLOYMENT.md)

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components will be added to `src/components/ui/`.

## Troubleshooting

### Port Already in Use

If port 3000 is in use, Vite will automatically use the next available port.

### TypeScript Errors

Run `npm run build` to see all TypeScript errors.

### Tailwind Not Working

- Verify `tailwind.config.js` content paths include your source files
- Check that `@tailwind` directives are in `src/index.css`
- Restart the dev server

