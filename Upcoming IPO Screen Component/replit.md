# Overview

This is a modern full-stack web application for IPO (Initial Public Offering) management called "Bluestock". The application serves as a platform for both public users to view and apply for IPOs, and administrators to manage IPO listings. Built with React on the frontend and Express.js on the backend, it uses PostgreSQL with Drizzle ORM for data persistence and includes JWT-based authentication for admin access.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Routing**: Wouter for client-side routing with simple page structure
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Authentication**: Client-side token storage in localStorage with role-based access control

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT tokens with bcrypt for password hashing
- **API Design**: RESTful API with proper error handling and logging middleware
- **File Structure**: Separation of concerns with dedicated routes, storage, and database modules

## Database Schema
- **Users Table**: Stores user credentials with role-based access (admin/user)
- **IPOs Table**: Core IPO information including company details, pricing, dates, and status
- **IPO Applications Table**: Tracks user applications for specific IPOs with foreign key relationships

## Component Architecture
- **Page Components**: Route-level components for different application views
- **UI Components**: Reusable Shadcn/ui components with consistent styling
- **Feature Components**: Business logic components like IPO cards, search, and admin tables
- **Layout Components**: Header, footer, and sidebar components for consistent layout

## Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- **Role-Based Access**: Admin and user roles with protected routes
- **Password Security**: Bcrypt hashing for secure password storage
- **Session Management**: Client-side token management with automatic logout

## Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: ESM modules with proper import/export structure
- **Database Migrations**: Drizzle Kit for database schema management

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database URL**: Environment-based configuration for database connections

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Google Fonts**: Poppins font family for consistent typography
- **Radix UI**: Headless UI components for accessibility and functionality

## Authentication Libraries
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing and verification

## Development Environment
- **Replit Integration**: Development environment integration with runtime error handling
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## Date and Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **nanoid**: Unique ID generation for database records