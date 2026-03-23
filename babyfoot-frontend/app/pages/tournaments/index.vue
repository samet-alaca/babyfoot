<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row gap-10 py-12 md:py-12">
      
      <div class="w-full md:w-80 shrink-0">
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <h2 class="text-lg font-bold text-slate-800 mb-6">Nouveau Tournoi</h2>
          
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom du tournoi</label>
              <input v-model="form.name" type="text" placeholder="Ex: Tournoi 1"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date de l'événement</label>
              <input v-model="form.date" type="date" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <button @click="handleCreate" :disabled="loading"
              class="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:shadow-blue-500/30 transition-all duration-300 flex justify-center items-center gap-2">
              <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Enregistrement...' : 'Créer le tournoi' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h1 class="text-4xl font-black text-slate-900">Tournois</h1>
            <p class="text-slate-500 mt-2 font-medium">Gérez vos compétitions et suivez les résultats.</p>
          </div>
          <span class="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
            {{ tournaments?.length || 0 }} Tournois
          </span>
        </div>

        <div v-if="pending" class="grid gap-4">
          <div v-for="i in 3" :key="i" class="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>
        </div>

        <div v-else class="grid gap-6">
          <div v-for="t in tournaments" :key="t.id" 
            class="group relative bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
            
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div class="flex gap-5 items-center">
                <div :class="[
                  'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-colors',
                  t.status === 'FINISHED' ? 'bg-yellow-50 text-yellow-500' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                ]">
                  {{ t.status === 'FINISHED' ? '👑' : '🏆' }}
                </div>

                <div>
                  <div class="flex items-center gap-3">
                    <h3 class="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ t.name }}</h3>
                    <span :class="[
                      'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider',
                      t.status === 'FINISHED' ? 'bg-slate-100 text-slate-500' : 
                      t.matches?.length > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    ]">
                      {{ t.status === 'FINISHED' ? 'Terminé' : t.matches?.length > 0 ? 'En cours' : 'Inscriptions' }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span class="text-sm font-medium text-slate-400 italic">
                      {{ formatDate(t.date) }}
                    </span>
                    <span class="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    <span class="text-sm font-bold" :class="t.teams?.length >= 8 ? 'text-orange-500' : 'text-slate-600'">
                      {{ t.teams?.length || 0 }} / 8 Équipes
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <NuxtLink :to="`/tournaments/${t.id}`" 
                  class="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md">
                  Gérer
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </NuxtLink>
                
                <button @click="handleDelete(t.id)" 
                  class="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { tournaments, refresh, pending, createTournament, deleteTournament } = useTournaments();
const { $toast } = useNuxtApp()

const loading = ref(false);
const form = ref({ name: '', date: '', description: '' });

onMounted(() => {
  refresh();
});

const handleCreate = () => {
  if (!form.value.name || !form.value.date) {
    $toast.error('Champs manquants', {
      description: 'Veuillez remplir tous les champs requis.'
    });
    return;
  }

  loading.value = true;
  createTournament(form.value)
    .then(() => {
      form.value = { name: '', date: '', description: '' };
      $toast.success('Tournoi créé !');
      return refresh();
    })
    .catch(error => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la création du tournoi.';
      $toast.error('Erreur', { description: errorMessage });
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleDelete = (id: number) => {
  if (!confirm('Voulez-vous vraiment supprimer ce tournoi ? Tous les matchs et scores associés seront perdus.'))
    return;
  
  deleteTournament(id)
    .then(() => {
      $toast.success('Tournoi supprimé');
      return refresh();
    })
    .catch(error => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la suppression du tournoi.';
      $toast.error('Erreur', { description: errorMessage });
      console.error(error);
    });
};
</script>