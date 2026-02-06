# Smart Society Management System

A comprehensive full-stack web application designed to streamline the management of residential societies. This system enables administrators and residents to handle user management, maintenance bills, complaints, notices, and statistical reporting efficiently and many more functionalities.

## Features

- **User Management**: Resident registration, authentication, and role-based access control
- **Complaint System**: File, track, and resolve resident complaints
- **Maintenance Bills**: Generate and manage monthly maintenance bills
- **Notice Board**: Post and display important society notices
- **Dashboard**: Overview of society statistics and quick access to key functions
- **Admin Panel**: Manage residents, bills, and system settings
- **File Uploads**: Support for image uploads using Cloudinary integration

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **Cloudinary** for image storage
- **bcryptjs** for password hashing
- **multer** for file uploads

### Frontend
- **React** with Vite build tool
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-society
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Configuration**
   - Create a PostgreSQL database
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASS=your_database_password
     DB_HOST=localhost
     PORT=5000
     JWT_SECRET=your_jwt_secret_key
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

5. **Database Migration**
   ```bash
   cd backend
   # Run the database sync (ensure models are properly defined)
   node -e "require('./models').sequelize.sync()"
   ```

## Usage

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Login with your credentials or set up a new account

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/setup-password` - Password setup for invited users

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user information

### Bills
- `GET /api/bills` - Get all maintenance bills
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - File new complaint
- `PUT /api/complaints/:id` - Update complaint status

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create new notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

### Statistics
- `GET /api/stats` - Get society statistics

## Project Structure

```
smart-society/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── billController.js
│   │   ├── complaintController.js
│   │   ├── noticeController.js
│   │   ├── statsController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Complaint.js
│   │   ├── MaintenanceBill.js
│   │   ├── Notice.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── billRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── noticeRoutes.js
│   │   ├── statsRoutes.js
│   │   └── userRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminBills.jsx
│   │   │   ├── ComplaintList.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FileComplaint.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageResidents.jsx
│   │   │   ├── Notices.jsx
│   │   │   ├── SetupPassword.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── storage.js
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
