import Link from "next/link";
import { DonationDialog } from "@/components/donation-dialog";

export default function About() {
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
        <h1 className="text-5xl font-bold mb-6">About Us</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          We are a team of passionate developers creating amazing web
          experiences with modern technologies and timeless design principles.
        </p>

        <div className="space-y-12 max-w-3xl mx-auto text-left">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Our Mission
            </h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Our Values
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Excellence in every line of code we write</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>User experience at the heart of our design</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Continuous learning and improvement</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Open collaboration and knowledge sharing</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Our Story
            </h2>
            <p className="text-muted-foreground mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p className="text-muted-foreground">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
