import { Link } from '@tanstack/react-router'
import { Authenticated, Unauthenticated } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'

export default function Header() {
  const { signOut } = useAuthActions()

  return (
    <header className="flex gap-2 justify-between text-muted-foreground pb-2 w-full">
      <nav className="flex justify-between items-center w-full">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at top center, oklch(0.25 0.05 40) 0%, transparent 25%)',
          }}
        />
        <div className="pb-12 pt-4 space-y-1">
          <Link to="/">
            <h1 className="text-foreground text-2xl unbounded">Trackr</h1>
          </Link>
          <p className="text-muted-foreground text-sm">
            One tracker for all your needs.
          </p>
        </div>

        <div className="font-bold space-x-2 unbounded">
          <Authenticated>
            <Link to="/watchlist">Watchlist</Link>

            <Link to="/" onClick={() => signOut()}>
              Sign out
            </Link>
          </Authenticated>
          <Unauthenticated>
            <Link to="/signin">Sign in</Link>
          </Unauthenticated>
        </div>
      </nav>
    </header>
  )
}
