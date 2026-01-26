import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="bg-card p-12 rounded-xl shadow-lg border border-border text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-red-50 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">404 Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The academic paper you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Return to Report
        </Link>
      </div>
    </div>
  );
}
