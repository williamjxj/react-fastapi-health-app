# React App

A modern, production-ready React application initialized with TypeScript, Tailwind CSS, and shadcn/ui component library.

## Prerequisites

- Node.js 18+ (LTS version recommended)
- npm (comes with Node.js)

Verify installation:
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   └── examples/    # Example components demonstrating usage
├── lib/             # Utility functions and helpers
├── styles/          # Global styles
├── App.tsx          # Root component
├── main.tsx         # Application entry point
└── vite-env.d.ts    # Vite type definitions

tests/
├── unit/            # Unit tests (Vitest)
├── integration/     # Integration tests (React Testing Library)
└── setup.ts         # Test setup configuration

public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Technology Stack

- **React 18.x** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite 5.x** - Build tool and dev server
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI and Tailwind
- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

Components will be added to `src/components/ui/`.

### Adding Magic UI Components

Magic UI components are registered and can be added using:

```bash
npx shadcn@latest add @magic-ui/[component-name]
```

For example:
```bash
npx shadcn@latest add @magic-ui/bento-grid
npx shadcn@latest add @magic-ui/marquee
npx shadcn@latest add @magic-ui/animated-beam
```

### Adding Aceternity UI Components

Aceternity UI components are registered and can be added using:

```bash
npx shadcn@latest add @aceternity/[component-name]
```

For example:
```bash
npx shadcn@latest add @aceternity/bento-grid
npx shadcn@latest add @aceternity/macbook-scroll
npx shadcn@latest add @aceternity/3d-card
```

## Example Components

The project includes example components in `src/components/examples/`:
- `ExampleButton.tsx` - Demonstrates Button component variants and sizes
- `ExampleCard.tsx` - Demonstrates Card component usage

These examples show how to use shadcn/ui components in your application.

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port.

### TypeScript Errors

Run `npm run build` to see all TypeScript errors. Fix type issues before proceeding.

### Tailwind Not Working

- Verify `tailwind.config.js` content paths include your source files
- Check that `@tailwind` directives are in `src/index.css`
- Restart the dev server

### shadcn/ui Components Not Styled

- Verify Tailwind CSS is properly configured
- Check that `components.json` paths are correct
- Ensure `tailwindcss-animate` is installed

### ESLint Errors

Run `npm run lint` to see all linting errors. Fix issues before committing.

## Development Workflow

1. Make changes to source files in `src/`
2. The dev server will automatically reload (HMR)
3. Run `npm run lint` to check code quality
4. Run `npm run format` to format code
5. Run `npm test` to run tests
6. Commit changes

## Testing

Tests are written using Vitest and React Testing Library. Follow TDD principles:
1. Write tests first
2. Ensure tests fail
3. Implement functionality
4. Verify tests pass

Test coverage targets:
- Unit tests: ≥80% coverage
- Integration tests: ≥60% coverage

## Code Quality

- ESLint is configured for TypeScript and React
- Prettier is configured for consistent formatting
- All code must pass linting before commit
- TypeScript strict mode is enabled

## Contributing

1. Follow the project structure
2. Write tests for new features
3. Ensure all tests pass
4. Run linting and formatting
5. Follow TypeScript best practices

## License

[Add your license here]

