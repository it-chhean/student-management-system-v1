<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div>
        <h1>Audit Logs</h1>
        <p>Monitor system changes, data insertions, and administrative actions.</p>
      </div>
      <div class="flex gap-2">
        <button @click="fetchLogs" class="btn-secondary rounded-lg text-sm flex items-center gap-2" :disabled="loading">
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" />
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input v-model="search" type="text" placeholder="Search tables or actions…" class="input-field pl-9 py-2 text-sm" />
      </div>
      <select v-model="filterAction" class="input-field py-2 text-sm w-40">
        <option value="">All Actions</option>
        <option value="INSERT">Insert</option>
        <option value="UPDATE">Update</option>
        <option value="DELETE">Delete</option>
      </select>
    </div>

    <!-- Logs Table -->
    <AppTable :columns="tableColumns" :rows="filteredLogs" :loading="loading" search-placeholder="Search logs…">
      <template #default="{ row }">
        <td class="px-4 py-3.5 text-sm font-mono" style="color: var(--text-muted)">
          #{{ (row as any).id }}
        </td>
        <td class="px-4 py-3.5">
          <AppBadge :variant="getActionVariant((row as any).action)" class="text-[10px] font-bold uppercase">
            {{ (row as any).action }}
          </AppBadge>
        </td>
        <td class="px-4 py-3.5 font-medium" style="color: var(--text-primary)">
          {{ (row as any).tableName }}
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-muted)">
          {{ formatDate((row as any).changeAt) }}
        </td>
        <td class="px-4 py-3.5">
          <button class="btn-action w-8 h-8 rounded-lg" @click="viewDetails(row as any)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </td>
      </template>
    </AppTable>

    <!-- Detail Modal -->
    <AppModal v-if="selectedLog" :show="!!selectedLog" @close="selectedLog = null" :title="`Log Detail #${selectedLog.id}`" size="lg">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs uppercase tracking-wider font-bold" style="color: var(--text-muted)">Action</label>
            <div class="mt-1">
              <AppBadge :variant="getActionVariant(selectedLog.action)">{{ selectedLog.action }}</AppBadge>
            </div>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wider font-bold" style="color: var(--text-muted)">Table</label>
            <p class="mt-1 font-medium">{{ selectedLog.tableName }}</p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wider font-bold" style="color: var(--text-muted)">Changed At</label>
            <p class="mt-1 text-sm">{{ formatDate(selectedLog.changeAt) }}</p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wider font-bold" style="color: var(--text-muted)">Record ID</label>
            <p class="mt-1 text-sm font-mono">{{ selectedLog.recordId || 'N/A' }}</p>
          </div>
        </div>

        <div v-if="selectedLog.newData" class="space-y-2">
          <label class="text-xs uppercase tracking-wider font-bold" style="color: var(--text-muted)">New Data</label>
          <pre class="p-3 rounded-lg overflow-auto max-h-60 text-xs font-mono" 
               style="background: var(--surface-hover); border: 1px solid var(--surface-border); color: var(--text-primary)">{{ JSON.stringify(selectedLog.newData, null, 2) }}</pre>
        </div>

        <div v-if="selectedLog.oldData" class="space-y-2">
          <label class="text-xs uppercase tracking-wider font-bold" style="color: var(--text-muted)">Old Data</label>
          <pre class="p-3 rounded-lg overflow-auto max-h-60 text-xs font-mono" 
               style="background: var(--surface-hover); border: 1px solid var(--surface-border); color: var(--text-primary)">{{ JSON.stringify(selectedLog.oldData, null, 2) }}</pre>
        </div>
      </div>
      <template #footer>
        <button class="btn-primary px-6" @click="selectedLog = null">Close</button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { auditService } from '~/services/audit.service'
import type { AuditLog } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Audit Logs' })

const logs = ref<AuditLog[]>([])
const loading = ref(false)
const search = ref('')
const filterAction = ref('')
const selectedLog = ref<AuditLog | null>(null)

const fetchLogs = async () => {
  loading.value = true
  try {
    logs.value = await auditService.getAll()
  } catch (err) {
    console.error('Failed to fetch audit logs', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchLogs)

const filteredLogs = computed(() => 
  logs.value.filter(log => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || 
      log.tableName.toLowerCase().includes(q) || 
      log.action.toLowerCase().includes(q) ||
      (log.recordId?.toString() || '').includes(q)
    
    const matchAction = !filterAction.value || log.action === filterAction.value
    return matchSearch && matchAction
  })
)

const tableColumns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'action', label: 'Action', width: '120px' },
  { key: 'tableName', label: 'Table' },
  { key: 'changeAt', label: 'Timestamp' },
  { key: 'actions', label: 'View', width: '80px' },
]

const getActionVariant = (action: string) => {
  switch (action) {
    case 'INSERT': return 'success'
    case 'UPDATE': return 'warning'
    case 'DELETE': return 'danger'
    default: return 'primary'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

const viewDetails = (log: AuditLog) => {
  selectedLog.value = log
}
</script>
