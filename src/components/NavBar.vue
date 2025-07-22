<script setup>
import { ref } from 'vue';

defineProps({
  isScrolled: {
    type: Boolean,
    default: false
  }
});

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const navLinks = [
  { name: 'Inicio', href: '#hero' },
  { name: 'Nosotros', href: '#about' },
  { name: 'Galería', href: '#gallery' },
  { name: 'Géneros', href: '#genres' },
];
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" 
    :class="[isScrolled ? 'nav-scrolled backdrop-blur-md' : 'nav-transparent']"
  >
    <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="text-white font-bold text-xl md:text-2xl relative group">
          <img src="../imagenes/conexion_logo.png" alt="Conexion360 Logo" class="h-12 w-auto" />
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href" 
            class="nav-link relative overflow-hidden group"
          >
            <span class="relative z-10">{{ link.name }}</span>
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </a>
          <a 
            href="#contact" 
            class="contact-btn relative overflow-hidden group"
          >
            <span class="relative z-10">Contáctanos</span>
            <div class="absolute inset-0 bg-gradient-to-r from-secondary-light to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
        
        <!-- Mobile Menu Button -->
        <button 
          class="md:hidden text-white focus:outline-none group"
          @click="toggleMenu"
        >
          <div class="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                v-if="!isMenuOpen" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
              <path 
                v-else 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <div class="absolute inset-0 bg-secondary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </button>
      </div>
    </nav>
    
    <!-- Mobile Navigation -->
    <div 
      v-if="isMenuOpen" 
      class="md:hidden bg-primary/95 backdrop-blur-md"
    >
      <div class="container mx-auto px-6 py-4 space-y-4">
        <a 
          v-for="link in navLinks" 
          :key="link.name"
          :href="link.href" 
          class="mobile-nav-link block py-2 relative group"
          @click="closeMenu"
        >
          <span class="relative z-10">{{ link.name }}</span>
          <div class="absolute inset-0 bg-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
        <a 
          href="#contact" 
          class="contact-btn block text-center"
          @click="closeMenu"
        >
          Contáctanos
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-transparent {
  background: linear-gradient(to bottom, rgba(3, 28, 59, 0.9) 0%, rgba(3, 28, 59, 0) 100%);
}

.nav-scrolled {
  background-color: rgba(3, 28, 59, 0.8);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.nav-link {
  @apply text-gray-300 hover:text-white transition-colors duration-300 font-medium;
}

.contact-btn {
  @apply bg-secondary/20 hover:bg-secondary text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:shadow-glow transform hover:scale-105;
}

.mobile-nav-link {
  @apply text-gray-300 hover:text-white transition-colors duration-300 font-medium;
}

.glow-text {
  text-shadow: 0 0 10px rgba(16, 205, 208, 0.5),
               0 0 20px rgba(16, 205, 208, 0.3);
}
</style>