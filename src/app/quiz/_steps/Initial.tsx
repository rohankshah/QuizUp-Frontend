"use client"

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

  // function handleStartGame() {
  //   if (socket && socket.connected) {
  //     socket.emit(SocketEvents.JOIN_QUEUE);
  //     setCurrentStep(GameLogicSteps.MATCHING);
  //   }
  // }

  function handleCreateRoom() {
    if (socket && socket.connected) {
      socket.emit(SocketEvents.CREATE_ROOM);
      // setCurrentStep(GameLogicSteps.MATCHING);
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
      <div className="flex items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Join Room</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Room Code
                </Label>
                <Input
                  id="room"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Enter room code"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleJoinRoom}>Join</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={handleCreateRoom}>Create Room</Button>
        {/* <Button onClick={handleStartGame}>Start</Button> */}
      </div>
    </>
  );
};

export default Initial;
