<template>
  <div v-if="tournament" class="max-w-7xl mx-auto px-6 py-12">
    <nav class="mb-8 text-sm font-medium text-slate-400">
      <NuxtLink to="/tournaments" class="hover:text-blue-600 transition-colors">Tournois</NuxtLink> 
      <span class="mx-2">/</span>
      <span class="text-slate-900">{{ tournament.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-8">
        <section class="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase rounded-full tracking-wider">
                {{ tournament.status || 'Ouvert' }}
              </span>
              <span class="text-slate-400 text-sm italic">Créé le {{ formatDate(tournament.createdAt) }}</span>
            </div>
            
            <h1 class="text-5xl font-black text-slate-900 leading-none mb-6">
              {{ tournament.name }}
            </h1>

            <div class="flex flex-wrap gap-4 mt-8">
              <button @click="generateMatches" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                ⚡ Générer les Matchs
              </button>
              <button class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all">
                Modifier
              </button>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 text-[12rem] font-black italic text-slate-50 select-none">
            T{{ tournament.id }}
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900 text-white p-8 rounded-[2rem]">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Équipes</p>
            <p class="text-4xl font-black">{{ tournament.teams?.length || 0 }} <span class="text-lg text-slate-600">/ 16</span></p>
          </div>
          <div class="bg-white border border-slate-200 p-8 rounded-[2rem]">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Matchs Joués</p>
            <p class="text-4xl font-black">0%</p>
          </div>
          <div class="bg-white border border-slate-200 p-8 rounded-[2rem]">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Type</p>
            <p class="text-xl font-black uppercase italic">Championnat</p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <h3 class="text-xl font-bold px-2">Équipes engagées</h3>
        
        <div class="space-y-3">
          <div v-for="(team, index) in tournament.teams" :key="team.id" 
            class="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow">
            <div class="flex items-center gap-4">
              <span class="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-xs font-bold text-slate-400">
                {{ index + 1 }}
              </span>
              <span class="font-bold text-slate-800">{{ team.name }}</span>
            </div>
            <NuxtLink :to="`/teams/${team.id}`" class="text-blue-500 hover:underline text-sm font-medium">Voir</NuxtLink>
          </div>

          <div v-if="!tournament.teams?.length" class="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 italic">
            Aucune équipe inscrite
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

const { data: tournament, refresh } = await useFetch(`${config.public.apiBase}/tournaments/${route.params.id}`);

const generateMatches = async () => {
  if (tournament.value.teams?.length < 2) {
    $toast.error("Il faut au moins 2 équipes pour générer des matchs.");
    return;
  }

  $toast.info("L'algorithme de génération arrive bientôt !");
};
</script>