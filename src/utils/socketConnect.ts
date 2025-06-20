import { io, Socket } from "socket.io-client";

export const connectSocket = (token: string): Socket => {
  const socket = io("http://localhost:3001", {
    auth: { token },
  });

  return socket;
};
