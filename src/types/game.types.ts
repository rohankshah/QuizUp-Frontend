export interface userObj {
  exp: number;
  iat: number;
  id: string;
  username: string;
}

export interface ScoreEntry {
  user: {
    username: string;
    userId: string;
  };
  score: number;
}

export type scoreObj = ScoreEntry[];
