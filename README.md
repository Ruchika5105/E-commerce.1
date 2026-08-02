# K.Gaureeha Food Industry Website

A modern React + TypeScript website for K.Gaureeha Food Industry (OPC) Private Limited, a premium cashew processing and dry fruits distribution business.

This project showcases the company’s products, processing standards, certifications, testimonials, gallery, and contact information while also including an admin dashboard for managing enquiries and feedback.

## Features

- Responsive landing page for a premium food industry brand
- Product showcase with detailed category cards
- Processing, quality, and certification sections
- Gallery and testimonials
- Contact form and WhatsApp integration
- Admin dashboard with Supabase-backed data handling

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- ESLint

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create or update your environment variables

   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` – start the local Vite development server
- `npm run build` – create a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint checks
- `npm run typecheck` – run TypeScript checks

## Project Structure

```text
src/
  components/     # Shared UI components
  context/        # Auth and theme context
  data/           # Site content and company data
  lib/            # App helpers and Supabase client
  pages/          # Admin pages and policy pages
  sections/       # Main marketing sections
```

## Contact

K.Gaureeha Food Industry (OPC) Private Limited

- Phone: +91 79726 86989
- Alternate Phone: +91 94049 70905
- Email: k.gaureehafoodindustry@gmail.com

## Notes

This project is configured for a business website with Supabase-based admin functionality. Make sure your Supabase project has the required tables and environment variables configured before running the app.

## Deployment

This repository is configured for GitHub Pages deployment via GitHub Actions. The production site will be published from the generated `dist/` folder and should be available at:

`https://Ruchika5105.github.io/E-commerce.1/`
