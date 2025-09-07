  --- Resume Analyzer ---

A simple Resume Analyzer web app that extracts structured information from uploaded PDF resumes using a server-side PDF parser and a generative AI (Google Gemini). The app stores extracted results in PostgreSQL and provides a React UI for uploading new resumes, viewing historical analyses, and deleting records.


`Project overview`

This project provides a small full-stack application that:

 * Accepts PDF resume uploads from a React frontend.

 * Extracts text from PDFs (server-side) and sends it to Google Gemini to parse and return structured JSON (name, email, work experience, skills, rating,    improvements, etc.).

 * Stores the parsed JSON in a PostgreSQL database (using JSONB for nested fields).

 * Displays recent and historical analyses in a table and modal, with the ability to delete records.

 * The repository contains two primary folders: backend/ and frontend/.

 `Backend Setup`

 1. Open a terminal and change to the backend folder:
   # cd resume-analyzer/backend

 2. In .env file five all the values as shown below:
   # DB_USER=your_postgres_user
   # DB_HOST=localhost
   # DB_DATABASE=your_db_name
   # DB_PASSWORD=your_postgres_password
   # DB_PORT=5432
   # GOOGLE_API_KEY=your_gemini_api_key
   # PORT=8080

 3. Create resume table in your postgresSQL and run the following query
   // CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        linkedin_url VARCHAR(255),
        portfolio_url VARCHAR(255),
        summary TEXT,
        work_experience JSONB,
        education JSONB,
        technical_skills JSONB,
        soft_skills JSONB,
        projects JSONB,
        certifications JSONB,
        resume_rating INTEGER,
        improvement_areas TEXT,
        upskill_suggestions JSONB
        );  

 4. Install backend dependences:
    # npm init -y
    # npm install express pg multer pdf-parse-fixed @google/generative-ai dotenv cors

 5. Start the backend:
    # npm run dev   ` API listen on http://localhost:8080`


 `Frontend Setup`

 1. Open a terminal and change to the frontend folder:
   # cd resume-analyzer/frontend

 2. Install frontend dependencies:
   # npm install

 3. Start the frontend:
   # npm start   `To use UI go to http://localhost:3000 in your browser`