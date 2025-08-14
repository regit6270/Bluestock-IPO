# Overview

This is a full-stack IPO management application called "BLUESTOCK.in" that allows users to track and manage Initial Public Offerings (IPOs). The application provides comprehensive IPO data management including upcoming, ongoing, new listed, and closed IPOs with detailed financial information, search capabilities, and dashboard analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture:

- **Framework**: React 18 with Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Comprehensive set of Radix UI primitives wrapped in custom components

## Backend Architecture
The backend uses Express.js with TypeScript in a RESTful API architecture:

- **Framework**: Express.js with TypeScript for type safety
- **Authentication**: Passport.js with local strategy and session-based authentication
- **Password Security**: Node.js crypto module with scrypt for secure password hashing
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Middleware**: Request logging, JSON parsing, and authentication middleware

## Database Layer
The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL as the primary database
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Schema**: Well-defined schema with proper relationships between users and IPOs
- **Migrations**: Drizzle Kit for database schema migrations and management

## Authentication & Authorization
Session-based authentication system with the following features:

- **Strategy**: Local username/password authentication via Passport.js
- **Session Management**: Express sessions with PostgreSQL session store for persistence
- **Password Security**: Secure password hashing using scrypt with salt
- **Route Protection**: Middleware-based route protection for authenticated endpoints
- **User Management**: Complete user registration and login flow

## Data Models
The application manages two primary entities:

- **Users**: Authentication and user management with roles
- **IPOs**: Comprehensive IPO data including company information, pricing, dates, and financial metrics
- **Schema Validation**: Zod schemas for runtime type checking and validation

## API Structure
RESTful API design with the following endpoints:

- **Authentication Routes**: Login, logout, registration, and user session management
- **IPO Management**: CRUD operations for IPO data with search and filtering capabilities
- **Dashboard**: Aggregated statistics and analytics endpoints
- **Protected Routes**: All IPO and user data endpoints require authentication

# External Dependencies

## Development Tools
- **Vite**: Fast build tool and development server with React plugin
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds

## Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client for database connections
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **Drizzle Kit**: Database migration and schema management tools

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Accessible component primitives for building high-quality design systems
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built components based on Radix UI and Tailwind CSS

## State Management & API
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

## Authentication & Security
- **Passport.js**: Authentication middleware with local strategy
- **Express Session**: Session management with PostgreSQL store
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Utilities & Helpers
- **date-fns**: Modern JavaScript date utility library
- **clsx & class-variance-authority**: Utility libraries for conditional CSS classes
- **nanoid**: Secure URL-friendly unique string ID generator