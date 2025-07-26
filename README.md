# New Tab Quote Extension

A Chrome extension that displays inspirational quotes on new tab pages, built with React and Material-UI.

## Features

- Display random quotes on new tab pages
- Add, edit, and delete quotes through a settings interface
- Import/export quotes as JSON files
- Responsive design with beautiful glassmorphism effects

## Project Structure

```
src/
├── main.jsx              # React application entry point
└── components/
    ├── NewTabPage.jsx    # New tab page component
    └── SettingsPage.jsx  # Settings/quote management page
```

## Components

### NewTabPage
- Displays a random quote with fade-in animation
- Settings and refresh buttons
- Glassmorphism design with Material-UI components

### SettingsPage
- Quote management interface with table view
- Add/edit quotes with dialog modals
- Import/export functionality
- Material-UI data table and form components

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build for development:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Chrome Extension Setup

1. Build the project
2. Load the `dist` folder as an unpacked extension in Chrome
3. The extension will override your new tab page

## Stack

- React 18
- Material-UI (MUI)
- React Router
- Vite (build tool)
- Chrome Extension Manifest V3