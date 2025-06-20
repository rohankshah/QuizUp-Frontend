"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Users } from "lucide-react";
import { socketAtom, userAtom } from "../../../atoms/atom";
import { GameLogicSteps, SocketEvents } from "../../../constants/consts";
import { useQuizCategories } from "../../../hooks/useQuizCategories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
// import { GameLogicSteps } from "../../../contants/consts";

interface CategoryType {
  id: number;
  name: string;
}

interface PlayerDetails {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

interface RoomDetails {
  hostId: string;
  players: PlayerDetails[];
  createdAt: string;
}

interface RoomLobbyProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  roomId: string;
}

const RoomLobby: React.FC<RoomLobbyProps> = ({
  currentStep,
  setCurrentStep,
  roomId,
}) => {
  const [socket] = useAtom(socketAtom);
  const [user] = useAtom(userAtom);

  const [copied, setCopied] = useState(false);

  const [hostPlayer, setHostPlayer] = useState<PlayerDetails | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [playersJoinedArr, setPlayersJoinedArr] = useState<PlayerDetails[]>([]);

  const isHost = (user as any)?.id === hostPlayer?.id;

  const { data: categoryData, isLoading: isCategoryDataLoading } =
    useQuizCategories();

  const handleNewPlayerJoin = useCallback((newPlayer: PlayerDetails) => {
    setPlayersJoinedArr((prev) => {
      const exists = prev.find((player) => player?.id === newPlayer?.id);
      return exists ? prev : [...prev, newPlayer];
    });
  }, []);

  const handlePlayerLeft = useCallback((playerLeft: PlayerDetails) => {
    setPlayersJoinedArr((prev) =>
      prev.filter((player) => player?.id !== playerLeft?.id)
    );
  }, []);

  const handleQuizStart = useCallback(() => {
    setCurrentStep(GameLogicSteps.MATCH_STARTED);
  }, []);

  useEffect(() => {
    if (!socket || currentStep !== GameLogicSteps.LOBBY) return;

    socket.emit(
      SocketEvents.GET_ROOM_INFO_BY_ID,
      { roomId },
      (response: any) => {
        const roomDetails = response.roomData as RoomDetails;

        // console.log("roomDetails", roomDetails);
        setPlayersJoinedArr(roomDetails.players);
        let hostObj = roomDetails.players.find(
          (player) => player.id === roomDetails.hostId
        );
        setHostPlayer(hostObj);
      }
    );

    socket.on(SocketEvents.PLAYER_JOINED, handleNewPlayerJoin);
    socket.on(SocketEvents.PLAYER_LEFT, handlePlayerLeft);
    socket.on(SocketEvents.ROOM_QUIZ_STARTED, handleQuizStart);

    return () => {
      socket.off(SocketEvents.PLAYER_JOINED, handleNewPlayerJoin);
      socket.on(SocketEvents.PLAYER_LEFT, handlePlayerLeft);
      socket.off(SocketEvents.ROOM_QUIZ_STARTED, handleQuizStart);
    };
  }, [socket, currentStep]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function handleStartGame() {
    if (socket && selectedCategoryId) {
      socket.emit(SocketEvents.ROOM_START_QUIZ, {
        roomId: roomId,
        categoryId: parseInt(selectedCategoryId),
      });
    }
  }

  console.log(hostPlayer?.id);

  return (
    <div className="flex flex-col h-[80dvh] max-w-6xl w-full mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent h-full">
            Lobby
          </div>
        </div>

        {/* Room ID Card */}
        <div className="inline-flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
          <div className="text-left">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Room ID
            </p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {roomId}
            </p>
          </div>
          <button
            onClick={handleCopyRoomId}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 group"
            title="Copy Room ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            Players
          </span>
        </div>
      </div>

      {/* Players Section */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Players Joined
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
              {playersJoinedArr.length}
            </span>
          </h2>
          <div className="text-sm text-gray-500">
            {playersJoinedArr.length}/8 players
          </div>
        </div>

        {playersJoinedArr.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center max-w-sm">
              Waiting for players to join the game...
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {playersJoinedArr.map((player, index) => (
              <div
                key={player.id}
                className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {player.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-medium text-gray-900 truncate flex items-center gap-2">
                      {player.username}
                      {player?.username === hostPlayer?.username && (
                        <Badge
                          className={`bg-green-100 text-green-800 border-green-300 rounded-lg shadow-none whitespace-nowrap text-xs`}
                        >
                          HOST
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Player #{index + 1}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-pink-50/0 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            Category
          </span>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex items-center justify-center w-full">
        <Select
          // value={watch("venueUuid") || ""}
          onValueChange={(value) => {
            setSelectedCategoryId(value);
            socket?.emit(SocketEvents.CATEGORY_CHANGE, {
              roomId: roomId,
              categoryId: value,
            });
          }}
          disabled={!isHost}
        >
          <SelectTrigger
            data-testid="selectVenue"
            className="border bg-white w-72 px-3 py-2 text-[#1A1F3D] placeholder:text-sm placeholder:text-[#1A1F3D] border-gray-300 focus:outline-none focus:ring-primary_colour focus:border-primary_colour text-sm rounded-xl"
          >
            <SelectValue
              id="defaultVenueValue"
              placeholder="Select Quiz Category"
            />
          </SelectTrigger>
          <SelectContent className="text-sm z-[5000]">
            <SelectGroup>
              {!isCategoryDataLoading &&
                categoryData &&
                categoryData?.map((category: CategoryType) => (
                  <SelectItem value={String(category?.id)} key={category?.id}>
                    {category?.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Action Area */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={!selectedCategoryId}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
            >
              Start Game
            </button>
          )}
          <button className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl">
            Leave Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
