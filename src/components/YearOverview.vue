<template>
  <div class="year-overview-container">
    <div class="year-header">
      <button @click="navigateYear('prev')" class="year-nav-btn">
        &lt;
      </button>
      <h3 class="year-title">{{ displayYear }}</h3>
      <button @click="navigateYear('next')" class="year-nav-btn">
        &gt;
      </button>
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
        <div class="month-name">{{ month.name }}</div>
        <div class="month-count">{{ month.checkInCount }}</div>
        <div class="month-label">check-ins</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCheckInStore } from '../stores/checkInStore'

const store = useCheckInStore()

// Use computed to directly get the current year from the store
const displayYear = computed(() => store.currentYear)

const months = computed(() => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const currentDate = new Date()
  const currentYearNum = currentDate.getFullYear()
  const currentMonthNum = currentDate.getMonth()
  
  return monthNames.map((name, index) => ({
    name,
    index,
    checkInCount: store.getMonthCheckInCount(displayYear.value, index),
    isFuture: displayYear.value === currentYearNum && index > currentMonthNum
  })).filter(month => !month.isFuture) // Don't show future months
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
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
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

.year-nav-btn:hover {
  background: rgb(236, 154, 47);
}

.year-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  align-items: stretch;
}

.month-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: unset;
}

.month-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
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
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.month-count {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
}

.month-label {
  font-size: 10px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.month-card.current-month .month-label {
  opacity: 0.9;
}
</style> 