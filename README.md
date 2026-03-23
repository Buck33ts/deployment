# Employee Management System

A modern employee management application for LGU (Local Government Unit) departments, built with Node.js, Express, MongoDB, and Next.js.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd documentation

# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup (in new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Tech Stack

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database with Mongoose ODM
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
documentation/
├── backend/
│   ├── src/
│   │   ├── config/database.ts
│   │   ├── controllers/employeeController.ts
│   │   ├── models/Employee.ts
│   │   ├── routes/employeeRoutes.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── department/[id]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json
│   └── next.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- MongoDB running on port 27017
- npm package manager

### Backend Configuration

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```

Backend runs on [http://localhost:1000](http://localhost:1000)

### Frontend Configuration

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:1000/api/employees" > .env.local
   ```

4. **Start frontend server**
   ```bash
   npm run dev
   ```

Frontend runs on [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Retrieve all employees |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update existing employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Employee Data Model

```json
{
  "_id": "string",
  "employeeId": "string",
  "name": "string",
  "position": "string",
  "department": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "employmentType": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Features

### Core Functionality
- **Employee Management**: Add, edit, delete, and view employees
- **Department-Based Organization**: Filter employees by department
- **Real-Time Search**: Search employees by name, position, or ID
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Data Validation**: Input validation on both frontend and backend

### User Experience
- **Clean Interface**: Modern, intuitive design with Tailwind CSS
- **Table View**: Organized employee data with row numbering
- **Icon-Based Actions**: Edit and delete buttons with intuitive icons
- **Loading States**: Proper loading indicators and error messages
- **Modal Forms**: Clean forms for adding and editing employees

### Department Pages
- **Administrative**: Manage administrative staff
- **Engineering**: Handle engineering personnel
- **Health Services**: Medical and healthcare staff
- **Education**: Teachers and education staff
- **Finance**: Financial department employees
- **Social Services**: Social welfare staff
- **Agriculture**: Agricultural department staff
- **Tourism**: Tourism industry employees

## Environment Variables

### Backend (.env)
```bash
PORT=1000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/employees_db
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:1000/api/employees
NEXT_PUBLIC_APP_NAME=Employee Management System
```

## Production Deployment

### Build Applications

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Environment Configuration for Production

Set the backend URL in your production environment:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/employees
```

## Future Enhancements

- **Authentication System**: User login and role-based access
- **Advanced Search**: Filter by multiple criteria
- **Data Export**: CSV and PDF export functionality
- **Employee Profiles**: Detailed employee information pages
- **Bulk Operations**: Multiple employee selection and actions
- **Analytics Dashboard**: Employee statistics and reports
- **File Upload**: Employee document management
- **Notifications**: Email and in-app notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for LGU employee management**
