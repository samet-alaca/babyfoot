import type { Tournament } from "~/types/tournament";

export const useTournamentLogic = (tournament: Ref<Tournament>) => {
  const ranking = computed(() => {
    const teams = tournament.value?.teams || [];
    const matches = tournament.value?.matches || [];

    if (!teams.length)
      return [];

    const statsMap = new Map(teams.map(team => [
      team.id, 
      { ...team, points: 0, goalsDiff: 0, played: 0, goalsFor: 0, goalsAgainst: 0 }
    ]));

    matches
      .filter(m => m.status === 'FINISHED')
      .forEach(({ homeTeamId, awayTeamId, homeScore, awayScore }) => {
        const home = statsMap.get(homeTeamId);
        const away = statsMap.get(awayTeamId);

        if (!home || !away) return;

        home.played++;
        away.played++;
        home.goalsFor += homeScore;
        home.goalsAgainst += awayScore;
        away.goalsFor += awayScore;
        away.goalsAgainst += homeScore;
        
        home.goalsDiff = home.goalsFor - home.goalsAgainst;
        away.goalsDiff = away.goalsFor - away.goalsAgainst;

        if (homeScore > awayScore) {
          home.points += 3;
        } else if (awayScore > homeScore) {
          away.points += 3;
        } else {
          home.points += 1;
          away.points += 1;
        }
      });

    return Array.from(statsMap.values()).sort((a, b) => 
      b.points - a.points || b.goalsDiff - a.goalsDiff
    );
  });

  const completionRate = computed(() => {
    if (!tournament.value?.matches)
      return 0;
    
    const total = tournament.value.matches.length;
    
    if (total === 0)
      return 0;
    
    const done = tournament.value.matches.filter((m: any) => m.status === 'FINISHED').length;
    return Math.round((done / total) * 100);
  });

  const canClose = computed(() => {
    return (
      tournament.value?.status !== 'FINISHED' &&
      tournament.value?.matches?.length > 0 &&
      completionRate.value === 100
    );
  });

  return {
    ranking,
    completionRate,
    canClose
  };
};