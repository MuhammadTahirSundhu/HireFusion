import CompanyGrid from "../../../components/company-grid";

export default function CompaniesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center border rounded-xl px-4 py-6 border-purple-200 text-purple-600 mb-12">Top Hiring Companies in Pakistan</h1>
<CompanyGrid/>
      </div>
    </div>
  )
}
