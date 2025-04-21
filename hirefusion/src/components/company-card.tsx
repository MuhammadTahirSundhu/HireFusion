"use client"

interface Company {
  id: number
  name: string
  logo: string
  description: string
  link?: string
}

interface CompanyCardProps {
  company: Company
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-100 flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mr-4">
            {company.logo}
          </div>
          <h2 className="text-xl font-semibold text-purple-900">{company.name}</h2>
        </div>
        <p className="text-gray-600 flex-grow">{company.description}</p>
        
        <div className="mt-4">
          <button
            onClick={() => window.open(company.link, "_blank")}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 text-sm font-medium"
          >
            View Jobs
          </button>
        </div>
      </div>
    </div>
  )
}
