# Simple Gym Check-In App

![SpongeBob Flexing](https://tenor.com/view/sponge-bob-square-pants-work-out-muscles-flex-nickelodeon-gif-3580600)

A Vue 3 web app for tracking your gym check-ins with a beautiful calendar interface.

## 🏋️ Features

- **Interactive Calendar** - Click days to check in/out
- **Month Navigation** - Browse different months and years
- **Year Overview** - See check-in counts for all months
- **Persistent Storage** - Data saved to Supabase database
- **Responsive Design** - Works on desktop and mobile
- **Gym Branding** - Official gym logos and styling

## 🏢 Current Gyms

- **[Hyde Park Gym](https://hydeparkgym.com/)** - Austin, TX

## 🚀 Live Demo

Visit the app: [https://forresteastland.com/gym-check-in/](https://forresteastland.com/gym-check-in/)

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Styling**: CSS with gym branding
- **Database**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages
- **Build Tool**: Vite

## 📦 Installation

```sh
npm install
```

## 🏃‍♂️ Development

```sh
npm run dev
```

## 🚀 Deployment

```sh
./deploy.sh
```

## 📁 Project Structure

```
src/
├── components/
│   ├── GymCalendar.vue      # Main calendar component
│   └── YearOverview.vue     # Year overview with month counts
├── stores/
│   └── checkInStore.ts      # Pinia store with Supabase integration
├── views/
│   └── HomeView.vue         # Main page layout
└── lib/
    └── supabase.ts          # Supabase client configuration
```

## 🎯 Usage

1. **Check In**: Click any day on the calendar to mark it as a gym day
2. **Navigate**: Use arrow buttons to move between months
3. **Overview**: View your monthly check-in counts in the year overview
4. **Persistent**: Your data is automatically saved and persists across sessions

## 🔧 Configuration

The app uses environment variables for Supabase configuration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 License

Built for gym enthusiasts everywhere
