# BibleNotes

This is a full-stack web application for taking and managing spiritual notes.

## Features

- User authentication (signup, login)
- Create, Read, Update, and Delete notes
- Rich text editor for notes
- Real-time synchronization with WebSockets
- Image uploads with Cloudinary
- PWA support for offline use
- Bookmarking system
- Advanced search functionality

## Running the application locally

### Backend

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Set up a PostgreSQL database and create a `.env` file in the `backend` directory with the following variables:
    ```
    DATABASE_URL=postgresql://user:password@host:port/database
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
4.  Run the database migrations from `src/database.sql`
5.  Start the backend server: `npm run dev`

### Frontend

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the frontend development server: `npm run dev`

## Deployment

### Backend (Railway)

1.  Create a new project on Railway and connect it to your GitHub repository.
2.  Add a PostgreSQL database service.
3.  In the service settings, add the environment variables from the `.env` file. Railway will provide the `DATABASE_URL`.
4.  Railway should automatically detect the `start` script in `package.json` and build and deploy the application.

### Frontend (Vercel)

1.  Create a new project on Vercel and connect it to your GitHub repository.
2.  Set the framework preset to "Vite".
3.  In the environment variables, set `VITE_API_BASE_URL` to the URL of your deployed backend on Railway.
4.  Vercel will automatically build and deploy the frontend. The `vercel.json` file in the `frontend` directory will handle the SPA routing.
