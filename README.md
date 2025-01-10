# Eftah Fast Food Website

A modern, responsive fast food restaurant website built with Next.js, TypeScript, and Tailwind CSS. Features secure authentication, admin dashboard, and file storage integration.

## Features

- **User Authentication**
  - Secure login/signup with NextAuth.js
  - Role-based access control
  - Social login integration (Google, Facebook)

- **Admin Dashboard**
  - Complete menu management
  - User management
  - Order tracking system
  - Analytics and reporting

- **Customer Features**
  - Online ordering system
  - Real-time order tracking
  - User profile management
  - Order history

- **Technical Features**
  - File Storage: FTP integration for image uploads
  - Database: PostgreSQL with Prisma ORM
  - Email Integration: SMTP for notifications
  - Responsive Design: Mobile-first approach
  - API Documentation with Swagger

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Query for data fetching

### Backend
- Node.js
- PostgreSQL
- Prisma ORM
- NextAuth.js
- Bcrypt

### Infrastructure
- FTP for file storage
- SMTP for emails
- Redis for caching
- Docker support

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager

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

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the following in your `.env`:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Authentication secret key
   - `SMTP_*`: Email service credentials
   - `FTP_*`: File storage credentials
   - `ADMIN_*`: Initial admin user details

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

7. Access the application:
   - Website: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`
   - API docs: `http://localhost:3000/api-docs`

## Default Admin Credentials
- Email: admin@eftahfastfood.com
- Password: admin123

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run seed`: Seed database

### Project Structure
```
eftah/
├── components/     # Reusable UI components
├── pages/          # Next.js pages
├── prisma/         # Database schema and migrations
├── public/         # Static assets
├── styles/         # Global styles
├── lib/           # Utility functions
└── types/         # TypeScript definitions
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support, email support@eftahfastfood.com or join our Slack channel.
