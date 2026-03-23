<template>
  <footer class="bg-[#0a0a0a] text-white pt-20 pb-10 mt-20 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        
        <div class="md:col-span-5 space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span class="text-xl">⚽</span>
            </div>
            <span class="text-2xl font-black tracking-tighter uppercase italic">
              Babyfoot<span class="text-blue-500">.</span>io
            </span>
          </div>
          <p class="text-gray-400 max-w-sm text-sm leading-relaxed">
            La plateforme de référence pour l'organisation de tournois d'entreprise. 
            Suivez vos scores, gérez vos équipes et dominez le classement.
          </p>
        </div>

        <div class="md:col-span-3">
          <h4 class="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Navigation</h4>
          <ul class="space-y-4">
            <li v-for="item in navigation" :key="item.name">
              <NuxtLink :to="item.href" class="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center group">
                <span class="w-0 group-hover:w-4 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="md:col-span-4 bg-white/5 border border-white/10 rounded-[2rem] p-8 relative group overflow-hidden">
          <h4 class="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Tech Stack</h4>
          <p class="text-sm text-gray-300 mb-6 leading-relaxed">
            Propulsé par <span class="text-white font-bold">Nuxt 3</span> & <span class="text-white font-bold">NestJS</span>.
          </p>
          <a href="https://github.com/samet-alaca/babyfoot" target="_blank" class="inline-flex items-center gap-2 text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all">
            GitHub Repository
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-colors"></div>
        </div>
      </div>

      <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
          &copy; 2026 Babyfoot.io — All rights reserved
        </p>
        <div class="flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <a href="#" class="hover:text-white transition-colors">Security</a>
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <div class="h-3 w-px bg-white/10"></div>
          <span class="text-white/20 italic font-serif lowercase tracking-normal text-sm">crafted with precision</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const navigation = [
  { name: 'Tournois', href: '/tournaments' },
  { name: 'Équipes', href: '/teams' },
  { name: 'Documentation API', href: 'http://localhost:4000/api' },
]
</script>