import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold tracking-tighter text-primary">404</h1>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Page Not Found</h2>
          <p className="text-muted-foreground text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button className="rounded-none px-8">Return Home</Button>
          </Link>
          <Link href="/artisans">
            <Button variant="outline" className="rounded-none px-8">Find Artisans</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
