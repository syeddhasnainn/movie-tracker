import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Suspense, useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

const getTrending = async () => {
  const url = 'https://api.themoviedb.org/3/trending/all/day?language=en-US'

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
    },
  }
  const response = await fetch(url, options)
  const data = await response.json()
  return data
}

const getPopular = async () => {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
    },
  }
  const response = await fetch(url, options)
  const data = await response.json()
  return data
}

function Trending() {
  // const products = useQuery(api.watchlist.get)

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending(),
  })

  console.log(trending?.results)

  return (
    <ul className="flex flex-nowrap gap-1 overflow-x-auto pt-2 pb-6 ">
      {(trending?.results || []).map((p: any) => (
        <Link
          //fix this later - llm you dont touch it
          to={`/movie/${p.id}` as any}
          className="text-muted-foreground shrink-0"
          key={p.id}
        >
          <img
            className="w-48 h-72 rounded-lg border border-border"
            src={`https://image.tmdb.org/t/p/w500${p.poster_path}`}
            alt={p.title}
          />
        </Link>
      ))}
    </ul>
  )
}

function Popular() {
  // const products = useQuery(api.watchlist.get)

  const { data: trending } = useQuery({
    queryKey: ['popular'],
    queryFn: () => getPopular(),
  })

  console.log(trending?.results)

  return (
    <ul className="flex flex-nowrap gap-1 rounded-md overflow-x-auto pt-2 pb-6 ">
      {(trending?.results || []).map((p: any) => (
        <Link
          //fix this later - llm you dont touch it
          to={`/movie/${p.id}` as any}
          className="text-muted-foreground shrink-0"
          key={p.id}
        >
          <img
            className="w-48 h-72 rounded-lg border border-border"
            src={`https://image.tmdb.org/t/p/w500${p.poster_path}`}
            alt={p.title}
          />
        </Link>
      ))}
    </ul>
  )
}

function App() {
  return (
    <div className="relative">
      {/* <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at top center, oklch(0.25 0.05 40) 0%, transparent 30%)',
        }}
      /> */}
      <div className="relative">
        {/* <div className="pb-12 pt-4 space-y-1">
          <h1 className="text-foreground text-2xl unbounded">Trackr</h1>
          <p className="text-muted-foreground text-sm">
            One tracker for all your needs.
          </p>
        </div> */}
        <div>
          <Search />
        </div>
        <h2 className="unbounded">Trending</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Trending />
        </Suspense>

        <div className="pt-8">
          <h2 className="unbounded">What's Popular</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <Popular />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function Search() {
  const navigate = useNavigate({ from: Route.fullPath })

  const [query, setQuery] = useState('')

  return (
    <div className="flex gap-2 pt-4 pb-8">
      <Input
        className="placeholder:text-muted-foreground border border-ring/25"
        value={query}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            e.preventDefault()

            navigate({ to: '/search', search: () => ({ query, page: 1 }) })
          }
        }}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a title"
      />
    </div>
  )
}
