<script setup>
import HeroSection from './components/HeroSection.vue';
import NavBar from './components/NavBar.vue';
import AboutSection from './components/AboutSection.vue';
import GallerySection from './components/GallerySection.vue';
import ContactSection from './components/ContactSection.vue';
import RedesSociales from './components/RedesSociales.vue';  // Importamos el nuevo componente
import FooterSection from './components/FooterSection.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import GenresSection from './components/GenresSection.vue';

const isScrolled = ref(false);

const checkScroll = () => {
  isScrolled.value = window.scrollY > 50;
  
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach(el => {
    const revealAt = window.scrollY + window.innerHeight - 100;
    const elementTop = el.getBoundingClientRect().top + window.scrollY;
    
    if (revealAt > elementTop) {
      el.classList.add('visible');
    }
  });
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <div class="relative">
    <NavBar :isScrolled="isScrolled" />
    <main>
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <GenresSection />
      <TikTok />
      <RedesSociales />  <!-- Agregamos el componente de redes sociales -->
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>