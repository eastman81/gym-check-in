<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="store.navigateMonth('prev')" class="nav-btn">
        &lt;
      </button>
      <h2 class="month-title">{{ store.currentMonthName }}</h2>
      <button
        v-if="store.canNavigateMonthNext"
        @click="store.navigateMonth('next')"
        class="nav-btn"
      >
        &gt;
      </button>
      <span v-else class="nav-spacer" aria-hidden="true"></span>
    </div>

    <div class="check-in-counter">
      <span class="counter-label">Check-ins this month:</span>
      <span class="counter-value">{{ store.currentMonthCheckInCount }}</span>
    </div>

    <div class="calendar-grid">
      <!-- Day headers -->
      <div class="day-header" v-for="day in dayNames" :key="day">
        {{ day }}
      </div>

      <!-- Empty cells for days before the first day of the month -->
      <div 
        v-for="i in store.firstDayOfMonth" 
        :key="`empty-${i}`" 
        class="calendar-day empty"
      ></div>

      <!-- Calendar days -->
      <div
        v-for="day in store.daysInCurrentMonth"
        :key="day"
        class="calendar-day"
        :class="{ 
          'checked-in': store.isCheckedIn(day),
          'today': isToday(day),
          'future': isFutureDay(day)
        }"
        @click="handleDayClick(day)"
        :aria-disabled="isFutureDay(day)"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCheckInStore } from '../stores/checkInStore'

const store = useCheckInStore()

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const isToday = (day: number) => {
  const today = new Date()
  return (
    today.getDate() === day &&
    today.getMonth() === store.currentMonth &&
    today.getFullYear() === store.currentYear
  )
}

const isFutureDay = (day: number) => {
  const today = new Date()
  if (store.currentYear > today.getFullYear()) return true
  if (store.currentYear < today.getFullYear()) return false
  if (store.currentMonth > today.getMonth()) return true
  if (store.currentMonth < today.getMonth()) return false
  return day > today.getDate()
}

const handleDayClick = (day: number) => {
  if (!isFutureDay(day)) {
    store.toggleCheckIn(day)
  }
}
</script>

<style scoped>
.calendar-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .calendar-container {
    padding: 24px;
  }
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.nav-btn {
  background: orange;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: rgb(236, 154, 47);
}

.nav-spacer {
  width: 42px;
  flex-shrink: 0;
}

.month-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-align: center;
  flex: 1;
  min-width: 0;
}

@media (min-width: 480px) {
  .month-title {
    font-size: 24px;
  }
}

.check-in-counter {
  text-align: center;
  margin-bottom: 20px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.counter-label {
  font-size: 14px;
  color: #6b7280;
  margin-right: 8px;
}

.counter-value {
  font-size: 18px;
  font-weight: 600;
  color: orange;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-header {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding: 4px 2px;
  font-size: 12px;
}

@media (min-width: 480px) {
  .day-header {
    padding: 8px;
    font-size: 14px;
  }
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.calendar-day:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.calendar-day.checked-in {
  background: yellow;
  color: black;
  border-color: orange;
}

.calendar-day.checked-in:hover {
  background: rgb(236, 154, 47);
}

.calendar-day.today {
  border-color: red;
  font-weight: 600;
}

.calendar-day.today.checked-in {
  border-color: orange;
}

.calendar-day.empty {
  cursor: default;
}

.calendar-day.empty:hover {
  background: transparent;
  border-color: transparent;
}

.calendar-day.future {
  color: #bdbdbd;
  background: #f3f4f6;
  cursor: not-allowed;
  pointer-events: none;
  border-color: #e5e7eb;
}
</style>
