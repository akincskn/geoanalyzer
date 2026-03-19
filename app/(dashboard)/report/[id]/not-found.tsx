import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-bold mb-2">Report not found</h2>
      <p className="text-muted-foreground mb-6">
        This report may have been deleted or doesn&apos;t belong to your account.
      </p>
      <Button render={<Link href="/dashboard" />} variant="outline">
        Back to History
      </Button>
    </div>
  );
}
