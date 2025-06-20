import React from "react";
import type { scoreObj } from "../../../types/game.types";
import ScoreBarChart from "../../../components/ScoreBarChart";

interface ScoreProps {
  scoreObj: scoreObj | null;
}

const MatchScore: React.FC<ScoreProps> = ({ scoreObj }) => {
  return (
    <div className="text-lg font-semibold items-center justify-center gap-2 flex flex-col">
      {scoreObj && <ScoreBarChart scoreObj={scoreObj} />}
    </div>
  );
};

export default MatchScore;
