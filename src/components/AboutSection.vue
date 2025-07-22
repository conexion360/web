<script setup>
// No script needed for this component
</script>

<template>
  <section id="about" class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,205,208,0.1)_0%,rgba(3,28,59,0.1)_100%)]"></div>
    </div>
    
    <div class="relative container mx-auto max-w-6xl px-6 py-24">
      <div class="text-center mb-16">
        <h2 class="inline-block relative text-4xl font-bold mb-4 reveal-on-scroll">
          <span class="text-white">Sobre</span>
          <span class="text-secondary ml-2">Nosotros</span>
          <div class="absolute -inset-2 bg-secondary/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </h2>
      </div>
      
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="text-left space-y-6 reveal-on-scroll">
          <h3 class="text-2xl font-semibold text-white">Nuestra Pasión por la Música</h3>
          <p class="text-gray-300 leading-relaxed">
            Somos una empresa líder en la producción de eventos musicales en el Perú, 
            con más de 15 años de experiencia creando experiencias memorables para los amantes de la música.
          </p>
          <p class="text-gray-300 leading-relaxed">
            Nuestra misión es ofrecer eventos de alta calidad que superen las expectativas de artistas y público, 
            cuidando cada detalle técnico, logístico y creativo.
          </p>
          <ul class="space-y-4">
            <li v-for="(feature, index) in [
              'Producción integral de conciertos y festivales',
              'Manejo profesional de artistas nacionales e internacionales',
              'Infraestructura y equipo técnico de última generación',
              'Experiencia en todos los géneros musicales'
            ]" :key="index" class="flex items-center group">
              <div class="relative mr-4">
                <div class="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="absolute inset-0 bg-secondary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 scale-125"></div>
              </div>
              <span class="text-gray-300 group-hover:text-white transition-colors duration-300">{{ feature }}</span>
            </li>
          </ul>
        </div>
        
        <div class="relative group reveal-on-scroll">
          <div class="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div class="relative overflow-hidden rounded-2xl">
            <img 
              src="/imagenes/eventos/conexion_360.png" 
              alt="Equipo de trabajo en evento" 
              class="w-full h-auto object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p class="text-white text-lg font-semibold">Muchos eventos producidos con éxito</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="(stat, index) in [
          { value: '20+', label: 'Años de experiencia' },
          { value: '100+', label: 'Eventos realizados' },
          { value: '50+', label: 'Artistas internacionales' },
          { value: '1M+', label: 'Asistentes felices' }
        ]" :key="index" class="group reveal-on-scroll">
          <div class="relative p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 transform hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div class="relative">
              <div class="text-4xl font-bold text-secondary mb-2">{{ stat.value }}</div>
              <div class="text-gray-300 group-hover:text-white transition-colors duration-300">{{ stat.label }}</div>
            </div>
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
