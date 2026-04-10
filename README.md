# Bookmark Manager

A two-surface Express and Handlebars web app for managing bookmarks:

- Public site for browsing, searching, and filtering bookmarks
- Admin site on a subdomain for login and bookmark CRUD actions

This project is designed for coursework and currently uses in-memory mock data.

## Features

### Public App

- Home dashboard with total, active, archived, and recent bookmark stats
- Bookmark listing page
- Bookmark detail page by slug
- Tag filtering
- Search by title

### Admin App

- Cookie-based login/logout
- Dashboard with bookmark statistics
- Create bookmark with slug generation and validation
- Edit bookmark
- Delete bookmark
- Archive/unarchive bookmark

### Shared/Infrastructure

- View auto-render middleware for top-level templates
- Slug validation middleware for URL safety
- Request logger middleware
- Two Express apps mounted in one server using virtual host routing

## Tech Stack

- Node.js
- Express
- Express Handlebars
- cookie-parser
- vhost
- dotenv

## Project Structure

- app.js: Main entry point, app bootstrapping, vhost mounting
- config/app.config.js: Environment-backed config values
- routes/: Public and admin route definitions
- controllers/: Request handlers for public and admin flows
- middleware/: Logger, auth guard, slug validator, auto-render
- data/mock.js: Seeded bookmarks and admin users
- views/: Public/admin Handlebars templates and layouts
- public/: Static assets (styles, scripts, images)

## Prerequisites

- Node.js 18+ recommended
- npm

## Installation

1. Install dependencies:

	```bash
	npm install
	```

2. Create a .env file in the project root:

	```env
	PORT=3000
	DOMAIN=localhost
	NODE_ENV=development
	ADMIN_TOKEN=secret
	```

3. Add local hosts mapping for admin subdomain:

	- Windows hosts file: C:\Windows\System32\drivers\etc\hosts
	- Add line:

	```text
	127.0.0.1 admin.localhost
	```

## Run

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

When the server starts, visit:

- Public app: http://localhost:3000
- Admin app: http://admin.localhost:3000

## Demo Admin Accounts

- Username: admin | Password: admin123
- Username: editor | Password: editor123

## Route Overview

### Public Routes

- GET /: Home dashboard
- GET /bookmarks: All bookmarks
- GET /bookmarks/:slug: Bookmark details
- POST /tag: Redirect to tag page
- GET /tag/:tagSlug: Bookmarks by tag
- GET /search?q=: Search bookmarks by title

### Admin Routes

- GET /login: Login page
- POST /login: Login submit
- POST /logout: Logout
- GET /: Admin dashboard (protected)
- GET /bookmarks: Bookmarks list (protected)
- GET /bookmarks/new: New bookmark form (protected)
- POST /bookmarks/new: Create bookmark (protected)
- GET /bookmarks/:slug/edit: Edit form (protected)
- POST /bookmarks/:slug/edit: Update bookmark (protected)
- POST /bookmarks/:slug/delete: Delete bookmark (protected)
- POST /bookmarks/:slug/archive: Archive bookmark (protected)
- POST /bookmarks/:slug/unarchive: Unarchive bookmark (protected)

## Validation Rules

- Title is required for create/update
- URL must start with http:// or https://
- New bookmark URL must be unique
- New bookmark slug must be unique
- Slug params allow lowercase letters, numbers, and hyphens only

## Important Notes

- Data is in-memory (mock data); restarting the server resets runtime changes.
- Login session uses a cookie named admin_user with a short expiry.

## Scripts

- npm start: Run with Node
- npm run dev: Run with nodemon

## Author

Huyming Tang
