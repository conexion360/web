<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Howl } from 'howler';

const playlist = [
  { 
    title: 'Corazón Serrano - Mix Poco Yo - Camino A Un Sueño',
    file: new URL('../musicas/Corazón Serrano - Mix Poco Yo - Camino A Un Sueño.mp3', import.meta.url).href,
  },
  { 
    title: 'La Bella Luz - Disjockey',
    file: new URL('../musicas/La Bella Luz   Disjockey.mp3', import.meta.url).href,
  },
  { 
    title: 'Caribeños De Guadalupe Ft. Josimar - Otra Vez Me Enamoré',
    file: new URL('../musicas/Caribeños De Guadalupe Ft. Josimar - Otra Vez Me Enamoré.mp3', import.meta.url).href,
  }
];

const currentTrack = ref(0);
const isPlaying = ref(false);
const progress = ref(0);
const volume = ref(1);
const duration = ref(0);
const currentTime = ref(0);
let sound = null;
let progressInterval = null;

const formatTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const initSound = () => {
  if (sound) {
    sound.unload();
  }

  sound = new Howl({
    src: [playlist[currentTrack.value].file],
    volume: volume.value,
    html5: true,
    preload: true,
    pool: 10, // Aumentar el pool de audio
    onplay: () => {
      isPlaying.value = true;
      startProgressTimer();
    },
    onpause: () => {
      isPlaying.value = false;
      clearInterval(progressInterval);
    },
    onstop: () => {
      isPlaying.value = false;
      clearInterval(progressInterval);
      progress.value = 0;
      currentTime.value = 0;
    },
    onend: () => {
      nextTrack();
    },
    onload: () => {
      duration.value = sound.duration();
    },
    onloaderror: (id, err) => {
      console.error('Error loading audio:', err);
    }
  });
};

const startProgressTimer = () => {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (sound && isPlaying.value) {
      currentTime.value = sound.seek();
      progress.value = (currentTime.value / sound.duration()) * 100;
    }
  }, 100);
};

const playTrack = (index) => {
  if (currentTrack.value === index && isPlaying.value) {
    sound.pause();
  } else {
    currentTrack.value = index;
    initSound();
    sound.play();
  }
};

const prevTrack = () => {
  currentTrack.value = (currentTrack.value - 1 + playlist.length) % playlist.length;
  initSound();
  sound.play();
};

const nextTrack = () => {
  currentTrack.value = (currentTrack.value + 1) % playlist.length;
  initSound();
  sound.play();
};

onMounted(() => {
  initSound();
});

onUnmounted(() => {
  if (sound) {
    sound.unload();
  }
  clearInterval(progressInterval);
});
</script>

<template>
  <div class="bg-white/10 backdrop-blur-md rounded-lg p-2 flex items-center space-x-2 max-w-[400px]">
    <button 
      @click="prevTrack"
      class="text-white/80 hover:text-white transition-colors"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 6L9 12L19 18V6Z"></path>
        <path d="M7 6L5 6L5 18H7L7 6Z"></path>
      </svg>
    </button>

    <button 
      @click="playTrack(currentTrack)"
      class="bg-secondary hover:bg-secondary-light text-white rounded-full p-1.5 transition-all transform hover:scale-105"
    >
      <svg v-if="!isPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"></path>
      </svg>
      <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
      </svg>
    </button>

    <button 
      @click="nextTrack"
      class="text-white/80 hover:text-white transition-colors"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 18L15 12L5 6V18Z"></path>
        <path d="M17 6H19V18H17V6Z"></path>
      </svg>
    </button>

    <div class="flex-grow flex items-center min-w-0 overflow-hidden">
      <div class="marquee-container">
        <div class="marquee-content">
          <span class="text-xs text-white/90">{{ playlist[currentTrack].title }}</span>
          <span class="text-xs text-white/90">{{ playlist[currentTrack].title }}</span>
        </div>
      </div>
      <span class="text-xs text-white/60 ml-2 whitespace-nowrap">{{ formatTime(currentTime) }}</span>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-content {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
  padding-right: 50px;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>