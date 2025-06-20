export const GameLogicSteps = {
  INITIAL: 1,
  LOBBY: 2,
  MATCHING: 3,
  MATCHED: 4,
  COUNTDOWN: 5,
  MATCH_STARTED: 6,
  SCORE: 7,
} as const;

export const SocketEvents = {
  JOIN_QUEUE: "join-queue",
  ROOM_JOINED: "room-joined",
  MATCHED: "matched",
  CREATE_ROOM: "create-room",
  JOIN_ROOM: "join-room",
  START_QUIZ: "start-quiz",
  CLIENT_READY: "client-ready",
  QUIZ_QUESTION_SEND_EVENT: "quiz-question-send-event",
  QUIZ_ANSWER_RECEIVE_EVENT: "quiz-answer-receive-event",
  QUIZ_ANSWER_RESULT_EVENT: "quiz-answer-result-event",
  QUIZ_HANDLE_RESULTS_EVENT: "quiz-handle-results-event",

  GET_ROOM_INFO_BY_ID: "get-room-info-by-id",
  PLAYER_JOINED: "player-joined",
  PLAYER_LEFT: "player-left",
  ROOM_START_QUIZ: "room-start-quiz",
  ROOM_QUIZ_STARTED: "room-quiz-started",

  CATEGORY_CHANGE: "category-change"
} as const;
