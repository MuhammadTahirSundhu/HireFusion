export function JobCardSkeleton() {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-16 mt-1"></div>
      </div>
    )
  }
  
  export function JobDetailsSkeleton() {
    return (
      <>
        <div className="p-6 border-b">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-between">
          <div className="h-10 bg-gray-200 rounded w-28"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
      </>
    )
  }
  