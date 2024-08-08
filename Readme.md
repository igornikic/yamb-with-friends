<h1 align="center">🎲 Yamb With Friends 🎲</h1>
<br>

# Features ⭐⭐⭐

For list of all features see [Wiki](https://github.com/igornikic/yamb-with-friends/wiki).
<br>

## Getting Started ▶️▶️▶️

### Setup

1. Open terminal in VS Code (shortcut `` Ctrl + `  ``)
1. Clone the repository: `git clone https://github.com/igornikic/yamb-with-friends.git`
1. Navigate to the server directory of the project `cd server`
1. Install backend dependencies: `npm install`
1. Start the backend server: `npm run dev`
1. Open a new terminal window and navigate to the frontend directory: `cd client`
1. Install frontend dependencies: `npm install`
1. Start the frontend server: `npm run dev -- --host` (This will start the frontend server with Vite, allowing it to be accessed from other devices on the same network)

### Playing online with friends

8. Locate the port forwarding section (next to terminal section)
9. Click `Forward a Port`
10. Write port that you want to forward (e.g., 5173 for frontend)
11. Right click on `Visibility` and change port visibility to `Public`
12. Repeat steps 10. and 11. and forward backend port
13. Share frontend forwarded port with friends (e.g., `https://tunnelid-3000.devtunnels.ms`)

- Note: If you encounter any issues, make sure that you have Node.js and npm installed on your machine, and that you have the correct versions of the required dependencies installed.
  <br>

## Environment Variables 🌍🌍🌍

<br>

This project uses a .env file to define environment variables for the application. The .env files should be created with the following variables defined:

<br>

backend/src/config/config.env

```
PORT = 4000
DB_LOCAL_URI = <YOUR_LOCAL_MONGODB_URI>
```

<br>

frontend/.env

```
VITE_API_URL = <YOUR_API_URL>
```
