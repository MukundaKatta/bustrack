import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-gray-600">
        That page does not exist or has moved.
      </p>
      <Link href="/" className="text-blue-600 underline text-sm">
        Back to home
      </Link>
    </main>
  );
}
