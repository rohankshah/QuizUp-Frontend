"use client"

import React, { useEffect, useState } from "react";
import { GameLogicSteps } from "../../../constants/consts";
import Spinner from "../../../components/Spinner";

interface MatchedProps {
  currentStep: Number;
  matchedOpponentNames: string[] | null;
}

const Matched: React.FC<MatchedProps> = ({
  currentStep,
  matchedOpponentNames,
}) => {
  const [gameCountdown, setGameCountdown] = useState(3);

  useEffect(() => {
    if (currentStep !== GameLogicSteps.MATCHED) return;

    let countdown = 3;
    setGameCountdown(countdown);
    const intervalId = setInterval(() => {
      countdown -= 1;
      setGameCountdown(countdown);
      if (countdown === 1) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStep]);

  return (
    <div className="text-lg font-semibold items-center justify-center gap-2 flex flex-col">
      <Spinner caption={`Starts in ${gameCountdown}`} />
      <div className="text-base">
        Opponent: {matchedOpponentNames?.map((name) => name + " ")}
      </div>
    </div>
  );
};

export default Matched;
