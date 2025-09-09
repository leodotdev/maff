import Link from "next/link";
import { DonationDialog } from "@/components/donation-dialog";

export default function Contact() {
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
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a question or want to work together? We'd love to hear from you.
          Get in touch using the form below.
        </p>

        <div className="max-w-md mx-auto">
          <form className="space-y-6 text-left">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-md bg-background"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-md bg-background"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-md bg-background"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-md bg-background resize-none"
                placeholder="Tell us more about your project..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground">hello@example.com</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Office</h3>
            <p className="text-muted-foreground">123 Main St, City, ST 12345</p>
          </div>
        </div>
      </main>
    </div>
  );
}
