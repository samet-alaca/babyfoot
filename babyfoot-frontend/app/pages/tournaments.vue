<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row gap-10 py-12 md:py-12">
      
      <div class="w-full md:w-80 shrink-0">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
          <h2 class="text-lg font-bold text-slate-800 mb-6">Nouveau Tournoi</h2>
          
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom du tournoi</label>
              <input v-model="form.name" type="text" placeholder="Ex: Summer Cup" 
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
            <p class="text-slate-500 mt-2 font-medium">Gérez vos compétitions et les inscriptions.</p>
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
            class="group relative bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
            
            <div class="flex justify-between items-start">
              <div class="flex gap-5">
                <div class="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                  🏆
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ t.name }}</h3>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="flex items-center text-sm font-medium text-slate-400 italic">
                      {{ formatDate(t.date) }}
                    </span>
                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span class="text-sm font-bold text-blue-500">8 Équipes max</span>
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <NuxtLink :to="`/tournaments/${t.id}`" 
                  class="p-2 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </NuxtLink>
                <button @click="handleDelete(t.id)" 
                  class="p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

<script setup>
const { tournaments, refresh, pending, createTournament, deleteTournament } = useTournaments();
const { $toast } = useNuxtApp()

const loading = ref(false);
const form = ref({ name: '', date: '', description: '' });

const handleCreate = () => {
  loading.value = true;

  createTournament(form.value)
    .then(() => {
      form.value = { name: '', date: '', description: '' };
      $toast.success('Tournoi créé !', {
        description: 'Le tournoi a été ajouté avec succès.'
      });
      return refresh();
    })
    .catch(error => {
      $toast.error('Erreur de création', {
        description: error.data?.message[0] || 'Une erreur est survenue lors de la création du tournoi.'
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
  
  deleteTournament(id)
    .then(() => {
      $toast.success('Tournoi supprimé !', {
        description: 'Le tournoi a été supprimé avec succès.'
      });

      return refresh();
    })
    .catch(error => {
      $toast.error('Erreur de suppression', {
        description: error.data?.message[0] || 'Une erreur est survenue lors de la suppression du tournoi.'
      });

      console.error(error);
    });
};
</script>