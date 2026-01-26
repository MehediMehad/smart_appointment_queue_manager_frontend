import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="p-8 max-w-md text-center rounded-xl shadow-lg bg-card border border-border">
        <h1 className="text-4xl font-bold mb-4 text-destructive-foreground">
          Access Denied
        </h1>
        <p className="mb-6 text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="text-primary-foreground bg-primary px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Go back
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
