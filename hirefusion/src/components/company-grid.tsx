import { link } from "fs"
import CompanyCard from "./company-card"

const companies = [
  {
    id: 1,
    name: "Systems Limited",
    logo: "💻",
    description: "Hiring software engineers and IT consultants",
    link: "https://www.systemsltd.com/careers/",
  },
  {
    id: 2,
    name: "Habib Bank Limited",
    logo: "🏦",
    description: "Looking for finance professionals and digital banking experts",
    link:"https://www.hbl.com/"
  },
  {
    id: 3,
    name: "Jazz",
    logo: "📱",
    description: "Recruiting telecom engineers and customer service specialists",
    link: "https://www.jazz.com.pk",
  },
  {
    id: 4,
    name: "K-Electric",
    logo: "⚡",
    description: "Seeking electrical engineers and energy analysts",
    link: "https://www.ke.com.pk",


  },
  {
    id: 5,
    name: "Engro Corporation",
    logo: "🏭",
    description: "Hiring chemical engineers and business development managers",
    link: "https://www.engro.com",
  },
  {
    id: 6,
    name: "Daraz",
    logo: "🛒",
    description: "Looking for e-commerce specialists and logistics managers",
    link:"https://www.daraz.pk",
  },
  {
    id: 7,
    name: "Lucky Cement",
    logo: "🏗️",
    description: "Recruiting civil engineers and supply chain professionals",
    link:"https://www.luckycement.com",
  },
  {
    id: 8,
    name: "TCS",
    logo: "📦",
    description: "Seeking logistics coordinators and delivery operations managers",
    link: "https://www.tcs.com.pk",
  },
]

export default function CompanyGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  )
}
