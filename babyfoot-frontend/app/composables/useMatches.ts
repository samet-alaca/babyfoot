import type { Match } from "~/types/tournament";

export const useMatches = (tournamentId: number) => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const { data: matches, refresh, pending, error } = useFetch<Match[]>(`${apiBase}/matches/tournament/${tournamentId}`, {
    key: `matches_list_${tournamentId}`,
  });

  const updateMatchScore = async (match: Match) => {
      return await $fetch<Match>(`${apiBase}/matches/${match.id}`, {
        method: 'PATCH',
        body: { 
          homeScore: match.homeScore, 
          awayScore: match.awayScore 
        }
      });
  };

  const toggleStatus = async (match: Match) => {
    const newStatus = match.status === 'FINISHED' ? 'PENDING' : 'FINISHED';

    return await $fetch<Match>(`${apiBase}/matches/${match.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    });
  };

  const generateCalendar = async (tournamentId: number) => {
    return await $fetch<void>(`${apiBase}/matches/generate/${tournamentId}`, {
      method: 'POST'
    });
  };

  return {
    matches,
    refresh,
    pending,
    error,

    updateMatchScore,
    toggleStatus,
    generateCalendar
  };
};