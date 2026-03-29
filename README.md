# NeuroForg | Simple Website Studio

A clean, focused, and powerful web builder that allows you to design and publish modern websites with total creative freedom.

## 🚀 Features

- **Free-Form Canvas**: Drag, drop, and layer elements anywhere on the canvas with absolute precision.
- **Visual Resizing**: Instantly resize any component using intuitive drag handles.
- **Layering System**: Use z-index controls to overlap images, text, and videos for complex designs.
- **Custom Canvas Sizing**: Design for any screen with manual width and height controls, plus responsive presets (Desktop, Tablet, Mobile).
- **Maximize Mode**: Toggle "Focus Mode" to hide sidebars and design on a full-screen canvas.
- **Background Options**: Support for image and video backgrounds to create immersive landing pages.
- **Real-time Code**: Watch your HTML/CSS/JS update instantly as you design visually.
- **One-Click Publish**: Launch your project to the world with a single click.

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (Custom Theme Engine)
- **Backend**: Django, Django REST Framework
- **Icons**: Boxicons
- **Fonts**: Google Fonts (Inter, Space Grotesk, Manrope)

## 🏁 Getting Started

### Prerequisites
- Python 3.x
- Django

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd 
   ```

2. **Install Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. **Database Setup**:
   ```bash
   python manage.py makemigrations core
   python manage.py migrate
   ```

4. **Run the Servers**:
   
   - **Backend (API)**:
     ```bash
     python manage.py runserver 8001
     ```
   - **Frontend (Static Server)**:
     ```bash
     python -m http.server 8000
     ```

### Default Login
Use these credentials to access the studio instantly:
- **Email**: `admin@neuroforg.io`
- **Password**: `admin123`

## 📂 Project Structure

- `index.html`: Main Studio Workspace
- `intro.html`: Landing Page with Sign-In
- `login.html`: Dedicated Login/Register Page
- `js/`: Core application logic (State, DragDrop, Components, Export)
- `css/`: Simplified, professional styling
- `core/`: Django application for project management and API

---
Built with simplicity and speed in mind for the NeuroForg Studio.
