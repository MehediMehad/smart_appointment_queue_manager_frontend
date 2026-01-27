const ServiceSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border p-4 space-y-4">
      <div className="h-5 w-1/2 bg-muted rounded"></div>
      <div className="h-4 w-3/4 bg-muted rounded"></div>
      <div className="h-4 w-2/3 bg-muted rounded"></div>

      <div className="flex gap-2 pt-2">
        <div className="h-9 flex-1 bg-muted rounded"></div>
        <div className="h-9 flex-1 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default ServiceSkeleton;
