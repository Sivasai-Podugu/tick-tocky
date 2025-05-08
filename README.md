# TimerFlow

TimerFlow is a modern, user-friendly timer management application built with React and TypeScript. It allows users to create, manage, and track multiple timers organized by categories.

## Features

- 🎯 Create and manage multiple timers
- 📊 Organize timers by categories
- ⏱️ Real-time timer tracking
- 🔔 Halfway alert notifications
- 📱 Responsive design
- 📜 Timer history tracking
- 💾 Automatic state persistence

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
    git clone https://github.com/yourusername/tick-tocky.git


2. Install dependencies:
    npm install


3. Start the development server:
    npm run dev


## Usage

1. **Creating a Timer**
   - Click the "Add Timer" button
   - Enter timer name, category, and duration
   - Optionally enable halfway alert

2. **Managing Timers**
   - Start, pause, or reset individual timers
   - Use category controls to manage all timers in a category
   - Toggle dark/light theme using the theme switcher

3. **Timer History**
   - View completed timer history
   - Export timer data for backup

## Project Structure

src/
  ├── components/     # React components
  ├── context/        # React context providers
  ├── hooks/          # Custom React hooks
  ├── pages/          # Page components
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions
  └── App.tsx         # Root component