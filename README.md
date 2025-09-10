# Real Estate Web Application

A full-stack real estate platform for property listings, inquiries, user management, and more. This repository contains both the client (React + Vite + TypeScript + Tailwind CSS) and server (Python + FastAPI + SQLAlchemy + Alembic + Celery) codebases.

## Features

### Client (Frontend)
- **Modern UI**: Built with React, Vite, and Tailwind CSS for a fast and responsive user experience.
- **Authentication**: User registration, login, and profile management.
- **Property Listings**: Browse, filter, and view detailed property information.
- **Add/Edit/Delete Properties**: Authenticated users can manage their own property listings.
- **Image Uploads**: Upload and manage property images.
- **Favorites**: Save favorite properties for quick access.
- **Inquiries**: Send and manage inquiries to property owners.
- **Chat Interface**: Real-time chat between users for property discussions.
- **Dashboard**: User dashboard with tabs for properties, favorites, inquiries, chats, and profile settings.
- **Responsive Design**: Mobile-friendly layout and components.

### Server (Backend)
- **FastAPI**: High-performance Python API framework.
- **User Management**: Registration, authentication, password reset, and profile image support.
- **Property Management**: CRUD operations for properties, including featured properties and property status.
- **Inquiries & Chat**: Models and endpoints for property inquiries and real-time chat.
- **Favorites**: Endpoints for managing user favorites.
- **Role-Based Access**: Decorators and services for role-restricted endpoints.
- **Email Service**: Email notifications for inquiries and password resets.
- **Celery Integration**: Background task processing (e.g., sending emails).
- **Database Migrations**: Alembic for schema migrations.
- **Docker Support**: Dockerfile for containerized deployment.

## Project Structure

```
client/      # Frontend React app
server/      # Backend FastAPI app
```

## Getting Started

### Prerequisites
- Node.js & npm (for client)
- Python 3.8+ (for server)
- Docker (optional, for containerization)

### Setup

#### Client
```bash
cd client
npm install
npm run dev
```

#### Server
```bash
cd server
pip install -r requirements.txt
uvicorn app:app --reload
```

#### Docker
See `server/Dockerfile` for building and running the backend in a container.

## License

MIT License
