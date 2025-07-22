<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Cargar el script de Elfsight para TikTok
  if (!document.getElementById('elfsight-script')) {
    const script = document.createElement('script');
    script.id = 'elfsight-script';
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.head.appendChild(script);
  }
  



  // Implementación del efecto reveal-on-scroll
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
});
</script>

<template>
  <section id="tiktok" class="relative py-32 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,205,208,0.1),transparent_50%)]"></div>
    </div>
    <div class="relative container mx-auto max-w-6xl px-6">
      <div class="text-center mb-16">
        <h2 class="inline-block relative text-4xl font-bold mb-4 reveal-on-scroll">
          <span class="text-white">Síguenos en</span>
          <span class="text-secondary ml-2">TikTok</span>
        </h2>
      </div>
      <div class="reveal-on-scroll">
        <div class="elfsight-app-24bdd9b1-41d7-4471-b9c8-d0509f42ef85" data-elfsight-app-lazy></div>
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