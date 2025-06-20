import { atom } from "jotai";
import { JwtPayload } from "jwt-decode";
import type { Socket } from "socket.io-client";

export const socketAtom = atom<Socket | null>(null);

export const userAtom = atom<JwtPayload | null>(null);
