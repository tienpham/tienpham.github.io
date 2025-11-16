# Quick Setup Guide

Follow these steps to get your blog up and running on GitHub Pages.

## Step 1: Test Locally

```bash
cd blog
npm run dev
```

Visit http://localhost:4321 to see your blog.

## Step 2: Customize Your Blog

### Update Site Information

Edit `src/consts.ts`:
```typescript
export const SITE_TITLE = 'Your Blog Name';
export const SITE_DESCRIPTION = 'Your blog description here';
```

### Update Site URL

Edit `astro.config.mjs`:
```javascript
site: 'https://your-username.github.io',
// If using a project repo add: base: '/repo-name',
```

## Step 3: Set Up Comments (Optional)

1. Go to your GitHub repo Settings > General > Features
2. Check "Discussions" to enable it
3. Visit https://giscus.app/
4. Enter your repo name and follow the configuration
5. Copy the values to `src/components/Comments.astro`:
   - `data-repo`: your-username/your-repo
   - `data-repo-id`: (from giscus.app)
   - `data-category-id`: (from giscus.app)

## Step 4: Deploy to GitHub Pages

### Create Repository

```bash
git init
git add .
git commit -m "Initial blog setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repo on GitHub
2. Settings > Pages
3. Source: Select "GitHub Actions"
4. That's it! The workflow will run automatically

## Step 5: Write Your First Post

1. Create a new file in `src/content/blog/my-first-post.md`
2. Add frontmatter:

```markdown
---
title: 'My First Post'
description: 'This is my first blog post'
pubDate: '2024-11-16'
tags: ['personal', 'introduction']
---

Welcome to my blog! This is my first post.
```

3. Push to GitHub:

```bash
git add .
git commit -m "Add first post"
git push
```

Your site will rebuild automatically!

## Available Routes

- `/` - Homepage
- `/blog` - All blog posts with search
- `/blog/[post-slug]` - Individual post
- `/tags` - All tags
- `/tags/[tag-name]` - Posts by tag
- `/rss.xml` - RSS feed
- `/about` - About page

## Adding Images

1. Place images in `src/assets/` folder
2. Reference in frontmatter:
   ```markdown
   heroImage: '../../assets/my-image.jpg'
   ```

## Next Steps

- Customize styling in component `<style>` blocks
- Add more pages in `src/pages/`
- Modify the header/footer in `src/components/`
- Add Google Analytics or other tracking (in `BaseHead.astro`)

## Need Help?

- Check the main README.md for full documentation
- Visit https://docs.astro.build for Astro docs
- Open an issue if you encounter problems

Happy blogging!
