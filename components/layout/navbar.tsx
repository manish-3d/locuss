export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-xl font-bold">Locus</h1>

        <nav className="flex gap-6">
          <a href="#">Buy</a>
          <a href="#">Rent</a>
          <a href="#">About</a>
        </nav>
      </div>
    </header>
  );
}
