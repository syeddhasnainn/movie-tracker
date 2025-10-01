import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/trending')({
  component: App,
})

const getMovies = async () => {
  const url =
    'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'

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

function Products() {
  // const products = useQuery(api.watchlist.get)

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getMovies(),
  })

  console.log(trending?.results)

  return (
    <ul className="grid grid-cols-4 gap-1">
      {(trending?.results || []).map((p) => (
        <Link
          to={`/movie/${p.id}`}
          className="text-muted-foreground overflow-hidden"
          key={p.id}
        >
          <img
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
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </div>
  )
}
