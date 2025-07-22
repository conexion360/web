<script setup>
import { ref, onMounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import MusicPlayer from './MusicPlayer.vue';
import 'swiper/css';
import 'swiper/css/effect-fade';

const isLoaded = ref(false);
const isMobile = ref(false);

onMounted(() => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  
  setTimeout(() => {
    isLoaded.value = true;
  }, 150);
});

function checkIsMobile() {
  isMobile.value = window.innerWidth < 640;
}

const artists = [
  {
    id: 1,
    image: new URL('../imagenes/cs.jpg', import.meta.url).href,
    mobileBg: new URL('../imagenes/cs_mobile_bg.jpg', import.meta.url).href || '#001642',
    alt: 'Artista en concierto 1'
  },
  {
    id: 2,
    image: new URL('../imagenes/bellaluz.jpg', import.meta.url).href,
    mobileBg: new URL('../imagenes/mobile_bellaluz.jpg', import.meta.url).href || '#001642',
    alt: 'Artista en concierto 2'
  },
  {
    id: 3,
    image: new URL('../imagenes/mdc.jpg', import.meta.url).href,
    mobileBg: new URL('../imagenes/mobile_mardecopas.jpg', import.meta.url).href || '#001642',
    alt: 'Artista en concierto 3'
  },
  {
    id: 4,
    image: new URL('../imagenes/josimar.jpg', import.meta.url).href,
    mobileBg: new URL('../imagenes/josimar.jpg', import.meta.url).href || '#001642',
    alt: 'Artista en concierto 4'
  },
  {
    id: 5,
    image: new URL('../imagenes/karibenos.jpg', import.meta.url).href,
    mobileBg: new URL('../imagenes/mobile_caribenos.jpg', import.meta.url).href || '#001642',
    alt: 'Artista en concierto 5'
  },
  {
    id: 6,
    image: new URL('../imagenes/bt.jpg', import.meta.url).href,
    mobileBg: new URL('../imagenes/mobile_bt.jpg', import.meta.url).href || '#001642',
    alt: 'Artista en concierto 6'
  }
];
</script>

<template>
  <section id="hero" class="relative min-h-screen flex items-center overflow-hidden">
    <!-- Background Slider -->
    <div class="absolute inset-0 z-0">
      <Swiper
        :modules="[Autoplay, EffectFade]"
        :slides-per-view="1"
        :effect="'fade'"
        :speed="800"
        :autoplay="{
          delay: 4000,
          disableOnInteraction: false
        }"
        class="absolute inset-0 w-full h-full"
      >
        <SwiperSlide v-for="artist in artists" :key="artist.id" class="w-full h-full">
          <div class="relative w-full h-full">
            <!-- Desktop image -->
            <img v-if="!isMobile"
              :src="artist.image" 
              :alt="artist.alt"
              class="w-full h-full object-cover"
            />
            
            <!-- Mobile image -->
            <div v-else class="w-full h-full">
              <img 
                :src="artist.mobileBg" 
                :alt="artist.alt"
                class="w-full h-full object-cover"
                style="object-position: center 20%;"
              />
            </div>
            
            <!-- Gradient overlay -->
            <div class="absolute inset-0" :class="{
              'bg-gradient-to-b from-primary/90 via-primary/70 to-primary/50': isMobile,
              'bg-gradient-to-r from-primary/95 via-primary/70 to-primary/40': !isMobile
            }"></div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    
    <!-- Content -->
    <div class="relative z-20 container mx-auto px-4 md:px-6" :class="{
      'pt-32 pb-16': isMobile,
      'py-0': !isMobile
    }">
      <div class="max-w-4xl relative" :class="{
        'mt-[45vh]': isMobile,
        'pl-0 sm:pl-4 md:pl-8': !isMobile
      }"
      :style="{
        transition: 'all 1s ease-out',
        opacity: isLoaded ? '1' : '0',
        transform: isLoaded ? 'translateX(0)' : 'translateX(-2rem)'
      }">
        <!-- Logo (desktop only) -->
        <div v-if="!isMobile" class="mb-6 md:mb-8 text-center sm:text-left">
          <img 
            src="../imagenes/conexion_logo.png" 
            alt="Conexion360 Logo" 
            class="w-64 sm:w-80 md:w-[600px] h-auto mx-auto sm:mx-0 transform transition-all duration-1000 hover:scale-105"
          />
        </div>
        
        <!-- Description -->
        <p class="text-gray-300 text-base md:text-xl mb-6 md:mb-12 text-center sm:text-left leading-relaxed max-w-xl mx-auto sm:mx-0"
           :class="[isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
           style="transition: all 1s ease-out 0.5s">
          Líderes en la producción y organización de eventos de Rock, 
          Cumbia, Salsa, Folklore y más. Convierte tu evento en una 
          experiencia inolvidable con nosotros.
        </p>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mb-8 md:mb-16 justify-center sm:justify-start"
             :class="[isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
             style="transition: all 1s ease-out 0.7s">
          <a href="#contact" class="btn-primary group w-full sm:w-auto text-center">
            <span class="relative z-10">CONTACTANOS</span>
            <div class="absolute inset-0 bg-gradient-to-r from-secondary-light to-secondary opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </a>
          <a href="#about" class="btn-outline group w-full sm:w-auto text-center">
            <span class="relative z-10">CONOCE MÁS</span>
            <div class="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-light opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </a>
        </div>

        <!-- Genre icons -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-8 max-w-xs sm:max-w-sm mx-auto sm:mx-0 mb-8">
          <div v-for="(genre, index) in ['Rock', 'Cumbia', 'Salsa', 'Folklore']" 
               :key="genre"
               class="opacity-0 transform transition-all duration-500"
               :class="[isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8']"
               :style="{transitionDelay: `${800 + index * 100}ms`}">
            <div class="bg-white/5 backdrop-blur-sm rounded-xl p-2 md:p-4 hover:bg-white/10 transition-all duration-500 transform hover:scale-110 hover:shadow-glow group">
              <div class="relative">
                <span class="text-xl md:text-2xl">{{ ['🎸', '💃', '🎺', '🪘'][index] }}</span>
                <div class="absolute inset-0 bg-secondary/10 filter blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
              <p class="text-xs md:text-sm text-gray-300 mt-2 font-medium">{{ genre }}</p>
            </div>
          </div>
        </div>

        <!-- Music player -->
        <div class="opacity-0 transform transition-all duration-1000 delay-900 mx-auto sm:mx-0 max-w-xs sm:max-w-none"
             :class="[isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-8']">
          <MusicPlayer />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.glow-text {
  text-shadow: 0 0 20px rgba(16, 205, 208, 0.5),
               0 0 40px rgba(16, 205, 208, 0.3),
               0 0 60px rgba(16, 205, 208, 0.1);
}

:deep(.swiper-slide) {
  opacity: 0 !important;
  transition: opacity 1.5s ease;
}

:deep(.swiper-slide-active) {
  opacity: 1 !important;
}
</style>