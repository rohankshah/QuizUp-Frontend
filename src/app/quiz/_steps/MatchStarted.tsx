"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { socketAtom } from "../../../atoms/atom";
import { GameLogicSteps, SocketEvents } from "../../../constants/consts";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface MatchStartedProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  matchId: string | null;
}

interface QuestionData {
  question: string;
  options: string[];
  questionIndex: number;
}

type OptionToPlayerIdsMap = {
  [option: string]: string[];
};

interface AnswerResultEvent {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  playersBySelectedOption: OptionToPlayerIdsMap;
}

const MatchStarted: React.FC<MatchStartedProps> = ({
  currentStep,
  // setCurrentStep,
  // matchId,
}) => {
  const [socket] = useAtom(socketAtom);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [playersBySelectedOption, setPlayersBySelectedOption] = useState<Record<
    string,
    string[]
  > | null>(null);

  const [correctOption, setCorrectOption] = useState<string | null>(null);

  console.log("correctOption", correctOption);

  const handleReceiveQuestion = (data: QuestionData) => {
    setIsCorrect(false);
    setIsIncorrect(false);
    setQuestionData(data);
    setSelectedOption(null);
    setCorrectOption(null);
  };

  function handleAnswerResultEvent(data: AnswerResultEvent) {
    if (data.isCorrect) {
      setIsCorrect(true);
    } else {
      setIsIncorrect(true);
    }
    setCorrectOption(data.correctAnswer);
    setPlayersBySelectedOption(data.playersBySelectedOption);
  }

  useEffect(() => {
    if (!socket || currentStep !== GameLogicSteps.MATCH_STARTED) return;

    socket.on(SocketEvents.QUIZ_QUESTION_SEND_EVENT, handleReceiveQuestion);
    socket.on(SocketEvents.QUIZ_ANSWER_RESULT_EVENT, handleAnswerResultEvent);

    return () => {
      socket.off(SocketEvents.QUIZ_QUESTION_SEND_EVENT, handleReceiveQuestion);
      socket.off(
        SocketEvents.QUIZ_ANSWER_RESULT_EVENT,
        handleAnswerResultEvent
      );
    };
  }, [socket, currentStep]);

  function handleOptionClick(option: string) {
    setSelectedOption(option);
    socket?.emit(SocketEvents.QUIZ_ANSWER_RECEIVE_EVENT, {
      questionIndex: questionData?.questionIndex,
      answer: option,
    });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 mt-8 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 pointer-events-none"></div>

      <div className="relative z-10">
        {questionData ? (
          <>
            {/* Header */}
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 leading-relaxed px-2">
                {questionData.question}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {questionData.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrectAnswer = correctOption === option;
                const isUserCorrect = isSelected && isCorrect;
                const isUserWrong = isSelected && isIncorrect;

                let bgClass =
                  "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
                let textClass = "text-gray-700";
                let iconClass = "";

                if (isUserCorrect) {
                  bgClass =
                    "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-green-100";
                  textClass = "text-green-800 font-semibold";
                  iconClass = "text-green-600";
                } else if (isUserWrong) {
                  bgClass =
                    "bg-gradient-to-r from-red-100 to-rose-100 border-red-300 shadow-red-100";
                  textClass = "text-red-800 font-semibold";
                  iconClass = "text-red-600";
                } else if (isSelected) {
                  bgClass =
                    "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 shadow-blue-100";
                  textClass = "text-blue-800 font-semibold";
                } else if (isCorrectAnswer) {
                  bgClass =
                    "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-green-100";
                  textClass = "text-green-800 font-semibold";
                  iconClass = "text-green-600";
                }

                return (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => handleOptionClick(option)}
                      className={`w-full px-6 py-4 text-left rounded-2xl border-2 shadow-lg ${bgClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white/50 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className={`text-base ${textClass}`}>
                            {option}
                          </span>
                        </div>
                        {(isUserCorrect ||
                          (isCorrectAnswer && !isSelected)) && (
                          <CheckCircle
                            className={`w-5 h-5 ${
                              iconClass || "text-green-600"
                            }`}
                          />
                        )}
                        {isUserWrong && (
                          <XCircle className={`w-5 h-5 ${iconClass}`} />
                        )}
                      </div>
                    </button>

                    {playersBySelectedOption?.[option] &&
                      playersBySelectedOption[option].length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 px-2">
                          {playersBySelectedOption[option].map(
                            (player, playerIndex) => (
                              <span
                                key={playerIndex}
                                className="inline-flex items-center text-xs bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-gray-700 font-medium border border-gray-200 shadow-sm"
                              >
                                <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-2"></div>
                                {player}
                              </span>
                            )
                          )}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Waiting for the question...
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchStarted;
