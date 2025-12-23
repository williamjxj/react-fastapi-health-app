# Quickstart Guide: React Application

**Date**: 2025-01-27  
**Feature**: Initialize React Application

## Prerequisites

- Node.js 18+ (LTS version recommended)
- npm (comes with Node.js)

Verify installation:
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

## Initialization Steps

### 1. Create Vite Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Configure Tailwind CSS

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Initialize shadcn/ui

```bash
npx shadcn-ui@latest init
```

Follow the prompts:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 6. Install Code Quality Tools

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier prettier
```

### 7. Install Testing Tools

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 8. Configure ESLint

Create `eslint.config.js`:
```javascript
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  prettier
)
```

### 9. Configure Prettier

Create `prettier.config.js`:
```javascript
export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
}
```

### 10. Configure Vitest

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `tests/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

### 11. Add Example shadcn/ui Component

```bash
npx shadcn-ui@latest add button
```

### 12. Update package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Verification

### 1. Start Development Server

```bash
npm run dev
```

Expected: Server starts on http://localhost:5173 (or next available port)

### 2. Verify TypeScript

```bash
npm run build
```

Expected: Build completes without TypeScript errors

### 3. Verify Linting

```bash
npm run lint
```

Expected: No linting errors

### 4. Verify Formatting

```bash
npm run format
```

Expected: Code is formatted according to Prettier rules

### 5. Verify Tests

```bash
npm run test
```

Expected: Tests run successfully (may have 0 tests initially)

### 6. Verify shadcn/ui Component

Create `src/App.tsx`:
```tsx
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">React App</h1>
      <Button>Click me</Button>
    </div>
  )
}

export default App
```

Expected: Component renders with Tailwind styling

## Project Structure

After initialization, your project should have:

```
my-app/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utilities
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   └── setup.ts
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
├── prettier.config.js
└── vitest.config.ts
```

## Next Steps

1. Add more shadcn/ui components as needed: `npx shadcn-ui@latest add [component]`
2. Create feature components in `src/components/`
3. Add utility functions to `src/lib/`
4. Write tests for components in `tests/`
5. Configure path aliases in `tsconfig.json` and `vite.config.ts`

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

## Support

For issues:
- Vite: https://vitejs.dev/guide/troubleshooting.html
- shadcn/ui: https://ui.shadcn.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/

