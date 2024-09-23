# WebSocket Mock Server for Local Testing
This repository contains a simple WebSocket mock server designed for local testing purposes. It simulates a real-time auction where the highest bid is updated every 10 seconds with a random value between 0 and 100. The bid value resets when no clients are connected.

## Features
- WebSocket on ws://localhost:8000: The server opens a WebSocket connection on port 8000.
- Highest Bid Updates: The highest bid starts at 0 and increases by a random value (0-100) every 10 seconds while at least one client is connected.
- Reset on No Connections: If no clients are connected, the highest bid resets to 0 and stops increasing until a new client connects.
- Connection Logging: When a client connects or disconnects, the server logs the client's IP and port.

## Prerequisites
Node.js installed on your machine.
npm or yarn for package management.

## Using Nodemon for Auto-reloading
To make development more efficient, you can use nodemon, a tool that automatically restarts your Node.js application when it detects file changes.

Install nodemon globally (if you haven't already):
```bash
npm install -g nodemon
```
Run the server using nodemon: Instead of running node index.js, use nodemon to start the server and enable automatic reloading when the code changes:
```bash
nodemon index.js
```
Now, the server will automatically restart whenever you modify the files.