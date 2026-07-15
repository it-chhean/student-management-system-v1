<template>
  <div class="stat-card border border-slate-30/90 rounded-md overflow-hidden">
    <!-- Table Toolbar -->
    <div v-if="$slots.toolbar || showSearch || showFilters" class="flex flex-wrap items-center gap-3 p-4"
      style="border-bottom: 1px solid var(--surface-border)">

      <!-- Search -->
      <div v-if="showSearch" class="relative flex-1 min-w-[200px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" />
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input :value="searchValue" type="text" :placeholder="searchPlaceholder" class="input-field pl-9 py-2"
          @input="$emit('update:searchValue', ($event.target as HTMLInputElement).value)" />
      </div>

      <!-- Slot for extra filters -->
      <slot name="toolbar" />

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Actions slot -->
      <slot name="actions" />
    </div>

    <!-- Bulk action bar -->
    <Transition name="slide-up">
      <div v-if="selectedCount || 0 > 0" class="flex items-center gap-3 px-4 py-2.5"
        style="background: rgba(99,102,241,0.08); border-bottom: 1px solid rgba(99,102,241,0.15)">
        <span class="text-sm font-semibold text-primary-400">{{ selectedCount }} selected</span>
        <div class="flex-1" />
        <slot name="bulk-actions" />
        <button class="btn-ghost text-xs py-1.5 px-3" @click="$emit('clear-selection')">Clear</button>
      </div>
    </Transition>

    <!-- Table Wrapper -->
    <div class="overflow-x-auto">
      <table class="data-table w-full">
        <thead>
          <tr>
            <!-- Checkbox column -->
            <th v-if="selectable" class="w-12 px-4">
              <input type="checkbox" class="checkbox-custom" :checked="allSelected" :indeterminate="someSelected"
                @change="$emit('toggle-select-all')" />
            </th>

            <!-- Columns -->
            <th v-for="col in columns" :key="col.key" :style="col.width ? `width: ${col.width}` : ''"
              :class="col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''">
              <button v-if="col.sortable"
                class="flex items-center gap-1.5 group/sort font-semibold uppercase text-xs tracking-wider"
                style="color: var(--text-muted)" @click="$emit('sort', col.key)">
                {{ col.label }}
                <span class="flex flex-col gap-px opacity-50 group-hover/sort:opacity-100 transition-opacity">
                  <svg class="w-2.5 h-2.5 transition-colors"
                    :class="sortKey === col.key && sortDir === 'asc' ? 'text-primary-400' : ''" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 4l8 8H4z" />
                  </svg>
                  <svg class="w-2.5 h-2.5 transition-colors"
                    :class="sortKey === col.key && sortDir === 'desc' ? 'text-primary-400' : ''" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 20l-8-8h16z" />
                  </svg>
                </span>
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Loading skeletons -->
          <template v-if="loading">
            <tr v-for="n in pageSize" :key="n">
              <td v-if="selectable" class="px-4">
                <div class="skeleton h-4 w-4 rounded" />
              </td>
              <td v-for="col in columns" :key="col.key" class="px-4 py-3.5">
                <div class="skeleton h-4 rounded" :style="`width: ${40 + Math.random() * 50}%`" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="!rows.length">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="py-16 text-center">
              <div class="flex flex-col items-center gap-3">
                <div>
                  <p class="font-semibold text-lg " style="color: var(--text-primary)">{{ emptyTitle }}</p>
                  <p class="text-sm mt-1" style="color: var(--text-muted)">{{ emptyMessage }}</p>
                </div>
                <slot name="empty-action" />
              </div>
            </td>
          </tr>

          <!-- Data rows -->
          <template v-else>
            <tr v-for="row in rows" :key="(row as Record<string, unknown>).id as string" class="cursor-pointer"
              :class="selectedIds?.includes((row as Record<string, unknown>).id as string) ? 'bg-primary-500/5' : ''"
              @click="$emit('row-click', row)">
              <!-- Checkbox -->
              <td v-if="selectable" class="px-4" @click.stop>
                <input type="checkbox" class="checkbox-custom"
                  :checked="selectedIds?.includes((row as Record<string, unknown>).id as string)"
                  @change="$emit('toggle-select', (row as Record<string, unknown>).id)" />
              </td>

              <!-- Cells via slots -->
              <slot :row="row" />
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 0" class="flex flex-wrap items-center justify-between gap-4 px-4 py-3.5"
      style="border-top: 1px solid var(--surface-border)">
      <span class="text-xs" style="color: var(--text-muted)">
        Showing {{ startItem }}–{{ endItem }} of {{ total }} results
      </span>

      <div class="flex items-center gap-2">
        <button class="btn-action w-8 h-8 rounded-lg text-xs" :disabled="currentPage <= 1"
          @click="$emit('page-change', currentPage - 1)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button v-for="p in visiblePages" :key="p" class="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
          :class="p === currentPage
            ? 'bg-primary-600 text-white shadow-glow'
            : p === -1 ? 'cursor-default' : 'btn-action'" :disabled="p === -1"
          @click="p !== -1 && $emit('page-change', p)">
          {{ p === -1 ? '…' : p }}
        </button>

        <button class="btn-action w-8 h-8 rounded-lg text-xs" :disabled="currentPage >= totalPages"
          @click="$emit('page-change', currentPage + 1)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Page size -->
      <div class="flex items-center gap-2">
        <span class="text-xs" style="color: var(--text-muted)">Rows:</span>
        <select class="input-field py-1 px-2 text-xs w-16" :value="pageSize"
          @change="$emit('page-size-change', Number(($event.target as HTMLSelectElement).value))">
          <option v-for="s in [10, 20, 50, 100]" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { MoveRight } from '@lucide/vue';
import type { TableColumn } from '~/types'

interface Props {
  columns: TableColumn[]
  rows: T[]
  loading?: boolean
  selectable?: boolean
  selectedIds?: string[]
  allSelected?: boolean
  someSelected?: boolean
  selectedCount?: number
  currentPage?: number
  pageSize?: number
  total?: number
  totalPages?: number
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  searchValue?: string
  showSearch?: boolean
  showFilters?: boolean
  searchPlaceholder?: string
  emptyTitle?: string
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectable: false,
  selectedIds: () => [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
  showSearch: true,
  searchPlaceholder: 'Search…',
  emptyTitle: 'No results found',
  emptyMessage: 'Try adjusting your search or filters',
})

defineEmits([
  'sort', 'page-change', 'page-size-change', 'row-click',
  'toggle-select', 'toggle-select-all', 'clear-selection',
  'update:searchValue',
])

const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: number[] = [1]
  if (current > 3) pages.push(-1)
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push(-1)
  pages.push(total)
  return pages
})
</script>
