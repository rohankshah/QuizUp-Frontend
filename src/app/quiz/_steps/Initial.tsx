"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { socketAtom } from "../../../atoms/atom";
import { GameLogicSteps, SocketEvents } from "../../../constants/consts";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { PlusIcon, Users } from "lucide-react";

interface InitialProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}

interface joinRoomObj {
  roomId: string;
}

const Initial: React.FC<InitialProps> = ({
  currentStep,
  setCurrentStep,
  setRoomId,
}) => {
  const [socket] = useAtom(socketAtom);
  const [joinRoomId, setJoinRoomId] = useState<string>("");

  function handleCreateRoom() {
    if (socket && socket.connected) {
      socket.emit(SocketEvents.CREATE_ROOM);
    }
  }

  function handleRoomJoined(data: joinRoomObj) {
    const roomId = data.roomId;
    setRoomId(roomId);
    setCurrentStep(GameLogicSteps.LOBBY);
  }

  function handleJoinRoom() {
    if (socket && socket.connected && joinRoomId && joinRoomId.length > 0) {
      socket.emit(SocketEvents.JOIN_ROOM, { roomId: joinRoomId });
    }
  }

  useEffect(() => {
    if (!socket || currentStep !== GameLogicSteps.INITIAL) return;

    socket.on(SocketEvents.ROOM_JOINED, handleRoomJoined);

    return () => {
      socket.off(SocketEvents.ROOM_JOINED, handleRoomJoined);
    };
  }, [socket, currentStep]);

  return (
    <>
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg cursor-pointer">
              <PlusIcon />
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-2xl">
            <DialogHeader className="text-center space-y-3 pb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-2">
                <Users className="text-white" />
              </div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join Room
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <Label htmlFor="room" className="text-gray-700 font-semibold">
                  Room Code
                </Label>
                <Input
                  id="room"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="c24ce31c-3664-4008-a1da-587fc7cdb730"
                  className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white/50 backdrop-blur-sm text-center font-mono text-lg tracking-wider uppercase"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                onClick={handleJoinRoom}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg"
              >
                Join Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleCreateRoom}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 cursor-pointer"
        >
          <PlusIcon />
          Create Room
        </Button>
      </div>
    </>
  );
};

export default Initial;
