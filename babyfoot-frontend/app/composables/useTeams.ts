import type { Team } from "~/types/tournament";

export const useTeams = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const { data: teams, refresh, pending, error } = useFetch<Team[]>(`${apiBase}/teams`, {
    key: 'teams_list',
  });
  
  const createTeam = async (payload: object) => {
    return await $fetch(`${apiBase}/teams`, {
      method: 'POST',
      body: payload,
    });
  };

  const updateTeam = async (id: number, payload: object) => {
    return await $fetch(`${apiBase}/teams/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  };

  const deleteTeam = async (id: number) => {
    return await $fetch(`${apiBase}/teams/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    teams,
    refresh,
    pending,
    error,
    createTeam,
    updateTeam,
    deleteTeam
  };
};