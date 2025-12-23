import { ExampleButton } from '@/components/examples/ExampleButton'
import { ExampleCard } from '@/components/examples/ExampleCard'

/**
 * Main App component
 *
 * This component showcases example usage of shadcn/ui components.
 * - ExampleButton: Demonstrates Button component variants and sizes
 * - ExampleCard: Demonstrates Card component with header, content, and footer
 */
function App() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">React App</h1>
          <p className="text-muted-foreground">
            A modern React application with TypeScript, Tailwind CSS, and
            shadcn/ui
          </p>
        </header>

        <section>
          <ExampleButton />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Card Example</h2>
          <ExampleCard />
        </section>
      </div>
    </div>
  )
}

export default App
