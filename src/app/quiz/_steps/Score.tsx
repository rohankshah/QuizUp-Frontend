import React from "react";
import type { scoreObj } from "../../../types/game.types";
import { Award, Crown, Medal, Trophy } from "lucide-react";

interface ScoreProps {
  scoreObj: scoreObj | null;
}

const MatchScore: React.FC<ScoreProps> = ({ scoreObj }) => {
  const sortedScores = scoreObj
    ? [...scoreObj].sort((a, b) => b.score - a.score)
    : [];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <Trophy className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankGradient = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-100 to-amber-100 border-yellow-300";
      case 1:
        return "from-gray-100 to-slate-100 border-gray-300";
      case 2:
        return "from-orange-100 to-red-100 border-orange-300";
      default:
        return "from-blue-50 to-purple-50 border-blue-200";
    }
  };

  return (
    <div className="max-w-2xl w-3/4 mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-100 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-2">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Final Scores</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
        </div>

        {sortedScores.length > 0 ? (
          <div className="space-y-3">
            {sortedScores.map((entry, index) => {
              return (
                <div
                  key={entry.user.userId}
                  className={`relative p-4 rounded-2xl border-2 bg-gradient-to-r ${getRankGradient(
                    index
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center gap-2">
                        {getRankIcon(index)}
                        <span className="text-lg font-bold text-gray-700">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Player Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {entry.user.username.charAt(0).toUpperCase()}
                      </div>

                      {/* Player Name */}
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {entry.user.username}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        {entry.score.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No scores available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchScore;
