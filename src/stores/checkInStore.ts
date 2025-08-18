import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { supabase } from '../lib/supabase'

export interface CheckInDay {
  year: number
  month: number
  day: number
}

export const useCheckInStore = defineStore('checkIn', () => {
  // Current displayed month/year
  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth())

  // Store check-in days as an array for persistence
  const checkInDays = ref<string[]>([])
  const isLoading = ref(false)

  // Computed Set for fast lookup
  const checkInDaysSet = computed(() => new Set(checkInDays.value))

  // Computed properties
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
    let count = 0
    for (const dayStr of checkInDays.value) {
      const [year, month, day] = dayStr.split('-').map(Number)
      if (year === currentYear.value && month === currentMonth.value) {
        count++
      }
    }
    return count
  })

  // Load check-ins from Supabase
  const loadCheckIns = async () => {
    try {
      isLoading.value = true
      const { data, error } = await supabase
        .from('check_ins')
        .select('check_in_date')
        .order('check_in_date', { ascending: true })

      if (error) {
        console.error('Error loading check-ins:', error)
        return
      }

      // Convert dates to our string format (YYYY-M-D)
      checkInDays.value = data.map(row => {
        const date = new Date(row.check_in_date)
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      })
    } catch (error) {
      console.error('Error loading check-ins:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Save check-in to Supabase
  const saveCheckIn = async (dayStr: string) => {
    try {
      const [year, month, day] = dayStr.split('-').map(Number)
      // Create date in local timezone to avoid timezone issues
      const checkInDate = new Date(year, month, day)
      const formattedDate = checkInDate.toISOString().split('T')[0]

      const { error } = await supabase
        .from('check_ins')
        .insert([
          { 
            check_in_date: formattedDate,
            user_id: 'default' // We'll update this when we add auth
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

  // Delete check-in from Supabase
  const deleteCheckIn = async (dayStr: string) => {
    try {
      const [year, month, day] = dayStr.split('-').map(Number)
      // Create date in local timezone to avoid timezone issues
      const checkInDate = new Date(year, month, day)
      const formattedDate = checkInDate.toISOString().split('T')[0]

      const { error } = await supabase
        .from('check_ins')
        .delete()
        .eq('check_in_date', formattedDate)
        .eq('user_id', 'default')

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

  // Actions
  const navigateMonth = (direction: 'prev' | 'next') => {
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

  const toggleCheckIn = async (day: number) => {
    const dayStr = `${currentYear.value}-${currentMonth.value}-${day}`
    
    if (checkInDaysSet.value.has(dayStr)) {
      // Remove check-in
      const success = await deleteCheckIn(dayStr)
      if (success) {
        checkInDays.value = checkInDays.value.filter(d => d !== dayStr)
      }
    } else {
      // Add check-in
      const success = await saveCheckIn(dayStr)
      if (success) {
        checkInDays.value = [...checkInDays.value, dayStr]
      }
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

  const setCurrentMonth = (month: number) => {
    currentMonth.value = month
  }

  const setCurrentYear = (year: number) => {
    currentYear.value = year
  }

  return {
    currentYear,
    currentMonth,
    currentMonthName,
    daysInCurrentMonth,
    firstDayOfMonth,
    currentMonthCheckInCount,
    isLoading,
    navigateMonth,
    toggleCheckIn,
    isCheckedIn,
    getMonthCheckInCount,
    setCurrentMonth,
    setCurrentYear,
    loadCheckIns,
    checkInDays
  }
}, {
  persist: true
})
