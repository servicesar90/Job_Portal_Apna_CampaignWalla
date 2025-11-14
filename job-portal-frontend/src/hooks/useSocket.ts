import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || url, { autoConnect: true });
    socketRef.current = socket;
    if (userId) socket.emit('joinRoom', userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
