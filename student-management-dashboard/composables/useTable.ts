import { ref, computed } from 'vue'
import type { SortState } from '~/types'

interface UseTableOptions<T> {
  data: () => T[]
  searchFields?: (keyof T)[]
  defaultSort?: SortState
  defaultPageSize?: number
}

export function useTable<T extends Record<string, unknown>>(options: UseTableOptions<T>) {
  const search = ref('')
  const page = ref(1)
  const pageSize = ref(options.defaultPageSize ?? 10)
  const sort = ref<SortState>(options.defaultSort ?? { key: '', direction: 'asc' })
  const filters = ref<Record<string, string>>({})

  const filteredData = computed(() => {
    let result = [...options.data()]

    // Search
    if (search.value && options.searchFields?.length) {
      const q = search.value.toLowerCase()
      result = result.filter(item =>
        options.searchFields!.some(field => {
          const val = item[field]
          return typeof val === 'string' && val.toLowerCase().includes(q)
        })
      )
    }

    // Filters
    for (const [key, value] of Object.entries(filters.value)) {
      if (value) {
        result = result.filter(item => item[key] === value)
      }
    }

    // Sort
    if (sort.value.key) {
      result.sort((a, b) => {
        const aVal = a[sort.value.key]
        const bVal = b[sort.value.key]
        const dir = sort.value.direction === 'asc' ? 1 : -1
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * dir
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * dir
        }
        return 0
      })
    }

    return result
  })

  const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value))
  const total = computed(() => filteredData.value.length)

  const paginatedData = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredData.value.slice(start, start + pageSize.value)
  })

  const setSort = (key: string) => {
    if (sort.value.key === key) {
      sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = { key, direction: 'asc' }
    }
  }

  const setFilter = (key: string, value: string) => {
    if (value) filters.value[key] = value
    else delete filters.value[key]
    page.value = 1
  }

  const setSearch = (query: string) => {
    search.value = query
    page.value = 1
  }

  const setPage = (p: number) => {
    page.value = Math.max(1, Math.min(p, totalPages.value))
  }

  const setPageSize = (size: number) => {
    pageSize.value = size
    page.value = 1
  }

  const clearFilters = () => {
    filters.value = {}
    search.value = ''
    page.value = 1
  }

  return {
    search,
    page,
    pageSize,
    sort,
    filters,
    filteredData,
    paginatedData,
    totalPages,
    total,
    setSort,
    setFilter,
    setSearch,
    setPage,
    setPageSize,
    clearFilters,
  }
}
