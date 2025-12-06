"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center space-y-4">
        <div className="text-6xl">&#128274;</div>
        <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
        <p className="text-muted-foreground max-w-md">
          It looks like you&apos;ve lost your internet connection. Please check your
          connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
