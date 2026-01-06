# Notify

Notify is a simple web application that uses Firebase Cloud Messaging (FCM) to handle browser notifications. It registers a service worker, requests notification permission, generates an FCM token, and sends that token to a backend API.

## Features
- Firebase Cloud Messaging integration
- Browser notification permission handling
- Built using  React

## Tech Stack
- JavaScript
- React
- Firebase (Cloud Messaging)
- Vite
-

## Setup and Installation
1. Clone the repository  
   git clone <repository-url>  
   cd Notify

2. Install dependencies  
   npm install

3. Create a `.env` file in the root directory and add the following:
   VITE_API_KEY=your_api_key  
   VITE_AUTH_DOMAIN=your_auth_domain  
   VITE_PROJECT_ID=your_project_id  
   VITE_STORAGE_BUCKET=your_storage_bucket  
   VITE_MESSAGING_SENDER_ID=your_sender_id  
   VITE_APP_ID=your_app_id  
   VITE_MEASUREMENT_ID=your_measurement_id  
   VITE_API=your_backend_api_url

4. Start the development server  
   npm run dev

## How It Works
The app registers a service worker, asks the user for notification permission, generates an FCM token, stores the token in localStorage, and sends the token along with required data to the backend API.

## Notes
- Notifications work only on supported browsers
- Notification permission must be granted
- Service Worker is required for background notifications

## License
This project is intended for learning and development purposes.
