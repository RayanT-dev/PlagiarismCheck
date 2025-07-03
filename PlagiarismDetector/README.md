# PlagiarismCheck Pro

A comprehensive plagiarism detection web application with real-time Google Search integration for accurate content analysis.

## Features

- **Real-time Plagiarism Detection**: Uses Google Custom Search API to scan the entire web
- **Intelligent Analysis**: Detects both direct plagiarism and paraphrased content
- **Detailed Reporting**: Shows similarity percentages, source links, and improvement recommendations
- **Clean Interface**: Simple, focused design for optimal user experience
- **Visual Highlighting**: Color-coded text highlighting for plagiarized and paraphrased sections

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components
- TanStack Query for state management
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- Google Custom Search API integration
- In-memory storage with PostgreSQL support

## Setup Instructions

### Prerequisites
- Node.js 20+
- Google Cloud Platform account
- Google Custom Search API key
- Custom Search Engine ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd plagiarism-detector
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Getting Google API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Create credentials (API key)
5. Go to [Google Custom Search](https://cse.google.com) to create a search engine
6. Get your Search Engine ID

## Usage

1. Paste your text content into the analysis area
2. Configure analysis options (similarity check, paraphrasing detection)
3. Click "Check for Plagiarism"
4. Review the detailed results with source attribution
5. Follow the recommendations to improve content originality

## API Endpoints

- `POST /api/analyze` - Analyze text for plagiarism
- `GET /api/report/:id` - Retrieve analysis report

## Free Deployment Options

### Option 1: Vercel (100% Free - Recommended)
- **Free tier includes:** 100GB bandwidth, serverless functions, custom domains
- **Steps:**
  1. Go to vercel.com and sign up with GitHub
  2. Click "Import Project" and select your GitHub repository
  3. Vercel auto-detects settings (no config needed)
  4. Add environment variables: GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID
  5. Deploy - gets free `.vercel.app` domain

### Option 2: Netlify (100% Free)
- **Free tier includes:** 100GB bandwidth, serverless functions, forms
- **Steps:**
  1. Go to netlify.com and sign up with GitHub
  2. Click "New site from Git" and select your repository
  3. Build command: `npm run build`, Publish directory: `dist`
  4. Add environment variables in site settings
  5. Deploy - gets free `.netlify.app` domain

### Option 3: Railway (Free Tier)
- **Free tier:** 500 hours/month, $5 credit
- **Steps:**
  1. Go to railway.app and sign up with GitHub
  2. Click "Deploy from GitHub repo"
  3. Select your repository
  4. Add environment variables
  5. Deploy automatically

### Option 4: Render (100% Free)
- **Free tier:** Static sites and web services
- **Steps:**
  1. Go to render.com and sign up with GitHub
  2. Click "New Web Service"
  3. Connect your GitHub repository
  4. Build command: `npm run build`, Start command: `npm start`
  5. Add environment variables

## Environment Variables Required
- `GOOGLE_API_KEY`: Your Google Custom Search API key
- `GOOGLE_SEARCH_ENGINE_ID`: Your Custom Search Engine ID
- `NODE_ENV`: Set to "production" for deployment

## License

MIT License - see LICENSE file for details