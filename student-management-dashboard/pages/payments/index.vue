<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 page-header">
      <div><h1>Payments & Finance</h1><p>Track tuition fees, invoices, and financial records.</p></div>
      <div class="flex gap-2">
        <button class="btn-secondary rounded-lg text-sm">Export</button>
        <button class="btn-primary rounded-lg text-sm" @click="toast.success('Invoice created', 'New invoice has been generated.')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          New Invoice
        </button>
      </div>
    </div>

    <!-- Finance Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="stat in financeStats" :key="stat.label"
        class="stat-card rounded-lg p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted)">{{ stat.label }}</span>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="`background: ${stat.bg}`">
            <svg class="w-4 h-4" :style="`color: ${stat.color}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/>
            </svg>
          </div>
        </div>
        <div class="font-display text-2xl font-bold" style="color: var(--text-primary)">{{ stat.value }}</div>
        <div class="text-xs mt-1" :style="`color: ${stat.color}`">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="relative flex-1 min-w-[200px] max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round"/></svg>
        <input v-model="search" type="text" placeholder="Search by student or invoice…" class="input-field pl-9 py-2 text-sm"/>
      </div>
      <select v-model="filterStatus" class="input-field py-2 text-sm w-36">
        <option value="">All Status</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select v-model="filterType" class="input-field py-2 text-sm w-40">
        <option value="">All Types</option>
        <option value="tuition">Tuition</option>
        <option value="registration">Registration</option>
        <option value="exam">Exam Fee</option>
        <option value="library">Library</option>
      </select>
    </div>

    <!-- Payments Table -->
    <AppTable
      :columns="columns"
      :rows="paginatedPayments"
      :loading="false"
      :current-page="page"
      :page-size="pageSize"
      :total="filteredPayments.length"
      :total-pages="Math.ceil(filteredPayments.length / pageSize)"
      :show-search="false"
      @page-change="page = $event"
      @page-size-change="pageSize = $event"
    >
      <template #default="{ row }">
        <td class="px-4 py-3.5 ">
          <span class="font-mono text-xs font-semibold text-primary-400">{{ row.invoice }}</span>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-3">
            <AppAvatar :src="row.avatar" :name="row.studentName" size="sm" />
            <span class="text-sm font-semibold" style="color: var(--text-primary)">{{ row.studentName }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5">
          <AppBadge variant="primary" class="text-xs capitalize">{{ row.type }}</AppBadge>
        </td>
        <td class="px-4 py-3.5">
          <span class="text-sm font-bold" style="color: var(--text-primary)">${{ row.amount.toLocaleString() }}</span>
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-secondary)">{{ row.dueDate }}</td>
        <td class="px-4 py-3.5">
          <AppBadge :variant="paymentVariant(row.status)" dot>{{ row.status }}</AppBadge>
        </td>
        <td class="px-4 py-3.5 text-sm" style="color: var(--text-muted)">{{ row.paidDate ?? '—' }}</td>
        <td class="px-4 py-3.5">
          <div class="flex gap-1">
            <button class="btn-ghost w-7 h-7 rounded-lg" title="View Invoice">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
            <button v-if="row.status === 'pending'" class="btn-success text-xs py-1 px-2" @click="toast.success('Payment recorded')">Mark Paid</button>
          </div>
        </td>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { mockStudents } from '~/utils/mock-data'

definePageMeta({ layout: 'default' })
useHead({ title: 'Payments' })

const toast = useToast()
const search = ref('')
const filterStatus = ref('')
const filterType = ref('')
const page = ref(1)
const pageSize = ref(10)

const financeStats = [
  { label: 'Total Collected', value: '$284,500', sub: '↑ 12.5% vs last year', color: '#34d399', bg: 'rgba(16,185,129,0.1)', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Pending', value: '$42,800', sub: '68 invoices pending', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Overdue', value: '$18,200', sub: '23 overdue accounts', color: '#f87171', bg: 'rgba(239,68,68,0.1)', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { label: 'This Month', value: '$31,400', sub: '↑ 8.3% vs last month', color: '#818cf8', bg: 'rgba(99,102,241,0.1)', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
]

const types = ['tuition', 'registration', 'exam', 'library', 'hostel']
const statuses = ['paid', 'paid', 'paid', 'pending', 'pending', 'overdue', 'cancelled']
const allPayments = mockStudents.slice(0, 40).map((s, i) => ({
  id: `pay-${i}`,
  invoice: `INV-${String(10000 + i).padStart(5, '0')}`,
  avatar: s.avatar,
  studentName: `${s.firstName} ${s.lastName}`,
  type: types[i % types.length],
  amount: [2400, 150, 75, 50, 800][i % 5],
  dueDate: `Dec ${(i % 28) + 1}, 2024`,
  status: statuses[i % statuses.length],
  paidDate: statuses[i % statuses.length] === 'paid' ? `Dec ${Math.max(1, (i % 28) - 5)}, 2024` : undefined,
}))

const filteredPayments = computed(() =>
  allPayments.filter(p => {
    const q = search.value.toLowerCase()
    const matchS = !q || p.studentName.toLowerCase().includes(q) || p.invoice.toLowerCase().includes(q)
    const matchSt = !filterStatus.value || p.status === filterStatus.value
    const matchT = !filterType.value || p.type === filterType.value
    return matchS && matchSt && matchT
  })
)

const paginatedPayments = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredPayments.value.slice(start, start + pageSize.value)
})

const paymentVariant = (s: string) => {
  const m: Record<string, string> = { paid: 'success', pending: 'warning', overdue: 'danger', cancelled: 'muted' }
  return (m[s] ?? 'muted') as 'success' | 'warning' | 'danger' | 'muted'
}

const columns = [
  { key: 'invoice', label: 'Invoice #', sortable: true },
  { key: 'student', label: 'Student', sortable: true },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'paidDate', label: 'Paid Date' },
  { key: 'actions', label: 'Actions', width: '120px' },
]
</script>
