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

- **API Base URL**: Configured via `VITE_API_BASE_URL` environment variable
  - **Default (Production)**: `https://react-fastapi-health-app.onrender.com` (Render.com backend)
  - **Local Development**: Override with environment variable:
    ```bash
    VITE_API_BASE_URL=http://localhost:8000 npm run dev
    ```
  - **Using .env file**: Create `.env` file in `frontend/` directory:
    ```
    VITE_API_BASE_URL=http://localhost:8000
    ```
  - For json-server: `http://localhost:3001`

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

### Vercel / Render / Netlify

1. Connect repository to your hosting platform
2. Set "Root Directory" to `frontend/` in project settings
3. Configure environment variables (optional):
   - `VITE_API_BASE_URL`: Override API URL if different from default
   - Default will use: `https://react-fastapi-health-app.onrender.com`
4. Deploy

The `vercel.json` at project root is configured for frontend deployment.

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

