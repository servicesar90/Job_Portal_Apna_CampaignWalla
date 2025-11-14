import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL);
    socketRef.current = socket;

    if (userId) socket.emit("joinRoom", userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
