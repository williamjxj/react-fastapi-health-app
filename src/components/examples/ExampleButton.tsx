import { Button } from '@/components/ui/button'

/**
 * Example component demonstrating shadcn/ui Button usage
 *
 * This component shows how to use the Button component from shadcn/ui
 * with different variants and sizes.
 */
export function ExampleButton() {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Button Examples</h3>
      <div className="flex flex-wrap gap-2">
        <Button>Default Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  )
}
