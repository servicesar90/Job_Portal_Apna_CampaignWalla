import dotenv from 'dotenv';
dotenv.config();
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';


export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const socket = io(import.meta.env.VITE_BASE_URL?.replace('/api', '') || url, { autoConnect: true });
    socketRef.current = socket;
    if (userId) socket.emit('joinRoom', userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
