<template>
  <div class="year-overview-container">
    <div class="year-header">
      <button @click="navigateYear('prev')" class="year-nav-btn">
        &lt;
      </button>
      <h3 class="year-title">{{ displayYear }}</h3>
      <button
        v-if="store.canNavigateYearNext"
        @click="navigateYear('next')"
        class="year-nav-btn"
      >
        &gt;
      </button>
      <span v-else class="nav-spacer" aria-hidden="true"></span>
    </div>
    
    <div class="months-grid">
      <div
        v-for="month in months"
        :key="month.index"
        class="month-card"
        :class="{ 
          'current-month': isCurrentMonth(month.index),
          'has-checkins': month.checkInCount > 0
        }"
        @click="navigateToMonth(month.index)"
      >
        <div class="month-name">{{ month.shortName }}</div>
        <div class="month-count">{{ month.checkInCount }}</div>
        <div class="month-label">check-ins</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCheckInStore } from '../stores/checkInStore'

const store = useCheckInStore()

// Use computed to directly get the current year from the store
const displayYear = computed(() => store.currentYear)

const months = computed(() => {
  const monthNames = [
    { full: 'January', short: 'Jan' },
    { full: 'February', short: 'Feb' },
    { full: 'March', short: 'Mar' },
    { full: 'April', short: 'Apr' },
    { full: 'May', short: 'May' },
    { full: 'June', short: 'Jun' },
    { full: 'July', short: 'Jul' },
    { full: 'August', short: 'Aug' },
    { full: 'September', short: 'Sep' },
    { full: 'October', short: 'Oct' },
    { full: 'November', short: 'Nov' },
    { full: 'December', short: 'Dec' }
  ]
  
  const currentDate = new Date()
  const currentYearNum = currentDate.getFullYear()
  const currentMonthNum = currentDate.getMonth()
  
  return monthNames.map(({ full, short }, index) => ({
    name: full,
    shortName: short,
    index,
    checkInCount: store.getMonthCheckInCount(displayYear.value, index),
    isFuture:
      displayYear.value > currentYearNum ||
      (displayYear.value === currentYearNum && index > currentMonthNum)
  })).filter(month => !month.isFuture)
})

const isCurrentMonth = (monthIndex: number) => {
  return monthIndex === store.currentMonth && displayYear.value === store.currentYear
}

const navigateToMonth = (monthIndex: number) => {
  // Set both year and month in the store
  store.setCurrentYear(displayYear.value)
  store.setCurrentMonth(monthIndex)
}

const navigateYear = (direction: 'prev' | 'next') => {
  if (direction === 'next' && !store.canNavigateYearNext) return
  if (direction === 'prev') {
    store.setCurrentYear(store.currentYear - 1)
  } else {
    store.setCurrentYear(store.currentYear + 1)
  }
}
</script>

<style scoped>
.year-overview-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .year-overview-container {
    padding: 24px;
  }
}

.year-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.year-nav-btn {
  background: orange;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.year-nav-btn:hover:not(:disabled) {
  background: rgb(236, 154, 47);
}

.nav-spacer {
  width: 42px;
  flex-shrink: 0;
}

.year-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 10px;
  width: 100%;
}

@media (min-width: 480px) {
  .months-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
}

.month-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 6px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
}

.month-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.month-card.current-month {
  background: #66ccff;
  border-color: #2563eb;
  color: black;
}

.month-card.has-checkins {
  border-color: orange;
  background: yellow;
}

.month-card.has-checkins:hover {
  background: #febc21;
  border-color: orange;
}

.month-card.current-month.has-checkins {
  background: #febc21;
  border-color: orange;
}

.month-name {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.month-count {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  min-height: 1.2em;
}

.month-label {
  font-size: 9px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.month-card.current-month .month-label {
  opacity: 0.9;
}
</style> 