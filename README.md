# Clippr ✂️

**Clippr** is a modern, cross-platform solution for scheduling and managing barbershop appointments. This MVP connects clients with top-tier barber services through a seamless mobile and web experience.

## 🚀 Overview

Clippr is built as a monorepo containing two main applications:
- **Clippr App**: A mobile application for clients to book appointments, manage their profile, and explore barbershops. Built with [Expo](https://expo.dev/) and React Native.
- **Clippr Web**: A landing page and dashboard for barbershops to manage their business presence. Built with [Next.js](https://nextjs.org/).

## 🛠️ Tech Stack

- **Mobile**: React Native, Expo, TypeScript, Expo Router
- **Web**: Next.js 15+, React 19, Tailwind CSS v4, Lucide React
- **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: React Context / Hooks

## 📂 Project Structure

```bash
Clippr/
├── app/
│   ├── clippr-app/      # Mobile Application (Expo)
│   └── clippr-web/      # web Application (Next.js)
├── .env                 # Root environment variables (Supabase)
└── README.md            # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (LTS recommended)
- Use a package manager like `npm` or `yarn`.

### Environment Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/clippr.git
    cd clippr
    ```

2.  Configure Environment Variables:
    - Create a `.env` file in the root directory (refer to `.env.example` inside `app/clippr-app/` or `app/clippr-web/` for required keys).
    - Required keys typically include:
        - `SUPABASE_URL`
        - `SUPABASE_SERVICE_ROLE_KEY` (for server-side scripts)
        - `EXPO_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
        - `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Running the Project

#### Mobile App
```bash
cd app/clippr-app
npm install
npm start
```
Use the Expo Go app on your phone or an emulator to run the application.

#### Web App
```bash
cd app/clippr-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📱 Features (MVP)

- **Authentication**: Secure login and registration via Supabase Auth.
- **Booking System**: Real-time availability and appointment scheduling.
- **Barber Profiles**: Detailed profiles with ratings, portfolios, and services.
- **Dashboard**: Management interface for barbershops (Web).
- **Responsive Design**: Optimized for both mobile and desktop users.

## 📸 Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://imgur.com/68qXFII.png" height="400" alt="Screenshot 1" />
  <img src="https://imgur.com/qOwKuGb.png" height="400" alt="Screenshot 2" />
  <img src="https://imgur.com/1gnkXUk.png" height="400" alt="Screenshot 3" />
  <img src="https://imgur.com/YVBDBWl.png" height="400" alt="Screenshot 4" />
  <img src="https://imgur.com/A387Wi9.png" height="400" alt="Screenshot 5" />
  <img src="https://imgur.com/yiVHPrK.png" height="400" alt="Screenshot 6" />
  <img src="https://imgur.com/oUIJWkC.png" height="400" alt="Screenshot 7" />
</div>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
