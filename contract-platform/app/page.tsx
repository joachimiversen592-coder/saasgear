export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-apple-gray-50 to-apple-gray-100">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-semibold text-apple-gray-900">
          ContractOS
        </h1>
        <p className="text-xl text-apple-gray-600 max-w-2xl">
          Legal contract management platform for modern startups
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a href="/auth/signin" className="btn btn-primary text-lg px-6 py-3">
            Sign In
          </a>
          <a href="/auth/signup" className="btn btn-secondary text-lg px-6 py-3">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
