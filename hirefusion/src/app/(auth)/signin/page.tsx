import { Suspense } from "react"
import SigninForm from "../../../components/signin-form"

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>}>
      <SigninForm />
    </Suspense>
  )
}
