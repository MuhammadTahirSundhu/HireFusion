import React from 'react';

export default function CareerPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Spark</h1>
          <p className="text-lg mb-6">
            Discover opportunities that ignite your passion and shape your future. Join us to supercharge your career journey.
          </p>
          <a
            href="/jobs"
            className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Explore Job Opportunities
          </a>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Global Opportunities</h2>
            <p>
              Work with diverse teams across the globe, embracing cultures and perspectives that drive innovation.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Continuous Learning</h2>
            <p>
              Access a wealth of resources and programs designed to enhance your skills and career growth.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Inclusive Culture</h2>
            <p>
              Be part of an environment that values diversity, equity, and inclusion, fostering a sense of belonging.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="mb-6">
            Explore our current openings and find the role that's right for you.
          </p>
          <a
            href="/jobs"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}
