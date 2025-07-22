<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Función para abrir enlaces externos en nueva pestaña
const openSocial = (url) => {
  window.open(url, '_blank');
};

// Lista de redes sociales actualizada con tus enlaces
const socialNetworks = [
  {
    name: 'Facebook',
    username: '@360conexion',
    url: 'https://www.facebook.com/360conexion',
    color: 'bg-blue-600',
    gradientColor: 'from-blue-600 to-blue-700',
    hoverGradient: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-600/30',
    particleColor: '#1e40af',
    icon: `<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />`
  },
  {
    name: 'Instagram',
    username: '@conexion360sac',
    url: 'https://www.instagram.com/conexion360sac/',
    color: 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500',
    gradientColor: 'from-pink-500 via-red-500 to-yellow-500',
    hoverGradient: 'from-pink-400 via-red-400 to-yellow-400',
    shadowColor: 'shadow-pink-500/30',
    particleColor: '#ec4899',
    icon: `<path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.247-.667.642-1.272 1.153-1.772a4.91 4.91 0 011.772-1.153c.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />`
  },
  {
    name: 'TikTok',
    username: '@conexion360.sac',
    url: 'https://www.tiktok.com/@conexion360.sac',
    color: 'bg-black',
    gradientColor: 'from-zinc-900 to-black',
    hoverGradient: 'from-zinc-800 to-zinc-900',
    shadowColor: 'shadow-black/30',
    particleColor: '#27272a',
    icon: `<path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.45 5.45v7.5a4.27 4.27 0 004.25 4.3 4.27 4.27 0 004.35-4.3V8.7a8.55 8.55 0 002.55.33v-3.2a4.4 4.4 0 01-2.7-.83V8.5a4.36 4.36 0 01-3.35-4.35v-2.5c0-.65.15-1.26.35-1.83A4.29 4.29 0 0012.2 5a4.27 4.27 0 004.35 4.3v-3.5h.05z" />`
  }
];

// Referencia para el efecto parallax
const parallaxElements = ref([]);
const mouseMoveStrength = 15;
const mouseX = ref(0);
const mouseY = ref(0);

// Animación para la aparición gradual de los elementos
const isVisible = ref(false);
const animationDelays = ['delay-100', 'delay-300', 'delay-500'];

// Para efecto de seguimiento del ratón
const mouseRadius = ref(300);
const canvasRefs = ref([]);

// Configurar el contexto del canvas y dibujar partículas
const setupCanvas = (canvas, index) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const particleColor = socialNetworks[index]?.particleColor || '#10CDD0';
  
  // Configurar el tamaño del canvas
  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Crear partículas
  const particles = [];
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.5 + 0.1
    });
  }
  
  // Animación de partículas
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      
      ctx.fillStyle = `${particleColor}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Rebote en los bordes
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      
      // Efecto de movimiento con el mouse
      const dx = mouseX.value - canvas.getBoundingClientRect().left - p.x;
      const dy = mouseY.value - canvas.getBoundingClientRect().top - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseRadius.value) {
        const angle = Math.atan2(dy, dx);
        const force = (mouseRadius.value - distance) / mouseRadius.value;
        p.x -= Math.cos(angle) * force * 2;
        p.y -= Math.sin(angle) * force * 2;
      }
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
};

// Obtener posición relativa para el efecto de luz
const getMouseLight = (index) => {
  const element = document.getElementById(`social-card-${index}`);
  if (!element) return { x: '50%', y: '50%', opacity: 0 };
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const distanceX = mouseX.value - centerX;
  const distanceY = mouseY.value - centerY;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
  // Calcular opacidad basada en la distancia
  const opacity = Math.max(0, 1 - (distance / mouseRadius.value));
  
  // Calcular posición relativa dentro de la tarjeta
  const relX = ((mouseX.value - rect.left) / rect.width) * 100;
  const relY = ((mouseY.value - rect.top) / rect.height) * 100;
  
  return {
    x: `${Math.min(Math.max(relX, 0), 100)}%`,
    y: `${Math.min(Math.max(relY, 0), 100)}%`,
    opacity: opacity
  };
};

// Actualizar posición del ratón
const updateMousePosition = (event) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
  
  // Efecto parallax
  parallaxElements.value.forEach(el => {
    const speed = Number(el.dataset.speed) || 0.1;
    const offsetX = (window.innerWidth / 2 - event.clientX) * speed;
    const offsetY = (window.innerHeight / 2 - event.clientY) * speed;
    
    el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
};

onMounted(() => {
  // Inicializar parallax
  parallaxElements.value = document.querySelectorAll('.parallax-element');
  
  window.addEventListener('mousemove', updateMousePosition);
  
  // Configurar cada canvas
  setTimeout(() => {
    canvasRefs.value.forEach((canvas, index) => {
      if (canvas) {
        setupCanvas(canvas, index);
      }
    });
  }, 100);
  
  // Activar animación de aparición después de un breve retraso
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
  
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

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition);
});
</script>

<template>
  <section id="redes-sociales" class="relative py-32 overflow-hidden min-h-screen flex items-center" @mousemove="updateMousePosition">
    <!-- Fondo elegante con parallax -->
    <div class="absolute inset-0 bg-[#001642]">
      <!-- Patrón de fondo sofisticado -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGRlZnM+PHBhdHRlcm4gaWQ9InAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0ic2NhbGUoMSkgcm90YXRlKDApIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDFlNDIiIC8+PHBhdGggZD0iTTYwIDMwIEwzMCAwIEwwIDMwIEwzMCA2MCBaIiBmaWxsPSIjMDAxZTQyIiBzdHJva2U9IiMwOTJkNWUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3ApIiAvPjwvc3ZnPg==')] opacity-30"></div>
      
      <!-- Elementos de parallax -->
      <div class="parallax-element absolute top-20 left-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" data-speed="0.04"></div>
      <div class="parallax-element absolute -bottom-40 right-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" data-speed="0.06" style="animation-delay: 2s;"></div>
      <div class="parallax-element absolute top-1/2 -right-20 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse-slow" data-speed="0.08" style="animation-delay: 4s;"></div>
      
      <!-- Líneas decorativas con efecto de brillo -->
      <div class="absolute left-0 right-0 top-40 h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent parallax-element" data-speed="0.03"></div>
      <div class="absolute left-0 right-0 bottom-40 h-[1px] bg-gradient-to-r from-transparent via-secondary/15 to-transparent parallax-element" data-speed="0.02"></div>
    </div>
    
    <div class="container mx-auto px-6 max-w-7xl relative z-10">
      <!-- Encabezado con animación de entrada elegante -->
      <div class="text-center mb-20 reveal-on-scroll">
     
        
        <h2 class="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
          <span class="text-white block sm:inline">Nuestras</span>
          <span class="text-secondary ml-0 sm:ml-2 relative inline-block">
            <span class="relative z-10">Redes Sociales</span>
            <div class="absolute -bottom-1 left-0 h-[6px] w-full bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-full transform -skew-x-12"></div>
          </span>
        </h2>
        <p class="text-gray-300 max-w-3xl mx-auto text-lg mt-6 leading-relaxed">
          Mantente conectado con nosotros y entérate de todos nuestros eventos. 
          Síguenos en nuestras plataformas para no perderte nuestra música.
        </p>
      </div>
      
      <!-- Panel principal con diseño glassmorphism moderno y ultra elegante -->
      <div class="backdrop-blur-xl bg-white/[0.02] rounded-3xl shadow-2xl overflow-hidden relative reveal-on-scroll border border-white/5">
        <!-- Decoración elegante del panel -->
        <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div class="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div class="p-8 md:p-12 lg:p-16 relative z-10">          
          <!-- Tarjetas de redes sociales con diseño premium -->
          <div class="grid md:grid-cols-3 gap-6 lg:gap-10 mt-4 max-w-5xl mx-auto">
            <div 
              v-for="(network, index) in socialNetworks" 
              :key="network.name"
              :id="`social-card-${index}`"
              :class="['social-card transform', isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0', animationDelays[index]]"
              @click="openSocial(network.url)"
            >
              <!-- Contenedor principal de la tarjeta social con diseño premium -->
              <div class="group relative overflow-hidden backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-xl transition-all duration-500 hover:border-secondary/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full">
                <!-- Canvas para las partículas interactivas de fondo -->
                <canvas :ref="el => { canvasRefs[index] = el }" class="absolute inset-0 w-full h-full pointer-events-none opacity-40"></canvas>
                
                <!-- Efecto de luz brillante que sigue al ratón -->
                <div 
                  class="absolute pointer-events-none transition-opacity duration-300 ease-out"
                  :style="{
                    background: `radial-gradient(circle 150px at ${getMouseLight(index).x} ${getMouseLight(index).y}, rgba(255, 255, 255, 0.15), transparent)`,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    opacity: getMouseLight(index).opacity
                  }"
                ></div>
                
                <!-- Contenido de la tarjeta -->
                <div class="relative z-10 p-8 text-center">
                  <!-- Icono de red social con efecto gradiente y brillo -->
                  <div class="icon-container relative w-28 h-28 mx-auto mb-6">
                    <div :class="`absolute inset-0 bg-gradient-to-br ${network.gradientColor} rounded-full opacity-90 transform transition-all duration-500 group-hover:${network.hoverGradient} group-hover:scale-105 ${network.shadowColor} shadow-lg`"></div>
                    
                    <!-- Icono con efecto 3D -->
                    <div class="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 icon-3d" style="transform-style: preserve-3d;">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="42" 
                        height="42" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        class="text-white relative"
                        style="transform: translateZ(10px);"
                        v-html="network.icon"
                      ></svg>
                    </div>
                    
                    <!-- Efectos de brillo -->
                    <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="transform: translateZ(5px);"></div>
                    <div class="absolute inset-0 rounded-full shadow-inner opacity-50"></div>
                  </div>
                  
                  <!-- Nombre y usuario con tipografía mejorada -->
                  <h4 class="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors duration-300">{{ network.name }}</h4>
                  <p class="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{{ network.username }}</p>
                  
                  <!-- Separador elegante -->
                  <div class="w-12 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full mx-auto my-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-secondary/30 group-hover:to-transparent"></div>
                  
                  <!-- Botón elegante -->
                  <div class="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span class="inline-flex items-center gap-2 text-secondary font-medium transition-colors duration-300">
                      Seguir
                      <svg class="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decoración adicional - Elemento flotante -->
      <div class="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-secondary/10 to-blue-500/5 rounded-full blur-3xl parallax-element" data-speed="0.05"></div>
    </div>
  </section>
</template>

<style scoped>
/* Animaciones y efectos */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.social-card {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.delay-100 {
  transition-delay: 0.1s;
}

.delay-300 {
  transition-delay: 0.3s;
}

.delay-500 {
  transition-delay: 0.5s;
}

/* Efecto 3D para tarjetas */
.icon-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.icon-3d {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Animación de brillo */
@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
</style>