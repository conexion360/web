<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');

const submitForm = () => {
  isSubmitting.value = true;
  
  setTimeout(() => {
    isSubmitting.value = false;
    isSuccess.value = true;
    
    form.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    
    setTimeout(() => {
      isSuccess.value = false;
    }, 5000);
  }, 1500);
};
</script>

<template>
  <section id="contact" class="section-padding bg-gradient-to-b from-primary to-primary-dark text-white py-32">
    <div class="container mx-auto max-w-5xl">
      <h2 class="text-3xl md:text-4xl font-bold mb-2 reveal-on-scroll">
        <span class="text-secondary">Contáctanos</span>
      </h2>
      <div class="w-20 h-1 bg-secondary mx-auto mb-8 reveal-on-scroll"></div>
      <p class="text-gray-300 max-w-2xl mx-auto mb-12 reveal-on-scroll">
        ¿Listo para organizar tu próximo evento? Déjanos tus datos y nos pondremos en contacto contigo 
        para hacer realidad tu visión.
      </p>
      
      <div class="grid md:grid-cols-2 gap-12 items-start">
        <!-- Contact Info -->
        <div class="text-left reveal-on-scroll">
          <h3 class="text-2xl font-semibold mb-6">Información de Contacto</h3>
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="bg-secondary/20 p-3 rounded-full mr-4">
                <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-white">Email</h4>
                <p class="text-gray-300">gerencia@conexion360sac.com</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="bg-white/10 rounded-lg p-6 shadow-xl text-left reveal-on-scroll">
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="name" class="block text-white font-medium mb-2">Nombre completo</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name"
                class="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Tu nombre"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="email" class="block text-white font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email"
                class="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Tu correo electrónico"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="phone" class="block text-white font-medium mb-2">Teléfono</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="form.phone"
                class="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="+51 XXX-XXX-XXX"
              >
            </div>

            <div class="mb-6">
              <label for="message" class="block text-white font-medium mb-2">Mensaje</label>
              <textarea 
                id="message" 
                v-model="form.message"
                rows="4" 
                class="w-full bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Cuéntanos sobre tu evento..."
                required
              ></textarea>
            </div>
            
            <div class="text-center">
              <button 
                type="submit" 
                class="btn-primary w-full"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
                <span v-else>Enviar mensaje</span>
              </button>
              
              <div 
                v-if="isSuccess" 
                class="mt-4 bg-green-800/30 border border-green-700 text-green-300 rounded-md p-4 animate-fade-in"
              >
                ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo lo antes posible.
              </div>
              
              <div 
                v-if="errorMessage" 
                class="mt-4 bg-red-800/30 border border-red-700 text-red-300 rounded-md p-4 animate-fade-in"
              >
                {{ errorMessage }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
