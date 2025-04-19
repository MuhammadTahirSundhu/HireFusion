import Image from "next/image"
import Link from "next/link"
import {
  Briefcase,
  ChevronRight,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Heart,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"

export default function CareerAdvicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Advice Hub: Empower Your Freelance Journey</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Whether you're just starting out or looking to level up, our expert advice, resources, and tools will help
            you navigate your freelance career with confidence.
          </p>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Build Your Dream Career, One Step at a Time</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our Career Advice Hub is here to guide you on your freelance journey. Whether you're looking for job
                opportunities, skill development, or tips to grow your career, we have everything you need.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Get expert advice, resources, and actionable steps that will help you succeed in your career, no matter
                where you are starting from.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">Beginner</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">Intermediate</span>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium">Expert</span>
              </div>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
                Explore Resources <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=500"  // Replace with actual image path
                alt="Career growth illustration"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Career Paths */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Discover the Path That's Right for You</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take our quick career assessment to find out where you can go next. Based on your skills, goals, and
              interests, we'll guide you to the best freelance paths on our platform.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Career Assessment Quiz</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-black mb-2">
                  What's your current experience level?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Beginner (0-2 years)
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Intermediate (3-5 years)
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Expert (6+ years)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Which skills are you most interested in developing?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  text-black">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    Content Writing
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    Business Strategy
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    Digital Marketing
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">What are your career goals?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Become a full-time freelancer
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Supplement my income with part-time work
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Build a freelance agency
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    Develop new skills for my current job
                  </button>
                </div>
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Get Personalized Recommendations
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Design Career Path</h3>
              <p className="text-gray-600 mb-4">Perfect for creative minds who want to bring visual ideas to life.</p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Explore path <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Development Career Path</h3>
              <p className="text-gray-600 mb-4">For those who love coding and building digital solutions.</p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Explore path <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Marketing Career Path</h3>
              <p className="text-gray-600 mb-4">Ideal for strategic thinkers who want to grow businesses.</p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Explore path <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Development Tips */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Stay Ahead of the Curve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The job market is always evolving, and so should your skills. Learn the latest trends in freelancing and
              the top skills employers are looking for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-purple-100 relative">
                <Image src="/placeholder.svg?height=200&width=400" alt="UX/UI Design" fill className="object-cover" />
              </div>
              <div className="p-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Design</span>
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">UX/UI Design Fundamentals</h3>
                <p className="text-gray-600 mb-4">
                  Learn the principles of user-centered design and create intuitive interfaces that users love.
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">8 weeks</span>
                  <span className="mx-2">•</span>
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm">4.8 (245 reviews)</span>
                </div>
                <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                  View course <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-blue-100 relative">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Python Programming"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Development
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">Python for Data Science</h3>
                <p className="text-gray-600 mb-4">
                  Master Python programming and learn how to analyze data, create visualizations, and build models.
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">10 weeks</span>
                  <span className="mx-2">•</span>
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm">4.9 (312 reviews)</span>
                </div>
                <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                  View course <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-green-100 relative">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Digital Marketing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Marketing
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">Digital Marketing Strategy</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to create effective marketing campaigns across multiple digital channels.
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">6 weeks</span>
                  <span className="mx-2">•</span>
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm">4.7 (189 reviews)</span>
                </div>
                <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                  View course <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              Browse All Courses <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Job Search and Career Growth Strategies */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find the Right Opportunities and Stand Out</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Job hunting doesn't have to be stressful. Learn how to find the best gigs, create a standout portfolio,
              and pitch clients like a pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                Building an Effective Profile
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">1</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Craft a compelling bio</h4>
                    <p className="text-gray-600">
                      Highlight your unique skills and experience in a way that speaks directly to your ideal clients.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">2</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Showcase your best work</h4>
                    <p className="text-gray-600">
                      Upload a portfolio that demonstrates your skills and the value you can provide to clients.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">3</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Set competitive rates</h4>
                    <p className="text-gray-600">
                      Research market rates for your skills and experience level to price your services appropriately.
                    </p>
                  </div>
                </li>
              </ul>
              <Link href="#" className="mt-6 text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Learn more about profile optimization <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                Effective Job Search Strategies
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">1</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Use targeted keywords</h4>
                    <p className="text-gray-600">
                      Optimize your search by using specific keywords related to your skills and desired projects.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">2</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Filter by project type</h4>
                    <p className="text-gray-600">
                      Narrow down opportunities by project length, budget, and client history to find the best matches.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">3</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Set up job alerts</h4>
                    <p className="text-gray-600">
                      Create notifications for new projects that match your skills so you can apply early.
                    </p>
                  </div>
                </li>
              </ul>
              <Link href="#" className="mt-6 text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Discover more search techniques <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">How to Make Your Proposals Stand Out</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Personalize Your Approach</h4>
                <p className="text-gray-600">
                  Address the client by name and reference specific details from their project description to show
                  you've read it carefully.
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Highlight Relevant Experience</h4>
                <p className="text-gray-600">
                  Share examples of similar projects you've completed successfully and explain how your skills match
                  their needs.
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Propose a Clear Solution</h4>
                <p className="text-gray-600">
                  Outline your approach to solving their problem and include a timeline for deliverables to show you're
                  organized.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="#"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                Download Proposal Template <Download className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Real Stories, Real Success</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get inspired by how others have achieved success on the platform and the strategies they used to reach
              their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Sarah Johnson"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Sarah Johnson</h3>
                    <p className="text-gray-600">UX/UI Designer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  "I started as a part-time freelancer with basic design skills. After taking courses and building my
                  portfolio, I now run my own design agency with clients worldwide. The platform's resources and
                  community support were instrumental in my growth."
                </p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">UX Design</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Agency Growth</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Portfolio Building
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Michael Chen"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Michael Chen</h3>
                    <p className="text-gray-600">Full-Stack Developer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  "After being laid off, I turned to freelancing as a temporary solution. The career resources helped me
                  identify my strengths and position myself effectively. Now I earn twice my previous salary working
                  with clients I love."
                </p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Web Development</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Career Transition</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Client Acquisition</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              Read More Success Stories <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Freelancer Career Management Tips */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Your Career Like a Pro</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Freelancing can be both rewarding and challenging. Learn how to balance multiple projects, manage time
              effectively, and grow your freelance career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Time Management</h3>
              <p className="text-gray-600 mb-4">
                Learn how to prioritize tasks, set realistic deadlines, and maintain a healthy work-life balance.
              </p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Read more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Long-term Growth</h3>
              <p className="text-gray-600 mb-4">
                Develop a career advancement plan that aligns with your goals, whether becoming an expert or starting a
                business.
              </p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Read more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Financial Advice</h3>
              <p className="text-gray-600 mb-4">
                Master budgeting, invoicing, setting rates, saving for taxes, and securing steady income as a
                freelancer.
              </p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Read more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Burnout Prevention</h3>
              <p className="text-gray-600 mb-4">
                Discover strategies to maintain work-life balance and avoid burnout in the fast-paced world of
                freelancing.
              </p>
              <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                Read more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Planner Template</h3>
            <p className="text-gray-600 mb-6">
              Stay organized and boost your productivity with our freelancer-friendly weekly planner. Track projects,
              deadlines, and personal time all in one place.
            </p>
            <div className="grid grid-cols-7 gap-2 mb-6">
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Mon</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Tue</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Wed</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Thu</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Fri</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Sat</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <p className="font-medium text-gray-800">Sun</p>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="#"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                Download Weekly Planner <Download className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools and Resources */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access a library of tools and resources designed to support your freelancing journey, including job
              boards, templates, and helpful guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Resume Templates</h3>
              <p className="text-gray-600 mb-4">
                Professional resume templates designed specifically for freelancers to showcase their skills and
                experience.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Modern designs
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Customizable sections
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  ATS-friendly formats
                </li>
              </ul>
              <Link
                href="#"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center text-sm"
              >
                Download Templates <Download className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Invoice Templates</h3>
              <p className="text-gray-600 mb-4">
                Professional invoice templates to help you get paid on time and maintain organized financial records.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Multiple currency options
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Tax calculation fields
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Payment terms section
                </li>
              </ul>
              <Link
                href="#"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center text-sm"
              >
                Download Templates <Download className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Proposal Templates</h3>
              <p className="text-gray-600 mb-4">
                Winning proposal templates to help you land more clients and projects with professional presentations.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Project scope sections
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Timeline visualizations
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  Pricing table formats
                </li>
              </ul>
              <Link
                href="#"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center text-sm"
              >
                Download Templates <Download className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 bg-purple-50 p-8 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Freelancer's Resource Library</h3>
                <p className="text-gray-600 mb-4">
                  Access our comprehensive library of guides, articles, videos, and tools designed to help you at every
                  stage of your freelance career.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium">
                    50+ Guides
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium">
                    100+ Templates
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium">
                    30+ Video Tutorials
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium">
                    Weekly Updates
                  </span>
                </div>
                <Link
                  href="#"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
                >
                  Browse Resource Library <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-1/3">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Resource Library"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Personalized Guidance</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get direct advice and mentorship from experienced professionals in your field.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Mentorship Program</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Connect with experienced professionals who can provide personalized guidance, feedback, and support for
                your freelance career.
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <p className="text-gray-700">One-on-one video sessions with industry experts</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <p className="text-gray-700">Portfolio reviews and personalized feedback</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-1 mr-3">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <p className="text-gray-700">Career planning and goal-setting assistance</p>
                </li>
              </ul>
              <Link
                href="#"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                Find a Mentor <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Career Assistant</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Get instant answers to your career questions with our AI-powered assistant. Available 24/7 to help with
                quick advice and resources.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
                  <div className="bg-gray-200 rounded-lg p-3">
                    <p className="text-gray-700">How do I price my freelance services?</p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <div className="bg-purple-100 rounded-lg p-3 mr-3">
                    <p className="text-gray-700">
                      To price your freelance services, consider your experience level, market rates, project
                      complexity, and value delivered. Research competitors, calculate your costs, and don't forget to
                      account for taxes and business expenses.
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask a question about your freelance career..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                    How do I find my first freelance client?
                  </h4>
                  <p className="text-gray-600">
                    Start by leveraging your network, creating a strong portfolio, using our platform's job board, and
                    offering competitive rates for your first few projects to build reviews.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                    How much should I charge as a beginner?
                  </h4>
                  <p className="text-gray-600">
                    Research market rates for your skill level, consider your expenses, and start slightly below average
                    to attract clients. Raise your rates as you gain experience and positive reviews.
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                    How do I handle difficult clients?
                  </h4>
                  <p className="text-gray-600">
                    Set clear expectations from the start, document all agreements, communicate professionally, and know
                    when to walk away from projects that aren't a good fit.
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                    How do I manage my taxes as a freelancer?
                  </h4>
                  <p className="text-gray-600">
                    Set aside 25-30% of your income for taxes, track all business expenses, consider quarterly tax
                    payments, and consult with a tax professional who specializes in freelance work.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="#"
                className="text-purple-600 font-medium hover:text-purple-700 flex items-center justify-center"
              >
                View all FAQs <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Support */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Join a Thriving Community of Freelancers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              You're not alone! Connect with others, share your experiences, and learn from fellow freelancers who are
              navigating their career journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-purple-100 relative">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Discussion Forums"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Discussion Forums</h3>
                <p className="text-gray-600 mb-4">
                  Join topic-specific forums to ask questions, share advice, and connect with other freelancers in your
                  field.
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">10,000+ members</span>
                  <span className="mx-2">•</span>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-sm">500+ daily posts</span>
                </div>
                <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                  Join the conversation <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-blue-100 relative">
                <Image src="/placeholder.svg?height=200&width=400" alt="Virtual Events" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Virtual Events</h3>
                <p className="text-gray-600 mb-4">
                  Attend webinars, workshops, and networking events to learn new skills and connect with potential
                  clients.
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Weekly events</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Live Q&A sessions</span>
                </div>
                <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                  View upcoming events <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-green-100 relative">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Skill Challenges"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Skill Challenges</h3>
                <p className="text-gray-600 mb-4">
                  Participate in monthly challenges to showcase your skills, get feedback, and win prizes and
                  recognition.
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm">Monthly prizes</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Expert judging</span>
                </div>
                <Link href="#" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
                  Join current challenge <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-purple-600 text-white p-8 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4">Join Our Freelancer Newsletter</h3>
                <p className="mb-6 text-purple-100">
                  Get weekly tips, job opportunities, and industry insights delivered straight to your inbox. Stay
                  informed and ahead of the curve.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 p-3 rounded-l-lg text-gray-800 focus:outline-none"
                  />
                  <button className="bg-purple-800 hover:bg-purple-900 px-6 py-3 rounded-r-lg font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="md:w-1/3">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Newsletter"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Building Your Future Today</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              You've got the tools, now it's time to act. Use our resources, set your goals, and start your freelance
              journey with confidence!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Create Your Profile</h3>
              <p className="text-gray-600 mb-4">
                Build a compelling profile that showcases your skills and attracts potential clients.
              </p>
              <Link
                href="#"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Explore Jobs</h3>
              <p className="text-gray-600 mb-4">
                Browse available projects and find opportunities that match your skills and interests.
              </p>
              <Link
                href="#"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block"
              >
                Find Work
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Get Mentorship</h3>
              <p className="text-gray-600 mb-4">
                Connect with experienced professionals who can guide you on your freelance journey.
              </p>
              <Link
                href="#"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block"
              >
                Find a Mentor
              </Link>
            </div>
          </div>

           
        </div>
      </section>

          </div>
  )
}