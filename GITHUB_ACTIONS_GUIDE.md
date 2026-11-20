# GitHub Actions Video Rendering Guide

This project includes two workflows for automatic video rendering on GitHub's servers (free for public repos).

## 🎬 Workflows

### 1. Full Pipeline (`.github/workflows/render.yml`)
**Triggers:** Push to main/master, or manual dispatch

**Features:**
- Renders selected composition with quality options
- On main branch: renders ALL 4 compositions
- Deploys preview page to GitHub Pages
- 30-day artifact retention

### 2. Quick Render (`.github/workflows/render-simple.yml`)
**Triggers:** Manual only (workflow_dispatch)

**Features:**
- Single composition, fast render
- 7-day artifact retention
- Minimal config

---

## 🚀 How to Use

### Option A: Push to GitHub (Automatic)

```bash
# 1. Initialize git (if not already)
cd /root/my-video
git init
git add .
git commit -m "Initial commit: PS2 Winter Walk animation"

# 2. Create GitHub repo (via web or CLI)
gh repo create my-remotion-video --public --source=. --push

# 3. Done! On push to main, workflow runs automatically
# Check: https://github.com/YOUR_USERNAME/my-remotion-video/actions
```

### Option B: Manual Trigger (No Push Needed)

1. Go to your repo on GitHub
2. Click **Actions** tab
3. Select **Quick Render** workflow
4. Click **Run workflow** (right side)
5. Choose composition: `PS2WinterWalk` (or Square/Vertical)
6. Click **Run workflow**

---

## 📥 Getting Your Video

### From Artifacts (Both Workflows)
1. Go to **Actions** → select the workflow run
2. Scroll to **Artifacts** section at bottom
3. Click the artifact name (e.g., `PS2WinterWalk-video`)
3. Downloads as ZIP → extract → `video.mp4`

### From GitHub Pages (Full Pipeline Only)
After main branch push completes:
- Preview page: `https://YOUR_USERNAME.github.io/REPO_NAME/`
- Direct MP4 links in the page

---

## ⚙️ Configuration

### Change Default Composition
Edit `.github/workflows/render-simple.yml`:
```yaml
inputs:
  composition:
    default: 'PS2WinterWalkSquare'  # Change default
```

### Adjust Quality
In `render.yml`, modify the quality matrix:
```yaml
QUALITY: ${{ github.event.inputs.quality || 'high' }}
```
Options: `high` (CRF=18), `medium` (CRF=23), `low` (CRF=28)

### Add Sound Files
**Required:** Place these in `public/sfx/` before pushing:
- `snow_step.mp3`
- `wind_winter.mp3`
- `city_ambience.mp3`
- `breath_cold.mp3`
- `jacket_rustle.mp3`

See `public/sfx/README.md` for specs.

---

## 💰 Costs

| Repository Type | Cost |
|----------------|------|
| **Public** | **FREE** (unlimited minutes) |
| Private | 2,000 min/month free, then $0.008/min |

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `Chrome failed to start` | Workflow installs Chrome deps automatically |
| `Composition not found` | Check composition ID in `Root.tsx` matches input |
| `Out of memory` | Reduce concurrency: `--concurrency=2` |
| `Timeout` | Increase `timeout-minutes` in workflow |
| `Artifact not found` | Check workflow run logs for render errors |

---

## 📱 Quick Commands

```bash
# View workflow runs
gh run list --workflow=render.yml

# Watch latest run
gh run watch

# Download artifact from CLI
gh run download --name=PS2WinterWalk-video

# Trigger manual render
gh workflow run render-simple.yml -f composition=PS2WinterWalk
```

---

## 🔗 Links After Setup

| Link | Purpose |
|------|---------|
| `https://github.com/USER/REPO/actions` | All workflow runs |
| `https://github.com/USER/REPO/actions/runs/RUN_ID` | Specific run |
| `https://USER.github.io/REPO/` | Preview page (after main push) |
| `https://github.com/USER/REPO/actions/workflows/render-simple.yml` | Manual trigger page |

---

**Ready?** Just push to GitHub and the workflow handles the rest!