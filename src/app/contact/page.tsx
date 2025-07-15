export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Contact Us
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We'd love to hear from you. Whether you have ideas to share, feedback to offer, 
              or simply want to join the conversation about culture and identity in the digital age.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> hello@modernist.blog
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Twitter:</strong> @modernistblog
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>GitHub:</strong> modernist-blog
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contribute
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Interested in writing for Modernist? We welcome thoughtful pieces 
                that explore the intersection of technology, culture, and identity.
              </p>
              <a
                href="/write"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start Writing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}