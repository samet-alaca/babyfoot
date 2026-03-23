<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row gap-10 py-12 md:py-12">

      <div class="w-full md:w-80 shrink-0">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <h2 class="text-lg font-bold text-slate-800 mb-6">Inscrire une équipe</h2>
          
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom de l'équipe</label>
              <input v-model="form.name" type="text"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tournoi cible</label>
              <select v-model="form.tournamentId" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required>
                <option value="" disabled>Sélectionner un tournoi</option>
                <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>

            <button @click="handleCreate" :disabled="loading"
              class="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:shadow-blue-500/30 transition-all duration-300 flex justify-center items-center gap-2">
              <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Enregistrement...' : 'Inscrire l\'équipe' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h1 class="text-4xl font-black text-slate-900">Équipes</h1>
            <p class="text-slate-500 mt-2 font-medium">Inscrivez vos équipes aux tournois disponibles.</p>
          </div>
          <span class="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
            {{ teams?.length || 0 }} Équipes
          </span>
        </div>

        <div v-if="teams?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="team in teams" :key="team.id" 
            class="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="font-bold text-lg text-slate-800">{{ team.name }}</h3>
              <div class="flex items-center gap-2 mt-2">
                <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-tighter">
                  {{ team.tournament?.name || 'Sans tournoi' }}
                </span>
              </div>
            </div>
            
            <button @click="handleDelete(team.id)" 
              class="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
              <span class="text-xl">×</span>
            </button>

            <div class="absolute -right-4 -bottom-4 text-slate-50 text-6xl font-black italic opacity-20 group-hover:text-blue-50 transition-colors uppercase">
              #{{ team.id }}
            </div>
          </div>
        </div>

        <div v-else class="h-64 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 font-medium italic">
          Aucune équipe inscrite pour le moment.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { teams, createTeam, deleteTeam, refresh } = useTeams();
const { tournaments } = useTournaments();
const { $toast } = useNuxtApp();

const loading = ref(false);
const form = ref({
  name: '',
  tournamentId: ''
});

const handleCreate = () => {
  if (!form.value.name || !form.value.tournamentId) {
    $toast.error('Champs manquants', {
      description: 'Veuillez remplir tous les champs requis pour créer une équipe.'
    });
    return;
  }

  loading.value = true;

  createTeam(form.value)
    .then(() => {
      form.value.name = '';
      form.value.tournamentId = '';
      $toast.success('Équipe inscrite', {
        description: 'L\'équipe a été inscrite avec succès au tournoi.'
      });

      return refresh();
    })
    .catch(error => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la création de l\'équipe.';
      $toast.error("Erreur lors de la création.", {
        description: errorMessage
      });

      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleDelete = (id) => {
  if (!confirm('Confirmation de suppression ?'))
    return;
  
  deleteTeam(id)
    .then(() => {
      $toast.success('Équipe supprimée', {
        description: 'L\'équipe a été supprimée avec succès.'
      });

      return refresh();
    })
    .catch(error => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la suppression de l\'équipe.';
      $toast.error("Erreur lors de la suppression.", {
        description: errorMessage
      });

      console.error(error);
    });
};

</script>