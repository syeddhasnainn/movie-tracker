import React, { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type TitleSearch = {
  query: string;
  page: number;
};

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: (search: Record<string, any>): TitleSearch => {
    return {
      query: search.query || '',
      page: search.page || 1,
    };
  },
  loaderDeps: ({ search: { query, page } }) => ({ query, page }),
  loader: async ({ deps: { query, page } }) => {
    const resp = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API}`,
        },
      },
    );

    const data = await resp.json();
    return data;
  },
});

function RouteComponent() {
  const searchResults = Route.useLoaderData();
  const [query, setQuery] = useState(searchResults.query || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="text-ring">
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search movies, TV shows, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-input rounded-md px-4 py-2 w-full"
        />
      </div>

      {/* Search Results */}
      {searchResults.results.length > 0 ? (
        <ul className="flex gap-4 flex-col pb-4">
          {searchResults.results.map((result: any) => (
            <Link to={'/movie/$id'} params={{ id: result.id }} key={result.id}>
              <li>
                <div className="flex gap-2">
                  <img
                    className="w-1/3 rounded-md"
                    src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                    alt=""
                  />

                  <div>
                    <div className="pb-2">
                      <h2 className="font-semibold">{result.title || result.name}</h2>
                      <p className="text-xs">{result.release_date || result.first_air_date}</p>
                    </div>
                    <div className="text-sm line-clamp-4">{result.overview}</div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No results found. Try searching for something else.</p>
      )}

      {/* Pagination */}
      <div className="button flex gap-2">
        <Link
          from={Route.fullPath}
          search={(prev) => ({
            ...prev,
            page: prev.page - 1,
          })}
          className={cn(
            'bg-popover text-ring rounded-md px-2 py-1 text-sm',
            searchResults.page === 1 && 'pointer-events-none cursor-not-allowed'
          )}
        >
          Previous
        </Link>

        <Link
          from={Route.fullPath}
          search={(prev) => ({
            ...prev,
            page: prev.page + 1,
          })}
          className={cn(
            'bg-popover text-ring rounded-md px-2 py-1 text-sm',
            searchResults.page === searchResults.total_pages && 'pointer-events-none cursor-not-allowed'
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
}