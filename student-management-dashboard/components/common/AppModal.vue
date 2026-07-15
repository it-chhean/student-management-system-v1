<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div v-if="modal.visible" class="fixed inset-0 z-[9000] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)"
        @click.self="ui.closeModal()">
        <Transition name="modal">
          <div v-if="modal.visible"
            class="w-full max-w-md rounded-md shadow-md overflow-hidden"
            style="background: var(--surface-card); border: 1px solid var(--surface-border)">

            <!-- Header -->
            <div class="flex items-center gap-4 px-6 pt-6 pb-4">
              <div v-if="modal.options?.type"
                class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                :class="headerIconBg">
                <svg class="w-5 h-5" :class="headerIconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="modal.options?.type === 'danger'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  <path v-else-if="modal.options?.type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <path v-else-if="modal.options?.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold font-display" style="color: var(--text-primary)">{{ modal.options?.title }}</h3>
                <p v-if="modal.options?.message" class="text-sm mt-0.5" style="color: var(--text-secondary)">{{ modal.options?.message }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex gap-3 px-6 pb-6 pt-2 justify-end">
              <button v-if="modal.options?.cancelLabel !== ''"
                class="btn-secondary"
                :disabled="modal.loading"
                @click="ui.closeModal()">
                {{ modal.options?.cancelLabel ?? 'Cancel' }}
              </button>
              <button
                class="btn"
                :class="confirmBtnClass"
                :disabled="modal.loading"
                @click="ui.confirmModal()">
                <svg v-if="modal.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ modal.options?.confirmLabel ?? 'Confirm' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const ui = useUiStore()
const modal = computed(() => ui.modal)

const headerIconBg = computed(() => ({
  'bg-red-500/10': modal.value.options?.type === 'danger',
  'bg-amber-500/10': modal.value.options?.type === 'warning',
  'bg-emerald-500/10': modal.value.options?.type === 'success',
  'bg-blue-500/10': !modal.value.options?.type || modal.value.options?.type === 'default',
}))

const headerIconColor = computed(() => ({
  'text-red-400': modal.value.options?.type === 'danger',
  'text-amber-400': modal.value.options?.type === 'warning',
  'text-emerald-400': modal.value.options?.type === 'success',
  'text-blue-400': !modal.value.options?.type || modal.value.options?.type === 'default',
}))

const confirmBtnClass = computed(() => ({
  'btn-danger': modal.value.options?.type === 'danger',
  'btn-success': modal.value.options?.type === 'success',
  'btn-primary': !modal.value.options?.type || modal.value.options?.type === 'default',
  'bg-amber-600 text-white hover:bg-amber-500': modal.value.options?.type === 'warning',
}))
</script>
