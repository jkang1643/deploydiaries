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
              We&apos;d love to hear from you. Whether you have ideas to share, feedback to offer, or simply want to join the conversation building scalable architecture in the modern age.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700 dark:text-gray-300">
                  {/* Email Icon */}
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.876 1.797l-7.5 5.625a2.25 2.25 0 01-2.748 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                  </span>
                  <strong className="mr-1">Email:</strong> jkang1643@gmail.com
                </p>
                <p className="flex items-center text-gray-700 dark:text-gray-300">
                  {/* Instagram Icon */}
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="17.25" cy="6.75" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                  <strong className="mr-1">Instagram:</strong> @vicepharoahjoey
                </p>
                <p className="flex items-center text-gray-700 dark:text-gray-300">
                  {/* GitHub Icon */}
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 4.302 2.788 7.946 6.652 9.238.486.09.664-.211.664-.47 0-.232-.009-.846-.013-1.66-2.705.587-3.276-1.304-3.276-1.304-.442-1.123-1.08-1.422-1.08-1.422-.883-.604.067-.592.067-.592.976.069 1.49 1.002 1.49 1.002.868 1.488 2.277 1.058 2.834.81.088-.629.34-1.058.618-1.301-2.16-.246-4.432-1.08-4.432-4.807 0-1.062.38-1.93 1.002-2.609-.101-.247-.434-1.24.096-2.586 0 0 .815-.261 2.67 1a9.29 9.29 0 012.43-.327c.824.004 1.655.112 2.43.327 1.853-1.261 2.667-1 2.667-1 .532 1.346.199 2.339.098 2.586.624.679 1.001 1.547 1.001 2.609 0 3.735-2.275 4.558-4.443 4.8.35.302.662.899.662 1.814 0 1.31-.012 2.367-.012 2.69 0 .261.176.563.67.468C18.965 19.944 21.75 16.302 21.75 12c0-5.385-4.365-9.75-9.75-9.75z" />
                    </svg>
                  </span>
                  <strong className="mr-1">GitHub:</strong> jkang1643
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Disclaimers & Policies
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Disclaimer:</strong> The content provided on this site is for informational purposes only and does not constitute professional advice.
                </li>
                <li>
                  <strong>Usage Policy:</strong> Please respect our intellectual property. Do not reproduce or distribute content without permission.
                </li>
                <li>
                  <strong>Business Inquiries:</strong> For partnership or business-related questions, please contact us at <a href="mailto:jkang1643@gmail.com" className="text-blue-600 hover:underline">jkang1643@gmail.com</a>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}