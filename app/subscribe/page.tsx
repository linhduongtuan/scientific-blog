import SubscriptionForm from '../components/SubscriptionForm'
import SocialShare from '../components/SocialShare'

export default function SubscribePage() {
  // Current date and user information
  const currentDate = "2025-05-17 18:06:17"
  const currentUser = "linhduongtuan"
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Subscribe to Our Research Updates</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Join our community of researchers, scientists, and learners. Get exclusive updates, tutorials, and insights delivered directly to your inbox.
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900/30 p-8 rounded-lg shadow-sm">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Why Subscribe?</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Exclusive research insights not published elsewhere</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Early access to tutorials and code implementations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Notifications for new publications and research findings</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized content based on your research interests</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Opportunity to suggest topics and ask research questions</span>
              </li>
            </ul>
            
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>We send updates approximately 1-2 times per month. We respect your privacy and will never share your information.</p>
            </div>
          </div>
          
          <div>
            <SubscriptionForm />
          </div>
        </div>
      </div>
      
      {/* Social Share */}
      <div className="mt-8">
        <SocialShare 
          title="Subscribe to Research Updates - Scientific Blog"
          url="/subscribe"
          excerpt="Join our community of researchers and get exclusive updates, tutorials, and insights delivered to your inbox."
        />
      </div>
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-right">
        <p>Last updated: {currentDate} by {currentUser}</p>
      </div>
    </div>
  )
}