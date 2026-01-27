import { Alert, AlertDescription } from '@/components/ui/alert';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <Alert>
          <AlertDescription>
            This platform uses synthetic data only for educational and research demonstration purposes.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Story Trials - Consent-Based Health Data Marketplace Demo
        </p>
      </div>
    </footer>
  );
}
