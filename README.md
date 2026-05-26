# ⭐ TaskStar — Make Chores Fun!

Daily, weekly & monthly tasks for your kids — with rewards, celebrations, and parent updates built right in.

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Push to GitHub
1. Go to github.com and create a new repository called `taskstar`
2. Open Terminal on your computer
3. Run these commands one by one:
```bash
cd taskstar
git init
git add .
git commit -m "Initial TaskStar commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskstar.git
git push -u origin main
```

### Step 2 — Connect to Vercel
1. Go to vercel.com and log in
2. Click "Add New Project"
3. Click "Import" next to your `taskstar` GitHub repo
4. Click "Deploy" — Vercel handles the rest!
5. Your app is live at `taskstar.vercel.app` 🎉

### Step 3 — Add Environment Variables
1. In Vercel dashboard → your project → Settings → Environment Variables
2. Add each variable from `.env.example`
3. Redeploy

### Step 4 — Custom Domain (optional)
1. In Vercel → Settings → Domains
2. Add `taskstar.com` (or whatever you choose)
3. Follow the DNS instructions

## 🛠️ Local Development
```bash
npm install
npm run dev
```
Open http://localhost:3000

## 📁 Project Structure
```
taskstar/
├── app/
│   ├── components/
│   │   ├── LandingPage.tsx      # Home page
│   │   ├── AuthScreen.tsx       # Login / Signup
│   │   ├── ParentDashboard.tsx  # Parent view
│   │   └── KidDashboard.tsx     # Kid view
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # App layout
│   └── page.tsx                 # Main entry point
├── .env.example                 # Environment variable template
├── .gitignore                   # Files NOT pushed to GitHub
└── README.md                    # This file
```

## 🔮 Coming Next (Phase 2)
- [ ] Real user accounts with Supabase
- [ ] Email verification on signup
- [ ] Password recovery
- [ ] Daily & weekly email reports (Resend)
- [ ] Stripe subscription payments
- [ ] Admin dashboard
