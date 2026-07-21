import SearchBar from "./search-bar";

export default function HeroSection() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
      {/* Badge */}
      <span className="rounded-full border px-4 py-1 text-sm font-medium text-muted-foreground">
        AI Powered Real Estate Platform
      </span>

      {/* Heading */}
      <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
        Find Your Perfect Home
        <span className="text-primary"> with AI</span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Buy, rent, and sell properties smarter with an AI assistant that
        understands every listing and helps you find your dream home faster.
      </p>

      {/* Search Bar */}
      <SearchBar />

      {/* Stats */}
      <div className="mt-16 flex flex-wrap justify-center gap-10">
        <div>
          <h3 className="text-3xl font-bold">10K+</h3>
          <p className="text-muted-foreground">Happy Buyers</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">50K+</h3>
          <p className="text-muted-foreground">Properties</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">24/7</h3>
          <p className="text-muted-foreground">AI Assistance</p>
        </div>
      </div>
    </section>
  );
}
