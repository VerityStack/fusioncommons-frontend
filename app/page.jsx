"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold tracking-tight">
            FusionCommons.ai
          </Link>
          <div className="space-x-6">
            <Link href="/" className="px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Home
            </Link>
            <Link href="/admin" className="px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 pt-32"
      >
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            FusionCommons.ai
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover cutting-edge fusion energy research and insights to power the future.
          </p>
          <Link
            href="/articles"
            className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Articles
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="container mx-auto text-center">
          <p className="text-lg">
            © 2025 FusionCommons.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}