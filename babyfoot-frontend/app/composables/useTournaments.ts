export const useTournaments = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const { data: tournaments, refresh, pending, error } = useFetch<any[]>(`${apiBase}/tournaments`, {
    key: 'tournaments_list',
  });

  const createTournament = async (payload: object) => {
    return await $fetch(`${apiBase}/tournaments`, {
      method: 'POST',
      body: payload,
    });
  };

  const updateTournament = async (id: number, payload: object) => {
    return await $fetch(`${apiBase}/tournaments/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  };

  const deleteTournament = async (id: number) => {
    return await $fetch(`${apiBase}/tournaments/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    tournaments,
    refresh,
    pending,
    error,
    createTournament,
    updateTournament,
    deleteTournament
  };
};