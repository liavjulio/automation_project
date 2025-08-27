<<<<<<< HEAD
# automation_project
=======
# Modern Inventory Management System

A comprehensive full-stack inventory management application built with React, Node.js, Python Flask, and MongoDB. This project features a modern, responsive UI with Material-UI components, dark mode support, and seamless navigation.

## 🚀 Recent Major Upgrades (August 2025)

This project has been completely modernized with the latest technologies and a professional-grade UI/UX:

### 🎨 Complete UI/UX Transformation
- **Material-UI v6**: Modern component library with latest design principles
- **Dark Mode Support**: Toggle between light and dark themes
- **Framer Motion**: Smooth animations and micro-interactions
- **Responsive Design**: Mobile-first approach with collapsible navigation
- **Professional Dashboard**: Real-time statistics and quick actions
- **Toast Notifications**: React Hot Toast for user feedback

### 📦 Frontend Technology Stack
- **React**: Updated to v19.1.1 (latest stable)
- **Material-UI**: v6 with modern theming system
- **Framer Motion**: Animation library for smooth transitions
- **React Hot Toast**: Beautiful notification system
- **Emotion**: CSS-in-JS styling solution

### ⚡ Backend Upgrades
- **Express**: Upgraded to v5.1.0 (major version upgrade)
- **Flask**: Updated to v3.1.2 with latest features
- **MongoDB**: Local database setup for reliable development
- **Flask-RESTful**: Enhanced API structure
## ✨ Features

### Frontend Capabilities
- **Modern Dashboard**: Real-time inventory statistics and quick actions
- **Item Management**: Add, view, search, and manage inventory items
- **Smart Search**: Local search and online product lookup
- **Category System**: Organize items by categories
- **Low Stock Alerts**: Automatic notifications for items running low
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Framer Motion powered transitions

### Backend Services
- **Python Flask API** (Port 5001): Core inventory operations
- **Node.js Express API** (Port 3000): Additional services and middleware
- **MongoDB Database**: Local database for reliable data persistence
- **RESTful APIs**: Well-structured API endpoints
- **CORS Support**: Proper cross-origin handling

### Technology Highlights
- **React 19.1.1**: Latest React with modern features
- **Material-UI v6**: Professional component library
- **Express v5.1.0**: Latest Express framework
- **Flask v3.1.2**: Modern Python web framework
- **MongoDB**: NoSQL database with flexible schema

## � Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** 3.9+
- **MongoDB** (local installation)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/liavjulio/automation_project.git
   cd automation_project
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Setup Python Service**
   ```bash
   cd ../python-service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Setup Node Service**
   ```bash
   cd ../node-service
   npm install
   ```

5. **Start MongoDB**
   ```bash
   brew services start mongodb-community  # On macOS
   # Or start MongoDB according to your OS
   ```

### Running the Application

1. **Start Python Service** (Terminal 1)
   ```bash
   cd python-service
   source venv/bin/activate
   python app.py
   ```
   � Service runs on: http://localhost:5001

2. **Start Node Service** (Terminal 2)
   ```bash
   cd node-service
   npm start
   ```
   🟢 Service runs on: http://localhost:3000

3. **Start Frontend** (Terminal 3)
   ```bash
   cd frontend
   npm start
   ```
   🟢 Frontend runs on: http://localhost:3002

## 📁 Project Structure

```
project-automation/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── styles/          # CSS and styling
│   │   ├── api.js           # API communication layer
│   │   └── App.js           # Main application component
│   └── package.json
├── python-service/          # Flask API server
│   ├── routes/              # API route handlers
│   ├── models/              # Database models
│   ├── config/              # Configuration files
│   └── app.py               # Flask application entry point
├── node-service/            # Express API server
│   ├── routes/              # Additional API routes
│   ├── __tests__/           # Unit tests
│   └── app.js               # Express application entry point
└── README.md                # Project documentation
```

#### Frontend (React)
```bash
cd frontend
npm start          # Development server on http://localhost:3000
npm test           # Run tests
npm run build      # Production build
## 🔧 API Endpoints

### Python Flask API (Port 5001)
- `GET /view-list` - Get all inventory items
- `POST /add-item` - Add new item to inventory
- `GET /count-items` - Get total item count
- `DELETE /clear-list` - Clear all items
- `POST /search-item` - Search items by criteria
- `GET /generate-id` - Generate unique item ID

### Node Express API (Port 3000)
- Additional service endpoints
- Middleware and request processing

## 🎨 UI Components

### Dashboard
- **Statistics Cards**: Total items, categories, low stock alerts
- **Quick Actions**: Fast navigation to key functions
- **Real-time Data**: Live updates from backend

### Inventory Management
- **Add Items**: Form with validation and auto-completion
- **View Items**: Card-based layout with search and filtering
- **Item Actions**: Edit, delete, and manage inventory items

### Navigation
- **Sidebar Menu**: Collapsible navigation with icons
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Theme Toggle**: Switch between light and dark modes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- Flask and Express communities for robust backend frameworks
- MongoDB for the flexible database solution

---

**Built with ❤️ by Liav Julio**
- `npm run format` - Code formatting

## 🔧 Technologies

- **Frontend**: React 19, Axios, CSS3
- **Backend**: Express 5, MongoDB, Mongoose 8
- **Python Service**: Flask 3.1, PyMongo 4.14
- **Testing**: Jest, Pytest, Supertest
- **Development**: Nodemon, ESLint, Prettier, Concurrently

## 🚀 Deployment

The project includes Docker configurations for easy deployment:

```bash
# Build and run with Docker Compose
cd python-service
docker-compose up --build
```

## 📝 API Endpoints

### Node.js Service (Port 3000)
- `GET /count-items` - Get item count
- `DELETE /clear-list` - Clear all items

### Python Service (Port 5000)
- `GET /api/view-list` - View all items
- `POST /api/add-item` - Add new item
- `DELETE /api/delete-item` - Delete specific item
- `GET /api/search-item` - Search items
- `GET /api/search-online` - Online search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm run test`
4. Format code: `npm run format`
5. Submit a pull request

## 📄 License

ISC License
>>>>>>> master
