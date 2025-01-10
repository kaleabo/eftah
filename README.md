# Eftah Fast Food Website

A modern, responsive fast food restaurant website built with Next.js, TypeScript, and Tailwind CSS. Features secure authentication, admin dashboard, and file storage integration.

## Features

- **User Authentication**: Secure login/signup with NextAuth.js
- **Admin Dashboard**: Complete menu and user management
- **File Storage**: FTP integration for image uploads
- **Database**: PostgreSQL with Prisma ORM
- **Email Integration**: SMTP setup for notifications
- **Menu Management**: Dynamic menu items and categories
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth.js
- Bcrypt for password hashing
- FTP for file storage
- SMTP for emails
## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/kaleabo/eftah.git
   cd eftah
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your configuration:
     - Database connection URL
     - NextAuth secret
     - SMTP credentials
     - FTP credentials
     - Admin user details

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed the database with initial data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Access the application:
   - Website: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - Default admin credentials:
     - Email: admin@example.com
     - Password: admin123
