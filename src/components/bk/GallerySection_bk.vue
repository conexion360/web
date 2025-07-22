<script setup>
import { ref, onMounted } from 'vue';

// Importar imágenes correctamente
import viernes09 from '/imagenes/nuevos/viernes09.jpg';
import sabado10 from '/imagenes/nuevos/sabado10.jpg';
import domingo11 from '/imagenes/nuevos/domingo11.jpg';

import viernes09Mayo from '/imagenes/eventos/viernes09_mayo.jpg';
import sabado10Mayo from '/imagenes/eventos/sabado10_mayo.jpg';
import domingo11Mayo from '/imagenes/eventos/domingo11_mayo.jpg';
import amaranta11 from '/imagenes/eventos/amaranta11.jpg';
import bellaluz09 from '/imagenes/eventos/bellaluz09.jpg';
import corazonSerrano09 from '/imagenes/eventos/corazonserrano09.jpg';

// Array de eventos con las imágenes importadas
const events = [
  {
    id: 2,
    title: 'Viernes 09 Mayo',
    image: viernes09
  },
  
  {
    id: 3,
    title: 'Sabado 10 Mayo',
    image: sabado10
  },
  
  {
    id: 4,
    title: 'Domingo 11 Mayo',
    image: domingo11
  },
  
  {
    id: 5,
    title: 'Viernes 09 Mayo',
    image: viernes09Mayo
  },
  {
    id: 6,
    title: 'Sábado 10 Mayo',
    image: sabado10Mayo
  },
  {
    id: 7,
    title: 'Domingo 11 Mayo',
    image: domingo11Mayo
  },
  {
    id: 8,
    title: 'Domingo 11 Mayo',
    image: amaranta11
  },
  {
    id: 9,
    title: 'Domingo 11 Mayo',
    image: bellaluz09
  },
  {
    id: 10,
    title: 'Domingo 11 Mayo',
    image: corazonSerrano09
  }
];

const activeEvent = ref(null);

const openEvent = (event) => {
  activeEvent.value = event;
};

const closeEvent = () => {
  activeEvent.value = null;
};

onMounted(() => {
  // Event listener para la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeEvent.value) {
      closeEvent();
    }
  });
  
  // Implementación del efecto reveal-on-scroll usando Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observar todos los elementos con la clase reveal-on-scroll
  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observer.observe(el);
  });
  
  // Cargar el script de Elfsight para TikTok
  if (!document.getElementById('elfsight-script')) {
    const script = document.createElement('script');
    script.id = 'elfsight-script';
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.head.appendChild(script);
  }
});
</script>

<template>
  <section id="gallery" class="relative py-32 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary-dark to-primary">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,205,208,0.1),transparent_50%)]"></div>
    </div>
    <div class="relative container mx-auto max-w-6xl px-6">
      <div class="text-center mb-16">
        <h2 class="inline-block relative text-4xl font-bold mb-4 reveal-on-scroll">
          <span class="text-white">Próximos</span>
          <span class="text-secondary ml-2">Eventos</span>
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="event in events" 
          :key="event.id"
          class="reveal-on-scroll"
        >
          <div 
            class="relative group rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105"
            @click="openEvent(event)"
          >
            <div class="relative aspect-[3/4] overflow-hidden">
              <img 
                :src="event.image" 
                :alt="event.title" 
                class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- TikTok Feed Section -->
      <div class="mt-24 reveal-on-scroll">
        <div class="text-center mb-16">
          <h2 class="inline-block relative text-4xl font-bold mb-4">
            <span class="text-white">Síguenos en</span>
            <span class="text-secondary ml-2">TikTok</span>
          </h2>
        </div>
        <div class="elfsight-app-24bdd9b1-41d7-4471-b9c8-d0509f42ef85" data-elfsight-app-lazy></div>
      </div>
    </div>
    
    <!-- Modal -->
    <div 
      v-if="activeEvent" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="closeEvent"
    >
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      <div 
        class="relative max-w-7xl w-full h-[90vh] animate-fade-in"
        @click.stop
      >
        <button 
          class="absolute top-4 right-4 text-white/50 hover:text-white z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
          @click="closeEvent"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img 
          :src="activeEvent.image" 
          :alt="activeEvent.title" 
          class="w-full h-full object-contain"
        />
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
/* Asegúrate de que la animación para el modal esté definida */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
</style>
