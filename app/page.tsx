import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-[960px] mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-lg font-bold">
                MAFF
              </Link>
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </div>
            <Link href="/donate">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md font-medium">
                Donate
              </button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Site</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          This is a modern web application built with Next.js and Tailwind CSS,
          featuring a classic center-aligned layout reminiscent of the 960 grid
          system.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Feature One</h3>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Feature Two</h3>
            <p className="text-muted-foreground">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Feature Three</h3>
            <p className="text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
