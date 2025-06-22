"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { socketAtom } from "../../../atoms/atom";
import { GameLogicSteps, SocketEvents } from "../../../constants/consts";

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
    <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-md mt-6 space-y-4">
      {questionData ? (
        <>
          <h2 className="text-lg font-semibold text-gray-800">
            {questionData.question}
          </h2>
          <div className="space-y-3">
            {questionData.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = correctOption === option;
              const isUserCorrect = isSelected && isCorrect;
              const isUserWrong = isSelected && isIncorrect;

              let bgClass = "bg-gray-100 hover:bg-blue-100";

              if (isUserCorrect) {
                bgClass = "bg-green-200";
              } else if (isUserWrong) {
                bgClass = "bg-red-200";
              } else if (isSelected) {
                bgClass = "bg-blue-200"; // selected but not yet graded
              } else if (isCorrectAnswer) {
                bgClass = "bg-green-200"; // correct answer revealed
              }
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleOptionClick(option)}
                    className={`w-full px-4 py-3 text-left rounded-xl transition duration-200 ${bgClass}`}
                  >
                    {option}
                  </button>
                  {playersBySelectedOption?.[option] &&
                    playersBySelectedOption[option].length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {playersBySelectedOption[option].map(
                          (player, playerIndex) => (
                            <span
                              key={playerIndex}
                              className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700"
                            >
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
        <p className="text-gray-500 text-center">Waiting for the question...</p>
      )}
    </div>
  );
};

export default MatchStarted;
