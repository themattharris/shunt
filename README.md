# Shunt

A production-ready URL shortener and analytics platform built with Next.js 15, featuring real-time geolocation tracking, visitor analytics, and intelligent caching.

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Overview

Shunt is a high-performance URL redirection and analytics service optimized for speed, observability, and developer experience. Built as a full-stack application showcasing modern web development practices, it demonstrates expertise in Next.js app router, TypeScript, database design, and real-time analytics.

**Live Demo:** [Coming Soon]

## Key Features

### Core Functionality
- **Custom Slug Redirects** - Create branded short links with custom slugs
- **Multi-Domain Support** - Manage redirects across multiple domains with domain-aware routing
- **Smart Caching** - Redis-backed KV store reduces database load by caching frequently accessed slugs
- **Edge Middleware** - Fast URL resolution at the edge with intelligent fallback logic

### Analytics & Tracking
- **Visit Logging** - Capture IP, referrer, user agent, and timestamp for every visit
- **Geolocation** - Automatic IP-to-location mapping with city, country, and timezone data
- **Interactive Dashboards** - Rich metrics visualization with charts, maps, and tables
- **Top Performers** - Track top slugs by traffic volume with date-range filtering
- **User Agent Analysis** - Browser, OS, and device type detection

### Administration
- **Admin Portal** - Web UI for managing slugs and viewing analytics
- **Slug Management** - Enable/disable redirects with automatic cache invalidation
- **Cache Control** - Manual cache clearing for immediate updates
- **Authentication** - Secure login system with bcrypt password hashing

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Full type safety across the application
- **TailwindCSS** - Utility-first styling with custom design system
- **Radix UI** - Accessible component primitives
- **Recharts** - Interactive data visualization
- **React Simple Maps** - Geographic data visualization with D3

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma** - Type-safe ORM with PostgreSQL
- **Vercel KV** - Redis-compatible edge caching
- **bcryptjs** - Secure password hashing

### DevOps & Testing
- **Vitest** - Unit and integration testing with coverage reporting
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit validation
- **GitHub Actions** - CI/CD pipeline

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm 9+
- PostgreSQL database
- Redis instance (or Vercel KV)

### Installation

```bash
# Clone the repository
git clone https://github.com/themattharris/shunt.git
cd shunt

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and KV credentials

# Run database migrations
pnpm prisma migrate deploy
pnpm prisma generate

# Seed the database (optional)
pnpm prisma db seed

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shunt"
KV_REST_API_URL="your-kv-url"
KV_REST_API_TOKEN="your-kv-token"
NEXTAUTH_SECRET="your-secret-key"
```

## Architecture

### Request Flow

1. **User visits short URL** → `example.com/myslug`
2. **Edge Middleware intercepts** → Checks KV cache for slug
3. **Cache hit** → Immediate redirect (< 50ms)
4. **Cache miss** → Query database, cache result, redirect
5. **Background job** → Log visit with geolocation data

### Database Schema

**URL Table**
- id, slug, destination, domain, enabled, createdAt, updatedAt

**Visit Table**
- id, urlId, ip, referrer, userAgent, country, city, timezone, createdAt

**Domain Table**
- id, domain, active, settings

### Caching Strategy

- **TTL:** 3600 seconds for active slugs
- **Invalidation:** Automatic on slug disable/update
- **Warming:** Popular slugs pre-cached on deployment

## Project Structure

```
shunt/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── -/admin/           # Admin dashboard routes
│   │   │   └── metrics/       # Analytics pages
│   │   ├── -/api/             # API endpoints
│   │   │   ├── log-visit/     # Visit logging
│   │   │   └── resolve/       # Slug resolution
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   └── ui/               # Reusable UI primitives
│   ├── lib/                   # Core business logic
│   │   ├── actions/          # Server actions
│   │   │   ├── auth.ts       # Authentication
│   │   │   └── urlActions.ts # URL CRUD operations
│   │   ├── db.ts             # Prisma client
│   │   ├── kv.ts             # KV cache helpers
│   │   └── utils.ts          # Shared utilities
│   └── middleware.ts          # Edge middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration history
│   └── seed.ts              # Sample data
├── tests/                    # Test suites
└── public/                   # Static assets
```

## API Reference

### GET /:slug
Redirect to destination URL for given slug.

**Response:** 308 redirect or 404

### POST /api/log-visit
Log a visit for analytics tracking.

**Body:**
```json
{
  "slug": "myslug",
  "referrer": "https://example.com",
  "userAgent": "Mozilla/5.0..."
}
```

### GET /api/resolve?slug=myslug
Resolve slug to destination (for debugging).

**Response:**
```json
{
  "destination": "https://example.com",
  "cached": true
}
```

## Development

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:unit:coverage

# Run with UI
pnpm test:ui
```

### Linting & Formatting

```bash
# Lint code
pnpm lint

# Format code
pnpm prettier --write .
```

### Database Management

```bash
# Create migration
pnpm prisma migrate dev --name migration_name

# View database in browser
pnpm prisma studio

# Reset database
pnpm prisma migrate reset
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

The app is optimized for Vercel with:
- Edge middleware for global performance
- Vercel KV for distributed caching
- Automatic preview deployments

### Docker

```bash
docker-compose up -d
```

## Skills Demonstrated

### Full-Stack Development
- **Next.js App Router** - Modern React patterns with server/client components
- **TypeScript** - End-to-end type safety with strict mode
- **API Design** - RESTful endpoints with proper error handling
- **Database Design** - Normalized schema with efficient indexing

### Performance Engineering
- **Caching Strategy** - Multi-layer cache with KV store
- **Edge Computing** - Middleware for sub-50ms redirects
- **Query Optimization** - Indexed lookups and aggregation queries
- **Code Splitting** - Dynamic imports for optimal bundle size

### Data & Analytics
- **Geolocation** - IP-to-location mapping with GeoIP
- **User Agent Parsing** - Device, browser, and OS detection
- **Data Visualization** - Charts, maps, and interactive dashboards
- **Real-time Analytics** - Efficient aggregation with Prisma

### DevOps & Testing
- **CI/CD** - GitHub Actions for automated testing and deployment
- **Testing** - Vitest with unit and integration coverage
- **Git Hooks** - Pre-commit validation with Husky
- **Docker** - Containerized development environment

### Security
- **Authentication** - Secure login with hashed passwords
- **Input Validation** - Zod schemas for type-safe validation
- **SQL Injection Prevention** - Parameterized queries via Prisma
- **Rate Limiting** - Protection against abuse

## Roadmap

- [ ] API key authentication for programmatic access
- [ ] QR code generation for short links
- [ ] Custom domain support
- [ ] Link expiration and scheduling
- [ ] A/B testing for multiple destinations
- [ ] Webhook notifications for visits
- [ ] Export analytics to CSV/JSON

## License

MIT License - see [LICENSE](LICENSE) for details

## Author

Built by [@themattharris](https://github.com/themattharris)

**Contact:**
- GitHub: [@themattharris](https://github.com/themattharris)
- Portfolio: [Coming Soon]
