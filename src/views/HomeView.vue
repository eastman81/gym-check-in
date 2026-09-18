<script setup lang="ts">
import GymCalendar from '../components/GymCalendar.vue'
import YearOverview from '../components/YearOverview.vue'
import logoImage from '../assets/arm_red_100.png'
</script>

<template>
  <main class="home-container">
    <div class="header">
      <div class="header-main">
        <a href="https://hydeparkgym.com/" target="_blank" rel="noopener noreferrer">
          <img :src="logoImage" alt="Hyde Park Gym Logo" class="gym-logo" />
        </a>
        <div class="gym-title-container">
          <h1 class="gym-title">HYDE PARK GYM</h1>
          <p class="subtitle">A Friendly Neighborhood Gym in Austin, TX</p>
        </div>
      </div>
    </div>
    
    <div class="content-grid">
      <GymCalendar />
      <YearOverview />
    </div>
  </main>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: none;
}

.gym-logo {
  margin-right: 12px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-main {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.gym-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  margin-top: 14px;
}

.gym-title {
  font-size: 32px !important;
  font-weight: 400 !important;
  line-height: 1.1 !important;
  text-decoration: none;
  text-rendering: optimizelegibility;
  color: red;
}

@media (min-width: 480px) {
  .header-main {
    flex-wrap: nowrap;
  }

  .gym-title {
    font-size: 42px !important;
  }
}

@media (min-width: 768px) {
  .gym-title-container {
    width: 426px;
  }

  .gym-title {
    font-size: 56px !important;
    line-height: 36px !important;
  }
}

.subtitle {
  font-size: 14px;
  font-style: italic;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: white;
  margin: 0;
  font-weight: 300;
  padding-left: 4px;
  padding-top: 10px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
  align-items: start;
}

@media (min-width: 768px) {
  .home-container {
    padding: 40px 24px;
  }

  .content-grid {
    grid-template-columns: minmax(0, 400px) minmax(0, 1fr);
    gap: 40px;
  }
}
</style>
