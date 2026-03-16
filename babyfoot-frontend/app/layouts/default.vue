<template>
  <div class="flex flex-col h-full bg-[#fafafa] font-sans antialiased text-[#1a1a1a]">
    <client-only>
      <Toaster position="top-center" richColors  />
    </client-only>

    <nav class="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shrink-0">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="hover:scale-105 transition-transform">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xl shadow-black/20">⚽</div>
            <span class="text-2xl font-black tracking-tighter uppercase italic">Babyfoot<span class="text-blue-600">.</span>io</span>
          </div>
        </NuxtLink>
        
        <div class="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-gray-400">
          <NuxtLink to="/tournaments" class="hover:text-black transition-colors">Tournois</NuxtLink>
          <NuxtLink to="/teams" class="hover:text-black transition-colors">Équipes</NuxtLink>
          <NuxtLink to="/matches" class="hover:text-black transition-colors">Matchs</NuxtLink>
          <div class="h-4 w-px bg-gray-200"></div>
          <button class="bg-black text-white px-5 py-2.5 rounded-full hover:scale-105 transition-transform">Admin</button>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <slot />
    </main>

    <Footer class="shrink-0"/>
  </div>
</template>