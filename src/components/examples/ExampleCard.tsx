import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Example component demonstrating shadcn/ui Card usage
 *
 * This component shows how to use the Card component from shadcn/ui
 * with header, content, and footer sections.
 */
export function ExampleCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
        <CardDescription>
          This is an example of a shadcn/ui Card component
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card content goes here. You can add any React components or content
          inside the CardContent section.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Action Button</Button>
      </CardFooter>
    </Card>
  )
}

