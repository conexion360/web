<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import '../stylegaleria.css'; // Importamos los estilos externos para la galería

// Importar dinámicamente todas las imágenes .jpg de la carpeta galeria
const imageModules = import.meta.glob('../imagenes/galeria/*.jpg', { eager: true });

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
    name: fileName,
    loaded: false,
    error: false
  };
});

// Mezclar las diapositivas para mostrarlas en orden aleatorio
slides = shuffleArray(slides);

const currentIndex = ref(0);
const activeSlide = ref(null);
const activeSlideIndex = ref(0); // Índice de la diapositiva actual en el modal
const autoplayInterval = ref(null);
const isTransitioning = ref(false);
const isLoading = ref(true);

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

// Función para manejar eventos de carga de imágenes
const handleImageLoad = (index) => {
  slides[index].loaded = true;
  slides[index].error = false;
};

// Función para manejar eventos de error de imágenes
const handleImageError = (index) => {
  slides[index].error = true;
};

onMounted(() => {
  // Establecer isLoading a false después de un breve retraso
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
  
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
  
  // Crear efecto de partículas flotantes
  createParticles();
});

onUnmounted(() => {
  stopAutoplay();
});

// Función para crear partículas flotantes en el fondo
const createParticles = () => {
  const gallerySection = document.getElementById('gallery');
  if (!gallerySection) return;
  
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'gallery-particle';
    
    // Tamaño aleatorio
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Posición inicial aleatoria
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Duración y retardo aleatorio
    const duration = Math.random() * 30 + 20;
    const delay = Math.random() * 10;
    
    // Aplicar animación
    particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
    
    // Agregar partícula al DOM
    gallerySection.appendChild(particle);
  }
};
</script>

<template>
  <section id="gallery" class="gallery-section">
    <!-- Fondo con efectos -->
    <div class="gallery-background">
      <div class="gallery-gradient"></div>
      <div class="gallery-pattern" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMC44IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiAvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz48L3N2Zz4=')"></div>
    </div>
    
    <div class="relative container mx-auto max-w-7xl px-4">
      <div class="text-center mb-16">
        <h2 class="gallery-title reveal-on-scroll">
          <span class="gallery-title-primary">Galería de</span>
          <span class="gallery-title-secondary">Imágenes</span>
        </h2>
      </div>
      
      <!-- Estado de carga -->
      <div v-if="isLoading" class="text-center text-white py-16">
        <div class="loading-spinner mx-auto"></div>
        <p class="mt-6 text-xl">Cargando galería...</p>
      </div>
      
      <!-- Mensaje si no hay imágenes -->
      <div v-else-if="slides.length === 0" class="text-center text-white py-16">
        <svg class="w-20 h-20 mx-auto mb-6 text-secondary opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-xl mb-3">No se encontraron imágenes en la galería</p>
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
            aria-label="Imagen anterior"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            class="carousel-nav-btn carousel-next-btn"
            @click="nextSlide"
            aria-label="Imagen siguiente"
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
                  @load="handleImageLoad(index)"
                  @error="handleImageError(index)"
                />
                
                <!-- Mensaje de error para imágenes que no cargan -->
                <div v-if="slide.error" class="image-error-container">
                  <svg class="image-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span>Imagen no disponible</span>
                </div>
                
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
      class="gallery-modal"
      @click="closeSlide"
    >
      <div class="gallery-modal-backdrop"></div>
      <div 
        class="gallery-modal-content"
        @click.stop
      >
        <!-- Botón cerrar -->
        <button 
          class="gallery-modal-close"
          @click="closeSlide"
          aria-label="Cerrar vista ampliada"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Botón anterior -->
        <button 
          class="modal-nav-btn modal-prev-btn"
          @click.stop="prevModalSlide"
          aria-label="Imagen anterior"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <!-- Botón siguiente -->
        <button 
          class="modal-nav-btn modal-next-btn"
          @click.stop="nextModalSlide"
          aria-label="Imagen siguiente"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Contenido del modal -->
        <div class="modal-image-container">
          <img 
            :src="activeSlide.image" 
            :alt="activeSlide.name" 
            class="modal-image"
            @error="activeSlide.error = true"
          />
          
          <!-- Mensaje de error para imágenes que no cargan en el modal -->
          <div v-if="activeSlide.error" class="image-error-container">
            <svg class="image-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span class="text-xl">Imagen no disponible</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animación de partículas flotantes */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-30px) translateX(15px);
  }
  50% {
    transform: translateY(-15px) translateX(30px);
  }
  75% {
    transform: translateY(-40px) translateX(-15px);
  }
}
</style>