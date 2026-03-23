<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <header class="py-12 md:py-20 text-center">
      <h1 class="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
        Gérez vos tournois de <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Babyfoot
        </span>
      </h1>
      <p class="text-lg text-slate-500 max-w-2xl mx-auto mb-10 font-medium">
        L'outil complet pour organiser, planifier et suivre vos compétitions en entreprise ou en club. Simple, rapide et automatisé.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <NuxtLink to="/tournaments" class="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-500/20">
          Commencer un tournoi
        </NuxtLink>
      </div>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">📅</div>
        <h3 class="text-xl font-bold mb-2">Planification</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Générez automatiquement les rencontres pour que chaque équipe s'affronte équitablement.
        </p>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6">👥</div>
        <h3 class="text-xl font-bold mb-2">Gestion d'Équipes</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Inscrivez facilement vos équipes et gérez les participants pour chaque édition de vos tournois.
        </p>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">📊</div>
        <h3 class="text-xl font-bold mb-2">Classement Live</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          Saisissez les scores et laissez l'algorithme calculer les points et le classement en temps réel.
        </p>
      </div>
    </section>

    <section class="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative">
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="max-w-md">
          <h2 class="text-3xl font-bold mb-4">Prêt à lancer le coup d'envoi ?</h2>
          <p class="text-slate-400 font-medium">Créez votre premier tournoi en moins de 30 secondes et invitez vos collègues.</p>
        </div>
        <NuxtLink to="/tournaments" class="bg-blue-500 hover:bg-blue-400 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all whitespace-nowrap">
          Créer un tournoi maintenant →
        </NuxtLink>
      </div>
      <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
    </section>
    <br/>
  </div>
</template>