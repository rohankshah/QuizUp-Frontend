"use client"

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import Initial from "./_steps/Initial";
import Matched from "./_steps/Matched";
import MatchStarted from "./_steps/MatchStarted";
import MatchScore from "./_steps/Score";
import RoomLobby from "./_steps/RoomLobby";
import { socketAtom } from "../../atoms/atom";
import Spinner from "../../components/Spinner";
import { GameLogicSteps, SocketEvents } from "../../constants/consts";
import { scoreObj, userObj } from "../../types/game.types";

const index = () => {
  const [socket] = useAtom(socketAtom);
  const [matchedOpponentNames, setMatchedOpponentNames] = useState<
    string[] | null
  >(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<scoreObj | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(
    GameLogicSteps.INITIAL
  );

  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (!socket) return;

    function handleMatched(data: { opponentObjs: userObj[]; matchId: string }) {
      setMatchedOpponentNames(data.opponentObjs.map((obj) => obj.username));
      setMatchId(data.matchId);
      setCurrentStep(GameLogicSteps.MATCHED);
    }

    function handleStartQuizEvent() {
      setTimeout(() => {
        setCurrentStep(GameLogicSteps.MATCH_STARTED);
      }, 3000);
    }

    function handleQuizResultsEvent(data: any) {
      setCurrentStep(GameLogicSteps.SCORE);
      setFinalScore(data.scoreObj);
    }

    socket.on(SocketEvents.MATCHED, handleMatched);

    socket.on(SocketEvents.START_QUIZ, handleStartQuizEvent);

    socket.on(SocketEvents.QUIZ_HANDLE_RESULTS_EVENT, handleQuizResultsEvent);

    return () => {
      socket.off(SocketEvents.MATCHED, handleMatched);
      socket.off(SocketEvents.START_QUIZ, handleStartQuizEvent);
      socket.off(
        SocketEvents.QUIZ_HANDLE_RESULTS_EVENT,
        handleQuizResultsEvent
      );
    };
  }, [socket]);

  const ComponentMapping = {
    [GameLogicSteps.INITIAL]: (
      <Initial
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setRoomId={setRoomId}
      />
    ),
    [GameLogicSteps.LOBBY]: (
      <RoomLobby
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        roomId={roomId}
      />
    ),
    [GameLogicSteps.MATCHING]: <Spinner caption="Matching with someone..." />,
    [GameLogicSteps.MATCHED]: (
      <Matched
        currentStep={currentStep}
        matchedOpponentNames={matchedOpponentNames}
      />
    ),
    [GameLogicSteps.MATCH_STARTED]: (
      <MatchStarted
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        matchId={matchId}
      />
    ),
    [GameLogicSteps.SCORE]: <MatchScore scoreObj={finalScore} />,
  };

  return (
    <div className="max-w-7xl h-full flex justify-center items-center w-full">
      {ComponentMapping[currentStep as keyof typeof ComponentMapping]}
    </div>
  );
};

export default index;
