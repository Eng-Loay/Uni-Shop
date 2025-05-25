// src/socket.js
import { io } from "socket.io-client";

// 👉 Make sure your .env has:
//    VITE_API_URL=http://localhost:5000

// Strip any trailing slash, fall back to localhost:5000
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const socket = io(API_URL, {
  withCredentials: true, // if you’re sending cookies or need auth
  transports: ["websocket"], // skip polling altogether
});
