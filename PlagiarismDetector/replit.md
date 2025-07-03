# Plagiarism Detection Web Application

## Overview

This is a modern web application built for plagiarism detection and content analysis. The application provides a comprehensive platform for analyzing text content to identify potential plagiarism, paraphrasing, and provide detailed reporting with recommendations. It's designed as a full-stack application with a React frontend and Express backend, using modern web technologies and frameworks.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with fallback to database
- **API Design**: RESTful API with JSON responses

### Development Environment
- **Package Manager**: npm
- **Development Server**: Vite dev server with HMR
- **Build Process**: Vite for frontend, esbuild for backend
- **TypeScript**: Strict mode enabled with path mapping

## Key Components

### Frontend Components
- **Text Input Component**: Large textarea with file upload support (drag-and-drop)
- **Results Overview**: Visual display of plagiarism analysis results with progress bars
- **Detailed Report**: Tabbed interface showing highlighted text, sources, and recommendations
- **Detected Issues**: List of plagiarism/paraphrasing issues with source information
- **File Upload**: Support for multiple file formats (TXT, PDF, DOC, DOCX)

### Backend Services
- **Plagiarism Service**: Core analysis engine that simulates plagiarism detection
- **Storage Service**: Handles data persistence with in-memory fallback
- **API Routes**: RESTful endpoints for analysis and report retrieval

### Database Schema
- **Users Table**: User authentication and profile management
- **Plagiarism Reports Table**: Stores analysis results with detailed metadata
- **Relationships**: Users can have multiple reports

## Data Flow

1. **Content Submission**: User submits text content through the frontend interface
2. **Analysis Processing**: Backend processes content using plagiarism detection algorithms
3. **Result Generation**: System generates originality scores, detected issues, and recommendations
4. **Data Persistence**: Results are stored in the database with unique report IDs
5. **Response Delivery**: Frontend receives and displays comprehensive analysis results
6. **Report Access**: Users can retrieve detailed reports via API endpoints

## External Dependencies

### Frontend Dependencies
- **UI Components**: Comprehensive Radix UI component library
- **Icons**: Lucide React icons
- **Date Handling**: date-fns for date formatting
- **Form Validation**: Zod schema validation
- **HTTP Client**: Fetch API with TanStack Query wrapper

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for request/response validation

### Development Dependencies
- **Build Tools**: Vite, esbuild, PostCSS, Tailwind CSS
- **TypeScript**: Full TypeScript support with strict configuration
- **Development Tools**: Replit-specific plugins for development environment

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution in development
- **Database**: Connected to remote Neon Database instance
- **Environment**: Replit-optimized development environment

### Production Build
- **Frontend**: Vite build generating optimized static assets
- **Backend**: esbuild bundling for Node.js production deployment
- **Static Serving**: Express serves built frontend assets
- **Database**: Production PostgreSQL database via environment variables

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Build Scripts**: Separate development and production build processes
- **Asset Serving**: Static asset serving integrated with Express server

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```