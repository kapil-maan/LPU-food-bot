# 🍽️ LPU Food Guide – AI Chatbot

An AI-powered chatbot to find, compare, and explore food places at **LPU (Lovely Professional University)** campus. Only answers food-related questions. Built with Next.js + Claude API.

---

## 🧠 How It Works (The Logic)

```
User Question
     ↓
Frontend (Next.js page.js)
     ↓
API Route (/api/chat/route.js)
     ↓ injects knowledge base (food-places.js) into system prompt
Claude API (claude-sonnet)
     ↓ strict topic guard in system prompt
Answer returned to frontend
```

- **No ML training needed.** You "train" the bot by editing `data/food-places.js`
- The system prompt tells Claude: *"Only answer LPU food questions, reject everything else"*
- Claude handles natural language — comparisons, suggestions, budget filtering — automatically

---

## 📁 File Structure

```
lpu-food-chatbot/
├── app/
│   ├── api/chat/route.js    ← API endpoint (backend brain)
│   ├── globals.css          ← Styling
│   ├── layout.js            ← HTML wrapper
│   └── page.js              ← Chat UI
├── data/
│   └── food-places.js       ← Your knowledge base (edit this to add places)
├── .env.example             ← Copy → .env.local and add API key
├── .gitignore
├── next.config.js
└── package.json
```

---

## 🚀 Step-by-Step Setup

### 1. Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/lpu-food-chatbot
cd lpu-food-chatbot
npm install
```

### 2. Get Your Gemini API Key
- Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Sign in with Google → Create API Key
- Copy the key

### 3. Set Up Environment
```bash
# Create the env file
cp .env.example .env.local

# Open .env.local and paste your key:
GEMINI_API_KEY=AIza...your-key-here...
```

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## ✏️ How to Add/Edit Food Places ("Training")

Open `data/food-places.js` and add a new object to the array:

```js
{
  id: 9,                              // unique number
  name: "New Stall Name",
  location: "Block X, Ground Floor",
  category: "Fast Food",
  timings: "9:00 AM – 9:00 PM",
  priceRange: "₹20 – ₹80",
  rating: 4.2,
  tags: ["veg", "snacks", "budget"],   // used for filtering
  menu: [
    { item: "Dish Name", price: 40, type: "veg" },
    { item: "Another Dish", price: 70, type: "non-veg" },
  ],
},
```

Save the file — no redeployment needed on Vercel (it auto-redeploys on push).

---

## 🌐 Deploy to Vercel

### Step 1 – Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lpu-food-chatbot.git
git push -u origin main
```

### Step 2 – Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `lpu-food-chatbot` repo
4. **IMPORTANT**: Before deploying, go to **Environment Variables** in Vercel settings
5. Add: `GEMINI_API_KEY` = your Gemini key
6. Click **Deploy**

### Step 3 – Done! 🎉
Vercel gives you a live URL like `https://lpu-food-chatbot.vercel.app`

Every time you `git push`, Vercel auto-redeploys.

---

## 🔒 Security Notes

- ✅ API key is stored in `.env.local` (never goes to GitHub)
- ✅ `.gitignore` excludes `.env.local`
- ✅ Vercel environment variables are encrypted
- ⚠️ Never paste your API key directly in code files

---

## 💡 Ideas to Extend

- Add a price filter slider on the UI
- Add a "compare two places" feature
- Add photos of food stalls
- Add user reviews or ratings
- Connect to a real database (Supabase/Firebase) instead of the JS file
