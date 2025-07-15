export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About Modernist
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Culture moves fast, but understanding takes time. Modernist is where art, identity, and ideas converge
              —examining how we shape the world and how it shapes us.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Thoughtful, bold, and always curious, this is a space for those who love to question and explore.
              We believe in the power of deep reflection and meaningful discourse in an age of rapid change.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Our Mission
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              To create a platform where complex ideas can be explored with nuance and depth, 
              fostering understanding of how digital culture shapes our identity and society.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}