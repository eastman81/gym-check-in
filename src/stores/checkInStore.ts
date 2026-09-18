import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const USER_ID = 'default'

export interface CheckInDay {
  year: number
  month: number
  day: number
}

export const useCheckInStore = defineStore('checkIn', () => {
  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth())

  const checkInDays = ref<string[]>([])
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)
  const saveError = ref<string | null>(null)
  const savingDay = ref<number | null>(null)

  const checkInDaysSet = computed(() => new Set(checkInDays.value))

  const currentMonthName = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  })

  const daysInCurrentMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  })

  const firstDayOfMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay()
  })

  const currentMonthCheckInCount = computed(() => {
    return getMonthCheckInCount(currentYear.value, currentMonth.value)
  })

  const isViewingCurrentMonth = computed(() => {
    const today = new Date()
    return (
      currentYear.value === today.getFullYear() &&
      currentMonth.value === today.getMonth()
    )
  })

  const isFutureMonth = (year: number, month: number) => {
    const today = new Date()
    if (year > today.getFullYear()) return true
    if (year < today.getFullYear()) return false
    return month > today.getMonth()
  }

  const canNavigateMonthNext = computed(() => {
    let nextYear = currentYear.value
    let nextMonth = currentMonth.value + 1
    if (nextMonth > 11) {
      nextMonth = 0
      nextYear++
    }
    return !isFutureMonth(nextYear, nextMonth)
  })

  const canNavigateYearNext = computed(() => {
    return currentYear.value < new Date().getFullYear()
  })

  const goToToday = () => {
    const today = new Date()
    currentYear.value = today.getFullYear()
    currentMonth.value = today.getMonth()
  }

  let saveErrorTimeout: ReturnType<typeof setTimeout> | null = null

  const showSaveError = (message: string) => {
    saveError.value = message
    if (saveErrorTimeout) clearTimeout(saveErrorTimeout)
    saveErrorTimeout = setTimeout(() => {
      saveError.value = null
    }, 4000)
  }

  const loadCheckIns = async () => {
    try {
      isLoading.value = true
      loadError.value = null

      const { data, error } = await supabase
        .from('check_ins')
        .select('check_in_date')
        .order('check_in_date', { ascending: true })

      if (error) {
        console.error('Error loading check-ins:', error)
        loadError.value = "Couldn't load check-ins. Please refresh and try again."
        return
      }

      checkInDays.value = data.map(row => {
        const date = new Date(row.check_in_date + 'T00:00:00')
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      })
    } catch (error) {
      console.error('Error loading check-ins:', error)
      loadError.value = "Couldn't load check-ins. Please refresh and try again."
    } finally {
      isLoading.value = false
    }
  }

  const saveCheckIn = async (dayStr: string) => {
    try {
      const [year, month, day] = dayStr.split('-').map(Number)
      const localDate = new Date(year, month, day)
      const formattedDate = localDate.toLocaleDateString('en-CA')

      const { error } = await supabase
        .from('check_ins')
        .insert([
          {
            check_in_date: formattedDate,
            user_id: USER_ID
          }
        ])

      if (error) {
        console.error('Error saving check-in:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error saving check-in:', error)
      return false
    }
  }

  const deleteCheckIn = async (dayStr: string) => {
    try {
      const [year, month, day] = dayStr.split('-').map(Number)
      const localDate = new Date(year, month, day)
      const formattedDate = localDate.toLocaleDateString('en-CA')

      const { error } = await supabase
        .from('check_ins')
        .delete()
        .eq('check_in_date', formattedDate)
        .eq('user_id', USER_ID)

      if (error) {
        console.error('Error deleting check-in:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error deleting check-in:', error)
      return false
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next' && !canNavigateMonthNext.value) return

    if (direction === 'prev') {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    } else {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }
  }

  const toggleCheckIn = async (day: number): Promise<boolean> => {
    const dayStr = `${currentYear.value}-${currentMonth.value}-${day}`

    savingDay.value = day
    saveError.value = null

    try {
      if (checkInDaysSet.value.has(dayStr)) {
        const success = await deleteCheckIn(dayStr)
        if (success) {
          checkInDays.value = checkInDays.value.filter(d => d !== dayStr)
          return true
        }
        showSaveError("Couldn't remove check-in. Please try again.")
        return false
      }

      const success = await saveCheckIn(dayStr)
      if (success) {
        checkInDays.value = [...checkInDays.value, dayStr]
        return true
      }
      showSaveError("Couldn't save check-in. Please try again.")
      return false
    } finally {
      savingDay.value = null
    }
  }

  const isCheckedIn = (day: number) => {
    const dayStr = `${currentYear.value}-${currentMonth.value}-${day}`
    return checkInDaysSet.value.has(dayStr)
  }

  const getMonthCheckInCount = (year: number, month: number) => {
    let count = 0
    for (const dayStr of checkInDays.value) {
      const [y, m] = dayStr.split('-').map(Number)
      if (y === year && m === month) {
        count++
      }
    }
    return count
  }

  const getYearCheckInCount = (year: number) => {
    let count = 0
    for (const dayStr of checkInDays.value) {
      const [y] = dayStr.split('-').map(Number)
      if (y === year) {
        count++
      }
    }
    return count
  }

  const setCurrentMonth = (month: number) => {
    if (isFutureMonth(currentYear.value, month)) return
    currentMonth.value = month
  }

  const setCurrentYear = (year: number) => {
    const today = new Date()
    if (year > today.getFullYear()) return
    currentYear.value = year
    if (isFutureMonth(currentYear.value, currentMonth.value)) {
      currentMonth.value = today.getMonth()
    }
  }

  return {
    currentYear,
    currentMonth,
    currentMonthName,
    daysInCurrentMonth,
    firstDayOfMonth,
    currentMonthCheckInCount,
    isViewingCurrentMonth,
    isLoading,
    loadError,
    saveError,
    savingDay,
    navigateMonth,
    canNavigateMonthNext,
    canNavigateYearNext,
    goToToday,
    isFutureMonth,
    toggleCheckIn,
    isCheckedIn,
    getMonthCheckInCount,
    getYearCheckInCount,
    setCurrentMonth,
    setCurrentYear,
    loadCheckIns,
    checkInDays
  }
}, {
  persist: {
    pick: ['checkInDays'],
    afterHydrate: (ctx) => {
      const store = ctx.store as ReturnType<typeof useCheckInStore>
      store.goToToday()
    }
  }
})
