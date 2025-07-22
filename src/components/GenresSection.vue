<script setup>
const genres = [
  {
    id: 1,
    name: 'Rock',
    image: new URL('/imagenes/eventos/genero_rock.jpg', import.meta.url).href,
    description: 'Conciertos y festivales de Rock'
  },
  {
    id: 2,
    name: 'Cumbia',
    image: new URL('/imagenes/eventos/genero_cumbia.jpg', import.meta.url).href,
    description: 'Eventos y giras de Cumbia.'
  },
  {
    id: 3,
    name: 'Salsa',
    image: new URL('/imagenes/eventos/genero_salsa.jpg', import.meta.url).href,
    description: 'Salsa con los mejores.'
  },
  {
    id: 4,
    name: 'Folklore - Andino',
    image: new URL('/imagenes/eventos/musica_andina.jpg', import.meta.url).href,
    description: 'Festivales de música tradicional peruana.'
  }
];
</script>

<template>
  <section id="genres" class="relative py-32 overflow-hidden">
    <!-- Background con gradiente y efectos -->
    <div class="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,205,208,0.1),transparent_70%)]"></div>
    </div>

    <div class="relative container mx-auto max-w-6xl px-6">
      <div class="text-center mb-16">
        <h2 class="inline-block relative text-4xl font-bold mb-4 reveal-on-scroll">
          <span class="text-white">Géneros</span>
          <span class="text-secondary ml-2">Musicales</span>
        </h2>
        <p class="text-gray-300 max-w-2xl mx-auto mt-6 reveal-on-scroll">
          Nos especializamos en la producción de eventos de diversos géneros musicales,
          ofreciendo experiencias únicas para cada estilo.
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="genre in genres" 
          :key="genre.id" 
          class="reveal-on-scroll"
        >
          <div class="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105">
            <!-- Card Background & Image -->
            <div class="relative aspect-[3/4] overflow-hidden">
              <img 
                :src="genre.image" 
                :alt="genre.name" 
                class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>

            <!-- Content -->
            <div class="absolute inset-x-0 bottom-0 p-6">
              <h3 class="text-2xl font-bold text-white mb-2">{{ genre.name }}</h3>
              <p class="text-gray-300 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {{ genre.description }}
              </p>
              <a 
                href="#contact" 
                class="inline-block mt-4 text-secondary hover:text-white transition-colors duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              >
                Organizar evento →
              </a>
            </div>

            <!-- Hover Effect -->
            <div class="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
