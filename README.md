# Trackr

A modern movie tracker application for discovering and managing your favorite films.

## Features

- 🔍 Search for movies
- 🔥 Browse trending titles
- ⭐ View popular movies
- 📋 Create and manage your watchlist

## Tech Stack

- **Frontend**: React + TanStack Router
- **Backend**: Convex
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Start Convex (in a separate terminal):

```bash
npx convex dev
```

## Building For Production

```bash
pnpm build
```

## Environment Setup

Create a `.env.local` file with:

```
VITE_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment
```

Or run `npx convex init` to set them automatically.
