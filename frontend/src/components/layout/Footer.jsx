export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} Daily Necessity. All rights reserved.
      </div>
    </footer>
  );
}
