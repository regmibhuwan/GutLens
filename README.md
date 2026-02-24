# 🔍 GutLens — AI Food Scanner for IBS

**See clearly. Eat safely with IBS.**

GutLens is a beautiful, mobile-first web app that helps people with IBS instantly check any food for safety. Snap a photo, record a video, upload an image, or scan a barcode — and get personalized FODMAP guidance powered by AI in seconds.

## ✨ Features

- 📸 **Live Camera** — Point and snap with beautiful viewfinder UI
- 🎥 **Video Capture** — Record up to 10 seconds, analyze the frame
- 📤 **Upload** — Drag & drop images or videos
- 📊 **Barcode Scanner** — Scan packaged food barcodes
- 🤖 **AI Analysis** — GPT-4o powered food identification & FODMAP assessment
- 🟢🟡🔴 **Safety Ratings** — Clear Green/Yellow/Red traffic light system
- 📏 **Safe Portions** — Personalized portion guidance
- 👤 **IBS Profile** — Set your IBS type & personal triggers
- 📚 **Learn** — Beautiful IBS & FODMAP education cards
- 📱 **PWA Ready** — Install on your phone like a native app
- 🌙 **Dark Mode** — Easy on the eyes
- 💾 **History** — All past scans saved locally

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- An OpenAI API key with GPT-4o access

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd GutLens

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-your-key-here

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments. Set `OPENAI_API_KEY` in your Vercel project environment variables.

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | App Router, Server Actions, React 19 |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui + Radix | UI components |
| Framer Motion | Animations |
| Lucide React | Icons |
| Vercel AI SDK | OpenAI integration |
| react-webcam | Camera capture |
| html5-qrcode | Barcode scanning |
| Zustand | Client state management |
| Sonner | Toast notifications |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/analyze/    # AI analysis API route
│   ├── history/        # Scan history page
│   ├── learn/          # IBS education page
│   ├── profile/        # User profile page
│   ├── scan/           # Scanner page (camera/video/upload/barcode)
│   ├── globals.css     # Global styles & theme
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/
│   ├── scanner/        # Camera, Video, Upload, Barcode, Results
│   ├── ui/             # shadcn/ui components
│   ├── BottomNav.tsx   # Mobile navigation
│   ├── PWARegister.tsx # Service worker registration
│   └── StoreHydration.tsx
├── lib/
│   ├── store.ts        # Zustand store
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Utility functions
public/
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
└── icon-*.svg          # App icons
```

## ⚠️ Disclaimer

GutLens is an AI assistant tool and does not provide medical advice. Always consult your doctor or registered dietitian for personalized dietary guidance. FODMAP information is based on Monash University research.

## 📄 License

MIT
