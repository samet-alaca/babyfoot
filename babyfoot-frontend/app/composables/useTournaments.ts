import type { Tournament } from "~/types/tournament";

export const useTournaments = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const { data: tournaments, refresh, pending, error } = useFetch<Tournament[]>(`${apiBase}/tournaments`, {
    key: 'tournaments_list',
  });

  const getTournament = async (id: number) => {
    return await $fetch<Tournament>(`${apiBase}/tournaments/${id}`);
  };

  const createTournament = async (payload: object) => {
    return await $fetch<Tournament>(`${apiBase}/tournaments`, {
      method: 'POST',
      body: payload,
    });
  };

  const updateTournament = async (id: number, payload: object) => {
    return await $fetch<Tournament>(`${apiBase}/tournaments/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  };

  const deleteTournament = async (id: number) => {
    return await $fetch<void>(`${apiBase}/tournaments/${id}`, {
      method: 'DELETE',
    });
  };

  const closeTournament = async (id: number) => {
    return await $fetch<void>(`${apiBase}/tournaments/${id}/close`, {
      method: 'POST',
    });
  };

  const generateMatches = async (id: number) => {
    return await $fetch<void>(`${apiBase}/matches/generate/${id}`, {
      method: 'POST',
    });
  }

  return {
    tournaments,
    refresh,
    pending,
    error,
    createTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    closeTournament,
    generateMatches
  };
};