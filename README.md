# 6 in a Row Blitz

A real-time, fast-paced, strategic multiplayer game built with React, TypeScript, Vite (frontend), and Node.js, Express, Socket.IO (backend).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Game Rules](#game-rules)
- [Game Flow](#game-flow)
- [Detailed Implementation](#detailed-implementation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Development](#development)
- [License](#license)

---

## Project Overview

**6 in a Row Blitz** is a two-player online board game where players compete to connect 6 pieces in a row on a 15x15 grid. The backend manages game state, matchmaking, and real-time communication, while the frontend provides an interactive and responsive user interface.

---

## Features

- Real-time multiplayer gameplay
- 15x15 board, connect 6 to win
- 3 moves per turn, then turn switches
- Per-player time limit (blitz style)
- Automatic win/loss detection (6 in a row, timeout, disconnect)
- Responsive UI with live updates via Socket.IO
- Game lobby with available games list

---

## Tech Stack

### Frontend

- React, TypeScript, Vite
- Tailwind CSS
- Socket.IO Client
- Lucide Icons

### Backend

- Node.js, Express
- Socket.IO
- UUID

---

## Folder Structure

```
project/
│
├── frontend/         # React + TypeScript client
│   ├── src/
│   │   ├── components/      # React components (GameBoard, GameMenu, etc.)
│   │   ├── socket/          # Socket.IO client services
│   │   ├── Types/           # TypeScript types
│   │   └── ...              # Styles, assets, main.tsx, etc.
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/           # Node.js + Express + Socket.IO backend
│   ├── controllers/         # Game logic controllers
│   ├── routes/              # Express routes
│   ├── socket/              # Socket.IO server logic
│   ├── gameLogic.js         # Win condition logic
│   ├── server.js            # Entry point
│   └── package.json
│
└── README.md         # Project documentation
```

---

## Installation & Setup

### Backend Setup

1. **Navigate to the backend folder:**
   ```sh
   cd server
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The backend will run on [http://localhost:3001](http://localhost:3001).

---

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the frontend development server:**
   ```sh
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## Game Rules

- The board is 15x15.
- Players take turns. Each turn, a player can make up to 3 moves (place 3 pieces).
- After 3 moves, the turn switches to the other player.
- The first player to connect 6 of their pieces in a row (horizontally, vertically, or diagonally) wins.
- If a player's timer runs out, they lose.
- If a player disconnects, the other player wins.
- Games can be created with a custom time limit per player.

---

## Game Flow

The game flow is designed to ensure seamless real-time interaction between players. Below is a step-by-step explanation of how the game works:

1. **Game Initialization:**
   - When a user opens the game, a Socket.IO connection is established between the frontend and backend.
   - The user is presented with options to either create a new game or join an existing game.

2. **Creating a Game:**
   - The user enters their name and selects a time limit for the game.
   - The frontend sends a request to the backend to create a new game.
   - The backend generates a unique `gameId` and a password for the player, initializes the game state, and sets the game status to `waiting`.
   - The game is added to the list of available games, which is visible to other players.

3. **Joining a Game:**
   - The user selects a game from the list of available games and enters their name.
   - The frontend sends a request to the backend to join the selected game.
   - The backend verifies the game status and assigns the user as the second player, generating a unique password for them.
   - The game status is updated to `playing`, and both players are notified that the game has started.

4. **Making a Move:**
   - During their turn, a player selects a column to place their token.
   - The frontend sends the move (column index) along with the player's password and `gameId` to the backend via Socket.IO.
   - The backend validates the move:
     - Checks if it is the player's turn.
     - Verifies the player's password.
     - Ensures the column is not full.
   - If the move is valid, the backend updates the game state, checks for a win condition, and switches the turn to the other player if applicable.
   - The updated game state is sent back to both players.

5. **Game End:**
   - The game ends when:
     - A player connects 6 tokens in a row (win condition).
     - A player's timer runs out (timeout).
     - A player disconnects (forfeit).
   - The backend updates the game status to `ended` and notifies both players of the result.

6. **Returning to Menu:**
   - After the game ends, players can return to the main menu to create or join another game.

---

## Detailed Implementation

### Backend

#### 1. Server Setup (`server/server.js`)
- Uses Express to serve API endpoints and Socket.IO for real-time communication.
- Handles CORS for frontend communication.
- Listens for incoming socket connections and routes events to game logic.

#### 2. Game State Management
- Each game is represented as an object with:
  - `id`: Unique game ID (UUID)
  - `players`: Array of player objects (socket ID, name, color, time left)
  - `board`: 15x15 2D array representing the game state
  - `currentTurn`: Which player's turn it is
  - `movesThisTurn`: Counter for moves in the current turn
  - `status`: 'waiting', 'playing', 'finished'
  - `winner`: Winner's ID or null

#### 3. Socket.IO Events (`server/socket/gameSocket.js`)
- **Connection:** On client connect, assigns player to a game or lobby.
- **Create Game:** Player can create a new game; server generates a game ID.
- **Join Game:** Player joins an existing game; server adds them to the game object.
- **Move:** Player sends a move (row, col); server validates, updates board, checks win, and emits updates.
- **Turn Management:** After 3 moves, turn switches; server tracks and enforces this.
- **Timer:** Each player has a countdown timer; server decrements and emits time updates.
- **Win/Draw Detection:** After each move, server checks for 6 in a row using `gameLogic.js`.
- **Disconnect:** If a player disconnects, the other wins by default.

#### 4. Game Logic (`server/gameLogic.js`)
- Implements win detection:
  - Checks for 6 consecutive pieces in all directions (horizontal, vertical, diagonal).
- Validates moves (cell empty, player's turn, within move limit).

#### 5. REST API (`server/routes/gameRoutes.js`)
- Provides endpoints for:
  - Listing available games
  - Fetching game state
  - Creating new games

---

### Frontend

#### 1. App Structure
- **Main Entry:** `src/main.tsx` renders the React app.
- **Routing:** Handles navigation between lobby, game, and results screens.

#### 2. Components
- **GameBoard:** Renders the 15x15 grid, handles click events for moves, highlights last move and winning row.
- **GameMenu:** Lets users create or join games, set their name, and choose time controls.
- **Lobby:** Shows list of available games and allows joining.
- **Timer:** Displays each player's remaining time, updates in real-time.
- **MoveIndicator:** Shows whose turn it is and how many moves remain.

#### 3. State Management
- Uses React state/hooks for local UI state.
- Uses Socket.IO client for real-time updates from the server (game state, moves, timers).

#### 4. Socket.IO Client (`src/socket/`)
- Connects to backend server.
- Listens for events: `gameUpdate`, `moveMade`, `timerUpdate`, `gameOver`.
- Emits events: `createGame`, `joinGame`, `makeMove`.

#### 5. Types (`src/Types/`)
- TypeScript interfaces for Game, Player, Move, etc., to ensure type safety.

#### 6. Styling
- Uses Tailwind CSS for responsive, modern UI.
- Board and pieces styled for clarity and accessibility.

---

## Development

- **Frontend code:** [frontend/src/](frontend/src/)
- **Backend code:** [server/](server/)

### Key Files

- Frontend entry: `frontend/src/main.tsx`
- Backend entry: `server/server.js`
- Game logic: `server/gameLogic.js`
- Socket.IO server: `server/socket/gameSocket.js`
- API routes: `server/routes/gameRoutes.js`

---

## Inspiration

The concept for **6 in a Row Blitz** was inspired by classic board games like:

- **Gomoku (Five in a Row)**: https://papergames.io/en/gomoku
- **Connect6**: https://en.wikipedia.org/wiki/Connect6
- **Pente**: https://www.pente.net/


These games share similar strategic mechanics, but **6 in a Row Blitz** builds upon them with a faster turn cycle, modern UI, real-time multiplayer, and blitz timers.

---

## Project Reference

https://github.com/OliverWales/socket-games?utm_source=chatgpt.com

---

## AI & LLM Assistance

This project was developed with the help of large language models (LLMs), including GitHub Copilot and ChatGPT. These tools were used for:

- Structuring the React project and organizing components
- Implementing the win detection logic (6-in-a-row)
- Understanding and resolving bugs and runtime errors
- Writing explanations and technical documentation (README, comments)

### Prompts Used with ChatGPT
Some example prompts include:

- “How to check for 6 in a row win condition in a 2D array in JavaScript?”
- “Help me implement real-time game state sharing using Socket.IO.”
- “Fix React error: Cannot read property 'map' of undefined.”
- “Explain how to handle disconnects with Socket.IO server.”
- “Generate a detailed README for a multiplayer game using React and Node.js.”

All generated or assisted code was reviewed, tested, and manually integrated into the project.
---

## Screenshots
![home](https://github.com/user-attachments/assets/6daf878e-9e3a-4b7b-8433-04e8dea394ca)

![create](https://github.com/user-attachments/assets/f34c7513-aa71-4790-a067-41c23a913716)

![15x15 interactive board showing moves and timers](https://github.com/user-attachments/assets/25d8112f-96e3-457f-9951-0dac66104e17)

![Lobby view with list of available games](https://github.com/user-attachments/assets/a2b98940-c083-42bf-aab9-af11156c533a)

---
## Project Demo

(https://drive.google.com/file/d/1QRwCp1FSNKRx68lG0UR2UaRBnxXnGaLe/view?usp=drive_link)

---

## License

This project is licensed under the MIT License.

You are free to use, modify, and distribute this code with proper attribution. See the [LICENSE](./LICENSE) file for more details.

