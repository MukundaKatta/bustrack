import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bus } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-3">
        <Bus className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">BusTrack</h1>
      </div>

      <p className="max-w-sm text-center text-muted-foreground">
        Real-time school bus tracking with AI arrival prediction.
        <br />
        Built by Team Zion.
      </p>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Parent login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Admin panel</Link>
        </Button>
      </div>
    </main>
  );
}