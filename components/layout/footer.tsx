export default function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Locus. All rights reserved.
    </footer>
  );
}
