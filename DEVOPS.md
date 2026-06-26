# DevOps & Deployment Guide 🚀

This guide outlines the steps required to push your ArtisanConnect code to GitHub and deploy it for production. Since this is a Next.js application integrated with Supabase, **Vercel** is the highly recommended deployment platform.

---

## Step 1: Push Code to GitHub

First, you need to commit your local code and push it to a new GitHub repository.

1. **Initialize Git (if not already done)**
   Open your terminal in the project root (`C:\Users\DellXPS15\Documents\antigravity\modest-borg`) and run:
   ```bash
   git init
   ```

2. **Add and Commit Your Files**
   Add all your files to staging and commit them with a descriptive message:
   ```bash
   git add .
   git commit -m "Initial commit: Complete ArtisanConnect MVP"
   ```

3. **Create a GitHub Repository**
   - Go to [GitHub.com](https://github.com/new) and create a new repository.
   - You can name it `artisan-connect` (leave it public or private).
   - Do **NOT** initialize it with a README, .gitignore, or license (since you already have local files).

4. **Link and Push**
   Copy the commands provided by GitHub under "…or push an existing repository from the command line" and paste them into your terminal:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/artisan-connect.git
   git push -u origin main
   ```

---

## Step 2: Deploy to Vercel

Vercel provides the most seamless experience for Next.js applications.

1. **Log into Vercel**
   Go to [Vercel](https://vercel.com/) and log in with your GitHub account.

2. **Import Project**
   - Click **"Add New..." > "Project"**.
   - Under "Import Git Repository", find your newly created `artisan-connect` repository and click **Import**.

3. **Configure the Project**
   - **Framework Preset**: Vercel should automatically detect this as **Next.js**.
   - **Root Directory**: If your Next.js app is inside the `apps/web` folder of a monorepo, click "Edit" next to Root Directory and select `apps/web`. If the `package.json` is in the root, leave it as is.
   - **Build Command**: `npm run build` (or leave default).

4. **Add Environment Variables 🔐**
   This is the most critical step. Expand the **Environment Variables** section and copy/paste *every single variable* from your local `.env` file. 

   Ensure you include:
   ```env
   # Supabase
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_KEY=...
   DATABASE_URL=...
   DIRECT_URL=...

   # Mapbox
   NEXT_PUBLIC_MAPBOX_TOKEN=...
   MAPBOX_ACCESS_TOKEN=...

   # Resend
   RESEND_API_KEY=...

   # Gemini API
   GEMINI_API_KEY=AIzaSyD0J36lyIg-HkFvrHJ84906vA6P9EMyvDo

   # Frontend URLs
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   *(Note: You can skip `NEXT_PUBLIC_API_URL` and `PORT` if you are relying entirely on Next.js Server Actions rather than a separate Node backend).*

5. **Deploy!**
   Click the **Deploy** button. Vercel will clone your repo, build the Next.js app, and deploy it to a live URL.

---

## Step 3: Post-Deployment Configuration

1. **Supabase Auth Redirect URLs**
   Once your app is live on Vercel, you will get a production URL (e.g., `https://artisan-connect.vercel.app`).
   - Go to your Supabase Dashboard > Authentication > URL Configuration.
   - Add your new Vercel URL to the **Site URL** and **Redirect URLs** so that authentication works correctly in production.

2. **Resend Domain Verification (Optional but Recommended)**
   - To send emails to people *other* than yourself, you must verify your custom domain in the [Resend Dashboard](https://resend.com/domains).
   - Follow their instructions to add the required DNS records (DKIM/SPF) to your domain registrar (e.g., Namecheap, GoDaddy).

---

## Troubleshooting Deployments
- **Prisma Issues**: Vercel automatically runs `prisma generate` before building if it detects Prisma. Ensure `@prisma/client` is in your standard `dependencies` (not `devDependencies`), which we have already confirmed it is!
- **Build Errors**: Check the Vercel logs. If a specific page fails to build due to a missing type or unused variable, Vercel will flag the exact line number.
