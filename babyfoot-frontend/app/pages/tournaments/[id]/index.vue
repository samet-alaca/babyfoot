<template>
  <div v-if="tournament" class="max-w-7xl mx-auto px-6 py-12">
    <nav class="mb-8 text-sm font-medium text-slate-400 flex items-center gap-2">
      <NuxtLink to="/tournaments" class="hover:text-blue-600 transition-colors">Tournois</NuxtLink> 
      <span>/</span>
      <span class="text-slate-900">{{ tournament.name }}</span>
    </nav>

    <Transition name="bounce">
      <div v-if="tournament.status === 'FINISHED'" 
        class="mb-10 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 p-1 rounded-[3rem] shadow-xl shadow-yellow-500/20">
        <div class="bg-white rounded-[2.9rem] py-8 px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div class="flex items-center gap-6">
            <span class="text-6xl">🏆</span>
            <div>
              <p class="text-yellow-600 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Champion Officiel</p>
              <h2 class="text-4xl font-black text-slate-900">{{ tournament.winner?.name || ranking[0]?.name }}</h2>
            </div>
          </div>
          <div class="bg-yellow-50 px-6 py-3 rounded-2xl border border-yellow-100">
            <p class="text-yellow-700 font-bold text-sm">Tournoi clôturé le {{ formatDate(tournament.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-8">
        <section class="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
              <span :class="[
                'px-3 py-1 text-xs font-black uppercase rounded-full tracking-wider',
                tournament.status === 'FINISHED' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
              ]">
                {{ tournament.status === 'FINISHED' ? 'Terminé' : 'En cours' }}
              </span>
              <span class="text-slate-400 text-sm italic">Créé le {{ formatDate(tournament.createdAt) }}</span>
            </div>
            
            <h1 class="text-5xl font-black text-slate-900 leading-tight mb-8">
              {{ tournament.name }}
            </h1>

            <div class="flex flex-wrap gap-4">
              <NuxtLink v-if="tournament.matches?.length > 0" 
                :to="`/tournaments/${tournament.id}/matches`" 
                class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-3">
                Calendrier & Scores
                <span class="bg-slate-700 px-2 py-0.5 rounded-lg text-xs">{{ tournament.matches.length }}</span>
              </NuxtLink>
              
              <button v-else @click="handleGenerate" :disabled="isGenerating"
                class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
                {{ isGenerating ? 'Génération...' : 'Générer les Matchs' }}
              </button>

              <button v-if="canClose" @click="handleClose"
                class="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 animate-pulse">
                Clôturer le Tournoi
              </button>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 text-[12rem] font-black italic text-slate-50/50 select-none -rotate-12">
            T{{ tournament.id }}
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900 text-white p-8 rounded-[2rem]">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Équipes</p>
            <p class="text-4xl font-black">{{ tournament.teams?.length || 0 }} <span class="text-lg text-slate-600">/ 8</span></p>
          </div>
          <div class="bg-white border border-slate-200 p-8 rounded-[2rem]">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Progression</p>
            <p class="text-4xl font-black">{{ completionRate }}%</p>
            <div class="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div class="bg-blue-600 h-full transition-all duration-1000" :style="{ width: completionRate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-xl font-bold text-slate-900">Classement Live</h3>
          <div class="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>
        
        <div class="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="py-4 pl-6 text-[10px] font-black text-slate-400 uppercase">Pos</th>
                <th class="py-4 text-[10px] font-black text-slate-400 uppercase">Équipe</th>
                <th class="py-4 text-[10px] font-black text-slate-400 uppercase text-center">Pts</th>
                <th class="py-4 pr-6 text-[10px] font-black text-slate-400 uppercase text-right">Diff</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ranking" :key="item.id" 
                class="border-b border-slate-50 last:border-0 transition-colors">
                <td class="py-4 pl-6">
                  <span :class="[
                    'w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-black',
                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'
                  ]">
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="py-4 font-bold text-slate-800 text-sm">{{ item.name }}</td>
                <td class="py-4 text-center font-black text-slate-900">{{ item.points }}</td>
                <td class="py-4 pr-6 text-right font-medium text-slate-400 text-xs">
                  {{ item.goalsDiff > 0 ? '+' : '' }}{{ item.goalsDiff }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!tournament.matches?.length" class="p-10 text-center text-slate-400 italic text-sm">
            Générez les matchs pour voir le classement
          </div>
        </div>
      </div>

    </div>
  </div>

  <div v-else class="max-w-2xl mx-auto mt-20 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
    <h2 class="text-2xl font-bold text-slate-900 mb-4">Tournoi introuvable</h2>
    <p class="text-slate-500 italic">Le tournoi que vous recherchez n'existe pas ou a été supprimé.</p>
    <NuxtLink to="/tournaments" class="inline-block mt-6 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
      Retour à la liste des tournois
    </NuxtLink>
  </div>
</template>

<script setup>
import confetti from 'canvas-confetti';

const route = useRoute();
const { $toast } = useNuxtApp();

const { getTournament, closeTournament, generateMatches } = useTournaments();
const { data: tournament, refresh } = await useAsyncData(`tournament_${route.params.id}`, () => getTournament(Number(route.params.id)));
const { ranking, completionRate, canClose } = useTournamentLogic(tournament);
const isGenerating = ref(false);

const handleGenerate = () => {
  isGenerating.value = true;

  generateMatches(tournament.value.id)
    .then(() => {
      refresh();
      $toast.success("Calendrier généré !");
    })
    .catch((error) => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la génération du calendrier.';
      $toast.error("Erreur lors de la génération.", {
        description: errorMessage
      });
      console.error(error);
    })
    .finally(() => {
      isGenerating.value = false;
    });
};

const handleClose = () => {
  closeTournament(tournament.value.id)
    .then(() => {
      refresh();
      $toast.success("Tournoi clôturé !");

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#fbbf24', '#10b981']
      });
    })
    .catch((error) => {
      const errorMessage = Array.isArray(error.data?.message) ? error.data.message.join(' ') : error.data?.message || 'Une erreur est survenue lors de la clôture du tournoi.';
      $toast.error("Erreur lors de la clôture.", {
        description: errorMessage
      });
      console.error(error);
    });
};
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
</style>