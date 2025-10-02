import SiteLogo from '@/components/site-logo';

export default function NotFound() {
  return (
    <>
      <SiteLogo />
      <div className="mt-10 w-8/12 mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6 sm:text-xs">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
    </>
  );
}
