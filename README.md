# Hocuspocus Server

A lightweight WebSocket server for real-time collaborative editing powered by Yjs. This project is a robust backend implementation for synchronizing shared documents between multiple clients using **Hocuspocus** and features integrated logging with **Winston**.

## Features

- **Real-time Collaboration**: Synchronize shared documents seamlessly across multiple users.
- **Custom Logging**: Uses Winston to log events to both the console and a file (`server.log`).
- **Client Management**: Tracks connected clients and logs connections and disconnections.
- **Extensibility**: Easily customizable for authentication, persistence, and middleware.

## Prerequisites

Before running the server, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/erodriguez-dev/hocuspocus-server.git
   cd hocuspocus-server
