import Link from "next/link";
export default function Home() {
  return (
    <>
    
    <h1 className="text=2xl text-center">Welcome to HireFusion</h1>
    <Link href="/SignUp">Signup </Link>
    <Link href="/signin">Login </Link>
    </>
  );
}

