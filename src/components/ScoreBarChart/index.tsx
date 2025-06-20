import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { scoreObj } from "../../types/game.types";

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
];

interface ScoreBarChartProps {
  scoreObj: scoreObj;
}
const ScoreBarChart: React.FC<ScoreBarChartProps> = ({ scoreObj }) => {
  const sortedScores = [...scoreObj].sort((a, b) => b.score - a.score);

  const data = sortedScores.map((entry, index) => ({
    name: entry.user.username,
    score: entry.score,
    rank: index + 1,
  }));

  // Calculate dynamic height
  const chartHeight = Math.max(400, sortedScores.length * 80);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>🏆 Top {sortedScores.length} Players</span>
          <span>•</span>
          <span>Updated now</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
          barCategoryGap={12}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
            width={100}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]} fill="#6366f1">
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter:
                    index === 0
                      ? "drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))"
                      : "none",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Podium indicators for top 3 */}
      <div className="flex justify-center gap-4 mt-4">
        {data.slice(0, 3).map((player, index) => (
          <div key={player.name} className="flex items-center gap-2 text-sm">
            <span className="text-lg">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </span>
            <span className="font-medium text-gray-700">{player.name}</span>
            <span className="text-gray-500">
              ({player.score.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBarChart;
