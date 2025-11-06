# GitHub Setup Instructions

Follow these steps to push to both repositories.

## 📝 Step 1: Create GitHub Repositories

Go to https://github.com/new and create **two repositories**:

### Repository 1: Template (Push Once Only)
- **Name**: `universal-app-starter`
- **Description**: `Production-ready monorepo template for Web + Desktop + Mobile apps with tRPC, Vite, Tauri, and 10+ pre-configured tools`
- **Visibility**: Public (so others can use as template)
- **✅ Check**: "Add a README file" - NO (we have one)
- **Template**: Yes - mark as template repository

### Repository 2: QuoteMaster (Active Development)
- **Name**: `quotemaster`
- **Description**: `Professional estimate and invoice management system built with Vite + React + Tauri`
- **Visibility**: Your choice (Public or Private)
- **✅ Check**: "Add a README file" - NO (we have one)

---

## 🚀 Step 2: Push to Template Repository (ONE TIME ONLY)

```bash
cd /home/dwdec/Projects/quotemaster

# Add template repo as remote
git remote add template https://github.com/wyattfantana/universal-app-starter.git

# Copy TEMPLATE_README.md to README.md temporarily
cp README.md README_QUOTEMASTER.md
cp TEMPLATE_README.md README.md

# Commit the template README
git add README.md
git commit -m "docs: Use template README for universal-app-starter

This README is specifically for the template repository.
The QuoteMaster-specific README is in README_QUOTEMASTER.md"

# Push to template repo
git push -u template main

# Restore QuoteMaster README
git rm README_QUOTEMASTER.md
cp README.md TEMPLATE_README.md
git checkout HEAD~1 -- README.md
git add README.md TEMPLATE_README.md
git commit -m "docs: Restore QuoteMaster README for active development"
```

**✅ Done!** The template is now on GitHub. You'll never push to this repo again.

---

## 🔄 Step 3: Push to QuoteMaster Repository (Ongoing)

```bash
# Add QuoteMaster repo as origin (main remote)
git remote add origin https://github.com/wyattfantana/quotemaster.git

# Push to QuoteMaster
git push -u origin main
```

**✅ Done!** QuoteMaster is now on GitHub. You'll push here regularly.

---

## 📋 Step 4: Verify Setup

```bash
# Check your remotes
git remote -v

# You should see:
# origin    https://github.com/wyattfantana/quotemaster.git (fetch)
# origin    https://github.com/wyattfantana/quotemaster.git (push)
# template  https://github.com/wyattfantana/universal-app-starter.git (fetch)
# template  https://github.com/wyattfantana/universal-app-starter.git (push)
```

---

## 🎯 Normal Workflow (After Setup)

### Make Changes to QuoteMaster

```bash
# Make your changes
git add .
git commit -m "feat: Add new feature"
git push origin main
```

**Note:** Use `git push origin main` (not just `git push`) to ensure you're pushing to QuoteMaster, not the template!

---

## 🌟 GitHub Repository Settings

### Template Repository Settings
1. Go to: https://github.com/wyattfantana/universal-app-starter
2. Settings → General
3. Scroll to "Template repository"
4. ✅ Check "Template repository"
5. Add topics: `template`, `monorepo`, `trpc`, `vite`, `tauri`, `react`, `typescript`

### QuoteMaster Repository Settings
1. Go to: https://github.com/wyattfantana/quotemaster
2. Settings → General
3. Add topics: `invoice`, `estimate`, `business`, `vite`, `react`, `tauri`
4. Set up branch protection for `main` (optional)

---

## 🔐 Optional: Use SSH Instead of HTTPS

If you prefer SSH (recommended for frequent pushes):

```bash
# Remove HTTPS remotes
git remote remove origin
git remote remove template

# Add SSH remotes
git remote add origin git@github.com:wyattfantana/quotemaster.git
git remote add template git@github.com:wyattfantana/universal-app-starter.git

# Push
git push -u origin main
```

---

## ⚠️ Important Notes

1. **Template Repo**: Push ONCE, then never again. It's a snapshot for others to use.
2. **QuoteMaster Repo**: This is your active development repo. Push here regularly.
3. **Default Remote**: After setup, `origin` points to QuoteMaster (your active repo).
4. **Safety**: Always use `git push origin main` to be explicit about where you're pushing.

---

## 🎉 You're All Set!

Both repositories are now on GitHub:
- 🎁 **Template**: https://github.com/wyattfantana/universal-app-starter
- 🚀 **QuoteMaster**: https://github.com/wyattfantana/quotemaster

Happy coding! 🎊
