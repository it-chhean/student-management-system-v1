<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
        @click="$emit('update:modelValue', false)"
      >
        <div class="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-none" @click.stop>
          <img 
            :src="src" 
            :alt="alt" 
            class="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-scale-in pointer-events-auto"
          >
          <button 
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors pointer-events-auto"
            @click="$emit('update:modelValue', false)"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  src: string
  alt?: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
