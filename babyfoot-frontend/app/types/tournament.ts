export interface Team {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  awayTeam: Team;
  homeTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'PENDING' | 'FINISHED';
}

export interface Tournament {
  id: number;
  name: string;
  status: 'PENDING' | 'FINISHED';
  date: string;
  teams: Team[];
  matches: Match[];
  updatedAt?: string;
  createdAt?: string;
}