<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="mb-10">
      <NuxtLink :to="`/tournaments/${route.params.id}`" class="text-sm font-bold text-blue-600 hover:underline">
        ← Retour au tableau de bord
      </NuxtLink>
      <h1 class="text-4xl font-black text-slate-900 mt-4 uppercase italic">
        Calendrier <span class="text-blue-600">des rencontres</span>
      </h1>
    </div>

    <div v-if="matches && matches.length" class="space-y-6">
      <div v-for="match in matches" :key="match.id" 
        class="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
        
        <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          
          <div class="text-center md:text-right">
            <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Domicile</p>
            <p class="text-xl font-bold text-slate-900">{{ match.homeTeam?.name }}</p>
          </div>

          <div class="flex flex-col items-center gap-3">
            <div class="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <input 
                type="number"
                min="0"
                v-model.number="match.homeScore" 
                @change="handleUpdateScore(match)"
                class="w-14 h-14 text-2xl font-black text-center bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span class="text-slate-300 font-bold italic">VS</span>
              <input 
                type="number"
                min="0"
                v-model.number="match.awayScore" 
                @change="handleUpdateScore(match)"
                class="w-14 h-14 text-2xl font-black text-center bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <button 
              @click="handleToggleStatus(match)"
              :class="[
                'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all',
                match.status === 'FINISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              ]"
            >
              {{ match.status === 'FINISHED' ? 'Terminé' : 'En attente' }}
            </button>
          </div>

          <div class="text-center md:text-left">
            <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Extérieur</p>
            <p class="text-xl font-bold text-slate-900">{{ match.awayTeam?.name }}</p>
          </div>

        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
      <p class="text-slate-400 font-medium italic">Aucun match n'a été généré pour ce tournoi.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Match } from '~/types/tournament';

const route = useRoute();
const { matches, refresh, pending, updateMatchScore, toggleStatus } = useMatches(Number(route.params.id));
const { $toast } = useNuxtApp();
const loading = ref(false);

const handleUpdateScore = (match: Match) => {
  loading.value = true;
  updateMatchScore(match)
    .then(() => {
      refresh();
      $toast.success('Score mis à jour avec succès');
    })
    .catch(error => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la mise à jour du score.';
      $toast.error('Erreur', { description: errorMessage });
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleToggleStatus = (match: Match) => {
  loading.value = true;
  toggleStatus(match)
    .then(() => {
      refresh();
      $toast.success('Statut du match mis à jour');
    })
    .catch(error => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la mise à jour du statut du match.';
      $toast.error('Erreur', { description: errorMessage });
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });  
};

</script>