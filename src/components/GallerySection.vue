<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Importar dinámicamente todas las imágenes .jpg de la carpeta galeria
const imageModules = import.meta.glob('/imagenes/galeria/*.jpg', { eager: true });

// Función para mezclar un array (algoritmo Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Convertir los módulos importados a un array de objetos con id e imagen
let slides = Object.entries(imageModules).map(([path, module], index) => {
  // Extraer el nombre del archivo de la ruta
  const fileName = path.split('/').pop().replace('.jpg', '');
  
  return {
    id: index + 1,
    image: module.default || module,
    name: fileName
  };
});

// Mezclar las diapositivas para mostrarlas en orden aleatorio
slides = shuffleArray(slides);

const currentIndex = ref(0);
const activeSlide = ref(null);
const activeSlideIndex = ref(0); // Añadido: Índice de la diapositiva actual en el modal
const autoplayInterval = ref(null);
const isTransitioning = ref(false);

// Filtra los índices de tarjetas visibles teniendo en cuenta que es un carrusel circular
const visibleSlideIndices = computed(() => {
  const total = slides.length;
  const indices = [];
  
  // Central card and 2 cards on each side
  for (let i = -2; i <= 2; i++) {
    // Ensure proper wrap-around for circular carousel
    const index = (currentIndex.value + i + total) % total;
    indices.push(index);
  }
  
  return indices;
});

// Calcula la posición de cada imagen para el efecto 3D más redondeado
const getImageStyle = (index) => {
  // Calcula la distancia con respecto a la imagen central
  let indexDiff = index - currentIndex.value;
  
  // Ajuste para el carrusel circular (distancia más corta)
  if (indexDiff > slides.length / 2) {
    indexDiff -= slides.length;
  } else if (indexDiff < -slides.length / 2) {
    indexDiff += slides.length;
  }
  
  const absoluteDiff = Math.abs(indexDiff);
  
  // Valores para un efecto más redondeado
  let translateZ = 0;
  let translateX = 0;
  let rotateY = 0;
  let opacity = 1;
  let zIndex = 5;
  let scale = 1;
  let radius = 800; // Radio más grande para un arco más suave
  
  if (indexDiff === 0) {
    // Imagen central (actual)
    translateZ = 0;
    translateX = 0;
    rotateY = 0;
    opacity = 1;
    zIndex = 10;
    scale = 1;
  } else if (absoluteDiff <= 2) {
    // Efecto circular: usa seno y coseno para posicionar en arco
    // Usamos un ángulo basado en la diferencia de índice
    const angle = indexDiff * 0.3; // Ángulo reducido para arco más suave
    translateZ = -radius * (1 - Math.cos(angle)) / 2;
    translateX = radius * Math.sin(angle);
    rotateY = -indexDiff * 35; // Mayor rotación para efecto más pronunciado
    opacity = 1 - (absoluteDiff * 0.15);
    zIndex = 5 - absoluteDiff;
    scale = 0.9 - (absoluteDiff * 0.15);
  } else {
    // Imágenes muy alejadas (casi invisibles)
    translateZ = -400;
    translateX = indexDiff * 500;
    rotateY = -indexDiff * 45;
    opacity = 0;
    zIndex = 0;
    scale = 0.7;
  }
  
  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: opacity,
    zIndex: zIndex
  };
};

// Determina si una tarjeta debe estar visible
const isVisible = (index) => {
  return visibleSlideIndices.value.includes(index);
};

const nextSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  
  currentIndex.value = (currentIndex.value + 1) % slides.length;
  
  setTimeout(() => {
    isTransitioning.value = false;
  }, 700); // Duración más larga para transición más suave
};

const prevSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length;
  
  setTimeout(() => {
    isTransitioning.value = false;
  }, 700); // Duración más larga para transición más suave
};

const goToSlide = (index) => {
  if (isTransitioning.value || index === currentIndex.value) return;
  isTransitioning.value = true;
  
  currentIndex.value = index;
  
  setTimeout(() => {
    isTransitioning.value = false;
  }, 700);
};

// Funciones para el modal
const openSlide = (slide, index) => {
  activeSlide.value = slide;
  activeSlideIndex.value = index; // Guardar el índice de la diapositiva activa
  document.body.style.overflow = 'hidden';
  stopAutoplay();
};

const closeSlide = () => {
  activeSlide.value = null;
  document.body.style.overflow = '';
  startAutoplay();
};

// Nuevas funciones para navegar en el modal
const nextModalSlide = () => {
  const nextIndex = (activeSlideIndex.value + 1) % slides.length;
  activeSlide.value = slides[nextIndex];
  activeSlideIndex.value = nextIndex;
};

const prevModalSlide = () => {
  const prevIndex = (activeSlideIndex.value - 1 + slides.length) % slides.length;
  activeSlide.value = slides[prevIndex];
  activeSlideIndex.value = prevIndex;
};

const startAutoplay = () => {
  stopAutoplay(); // Limpiar cualquier intervalo existente
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

onMounted(() => {
  // Log para depuración - comprobar cuántas imágenes se cargaron
  console.log(`Cargadas ${slides.length} imágenes de la galería en orden aleatorio`);
  
  // Event listener para la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeSlide.value) {
      closeSlide();
    }
    if (activeSlide.value) {
      // Teclas de navegación en el modal
      if (e.key === 'ArrowLeft') {
        prevModalSlide();
      }
      if (e.key === 'ArrowRight') {
        nextModalSlide();
      }
    } else {
      // Teclas de navegación en el carrusel
      if (e.key === 'ArrowLeft') {
        prevSlide();
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
  });
  
  // Iniciar autoplay
  startAutoplay();
  
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
  stopAutoplay();
});
</script>

<template>
  <section id="gallery" class="relative py-32 overflow-hidden" :style="{'min-height': '700px'}">
    <!-- Fondo azul oscuro con detalles -->
    <div class="absolute inset-0 bg-[#001642]">
      <!-- Efectos de luz y patrones -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,205,208,0.08),transparent_40%)]"></div>
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMC44IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiAvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz48L3N2Zz4='); opacity: 0.3;"></div>
    </div>
    
    <div class="relative container mx-auto max-w-7xl px-4">
      <div class="text-center mb-16">
        <h2 class="inline-block relative text-4xl font-bold mb-4 reveal-on-scroll">
          <span class="text-white">Galería de</span>
          <span class="text-secondary ml-2">Imágenes</span>
        </h2>
      </div>
      
      <div v-if="slides.length === 0" class="text-center text-white py-8">
        <p>No se encontraron imágenes en la galería.</p>
      </div>
      
      <!-- Carrusel 3D con imágenes cargadas dinámicamente -->
      <div v-else class="carousel-3d-container reveal-on-scroll">
        <div class="carousel-3d-wrapper"
          @mouseenter="stopAutoplay"
          @mouseleave="startAutoplay"
        >
          <!-- Navegación -->
          <button 
            class="carousel-nav-btn carousel-prev-btn"
            @click="prevSlide"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            class="carousel-nav-btn carousel-next-btn"
            @click="nextSlide"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <!-- Carrusel 3D con múltiples imágenes -->
          <div class="carousel-3d-stage">
            <div
              v-for="(slide, index) in slides"
              :key="slide.id"
              class="carousel-3d-slide"
              :class="{ 'active': index === currentIndex }"
              :style="getImageStyle(index)"
              v-show="isVisible(index)"
              @click="index === currentIndex ? openSlide(slide, index) : goToSlide(index)"
            >
              <div class="carousel-3d-slide-inner">
                <img 
                  :src="slide.image" 
                  :alt="slide.name" 
                  class="carousel-3d-image"
                />
                
                <!-- Efectos visuales en las tarjetas -->
                <div class="carousel-3d-overlay"></div>
                <div class="light-effect"></div>
                <div class="carousel-3d-reflection"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para ver imagen ampliada -->
    <div 
      v-if="activeSlide" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="closeSlide"
    >
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      <div 
        class="relative max-w-7xl w-full h-[90vh] animate-fade-in"
        @click.stop
      >
        <!-- Botón cerrar -->
        <button 
          class="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-3 rounded-full bg-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-secondary/80"
          @click="closeSlide"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Botón anterior (nueva flecha izquierda) -->
        <button 
          class="modal-nav-btn modal-prev-btn"
          @click.stop="prevModalSlide"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <!-- Botón siguiente (nueva flecha derecha) -->
        <button 
          class="modal-nav-btn modal-next-btn"
          @click.stop="nextModalSlide"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Contenido del modal -->
        <div class="modal-content">
          <img 
            :src="activeSlide.image" 
            :alt="activeSlide.name" 
            class="w-full h-full object-contain"
          />
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

/* Estilos del carrusel 3D */
.carousel-3d-container {
  position: relative;
  height: 550px;
  width: 100%;
  margin: 0 auto;
  padding: 0 50px;
}

.carousel-3d-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-3d-stage {
  position: relative;
  width: 100%;
  height: 85%;
  perspective: 1200px;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-3d-slide {
  position: absolute;
  width: 520px;
  height: 370px;
  transition: all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000); /* Transición más suave */
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  left: 50%;
  transform-origin: center center;
  margin-left: -260px;
}

.carousel-3d-slide-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.5);
}

.carousel-3d-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  z-index: 1;
}

/* Overlay con gradiente suave */
.carousel-3d-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,22,66,0.7), transparent);
  z-index: 2;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* Efecto de luz en la esquina */
.light-effect {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
  z-index: 2;
  opacity: 0.7;
}

/* Efecto de reflexión */
.carousel-3d-reflection {
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
  transform: rotateX(180deg);
  filter: blur(5px);
  opacity: 0.3;
  z-index: 0;
}

/* Estilos de navegación del carrusel */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.carousel-nav-btn:hover {
  background-color: rgba(16, 205, 208, 0.9);
  color: #001642;
  transform: translateY(-50%) scale(1.1);
}

.carousel-prev-btn {
  left: 20px;
}

.carousel-next-btn {
  right: 20px;
}

/* Estilos de navegación del modal */
.modal-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.modal-nav-btn:hover {
  background-color: rgba(16, 205, 208, 0.9);
  color: #001642;
  transform: translateY(-50%) scale(1.1);
}

.modal-prev-btn {
  left: 20px;
}

.modal-next-btn {
  right: 20px;
}

/* Animación de entrada para el modal */
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

.modal-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
}

/* Responsividad */
@media (max-width: 1200px) {
  .carousel-3d-slide {
    width: 480px;
    height: 340px;
    margin-left: -240px;
  }
  
  .carousel-prev-btn, .modal-prev-btn {
    left: 15px;
  }
  
  .carousel-next-btn, .modal-next-btn {
    right: 15px;
  }
  
  .modal-nav-btn {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 768px) {
  .carousel-3d-container {
    height: 450px;
  }
  
  .carousel-3d-slide {
    width: 360px;
    height: 260px;
    margin-left: -180px;
  }
  
  .carousel-nav-btn, .modal-nav-btn {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 640px) {
  .carousel-3d-slide {
    width: 300px;
    height: 220px;
    margin-left: -150px;
  }
  
  .carousel-nav-btn, .modal-nav-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
