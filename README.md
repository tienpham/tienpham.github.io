# Static Blog with Astro

A modern, feature-rich static blog built with Astro, designed for easy deployment to GitHub Pages.

## Features

- **Markdown & MDX Support** - Write posts in Markdown with frontmatter
- **Tags System** - Organize posts with tags and category pages
- **Search Functionality** - Powered by Pagefind for fast, static search
- **RSS Feed** - Auto-generated RSS feed for subscribers
- **Comments** - Giscus integration for GitHub Discussions-based comments
- **SEO Optimized** - Canonical URLs, OpenGraph data, and sitemap
- **100/100 Lighthouse Performance**
- **GitHub Pages Ready** - Automated deployment workflow included

## Project Structure

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── Comments.astro      # Giscus comments
│   │   ├── Search.astro        # Pagefind search
│   │   └── ...
│   ├── content/
│   │   └── blog/               # Your blog posts (Markdown)
│   ├── layouts/
│   │   └── BlogPost.astro      # Blog post layout
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing
│   │   │   └── [...slug].astro # Dynamic post pages
│   │   ├── tags/
│   │   │   ├── index.astro     # All tags
│   │   │   └── [tag].astro     # Posts by tag
│   │   ├── index.astro         # Homepage
│   │   └── rss.xml.js          # RSS feed
│   ├── content.config.ts       # Content schema
│   └── consts.ts               # Site constants
└── astro.config.mjs
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your blog.

### 3. Configure Your Site

Edit `src/consts.ts`:
```typescript
export const SITE_TITLE = 'Your Blog Name';
export const SITE_DESCRIPTION = 'Your blog description';
```

Edit `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://your-username.github.io',
  // If using a project repo: base: '/repo-name',
});
```

## Writing Blog Posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: 'My First Post'
description: 'A brief description'
pubDate: '2024-01-15'
heroImage: '../../assets/my-image.jpg'
tags: ['tutorial', 'web-dev']
---

Your content here...
```

### Frontmatter Fields

- `title` (required) - Post title
- `description` (required) - Brief description for SEO
- `pubDate` (required) - Publication date
- `heroImage` (optional) - Featured image
- `tags` (optional) - Array of tags
- `updatedDate` (optional) - Last updated date

## Features Setup

### Search (Pagefind)

Search is automatically configured. When you build the site (`npm run build`), Pagefind indexes all content.

### Comments (Giscus)

1. Enable GitHub Discussions in your repository:
   - Go to Settings > General > Features > Enable Discussions

2. Install the Giscus app:
   - Visit https://github.com/apps/giscus
   - Install for your repository

3. Configure Giscus:
   - Visit https://giscus.app/
   - Enter your repository
   - Copy the configuration values

4. Update `src/components/Comments.astro`:
   - Replace `YOUR_USERNAME/YOUR_REPO` with your repo
   - Add `data-repo-id` and `data-category-id` from giscus.app

### RSS Feed

RSS feed is automatically generated at `/rss.xml`. Customize in `src/pages/rss.xml.js`.

### Tags

- All tags page: `/tags`
- Posts by tag: `/tags/[tag-name]`

## Deployment to GitHub Pages

### 1. Create a GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to Pages (left sidebar)
3. Under "Build and deployment":
   - Source: GitHub Actions
   - (Do not select a branch)

### 3. Update Configuration

If deploying to `username.github.io`:
```javascript
// astro.config.mjs
site: 'https://username.github.io',
```

If deploying to a project repository (`username.github.io/repo-name`):
```javascript
// astro.config.mjs
site: 'https://username.github.io',
base: '/repo-name',
```

### 4. Deploy

Push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Update content"
git push
```

The GitHub Action will build and deploy your site automatically.

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production (includes search indexing) |
| `npm run preview` | Preview build locally |

## Customization

### Styling

The blog uses minimal styling. Customize styles in:
- Individual component `<style>` blocks
- Global styles in layouts
- CSS variables in `src/styles/global.css` (if created)

### Adding Components

Create new components in `src/components/` and import them as needed.

### SEO & Meta Tags

Edit `src/components/BaseHead.astro` to customize meta tags, OpenGraph data, and more.

## Troubleshooting

### Search not working after deployment

Ensure the build command in `package.json` includes Pagefind:
```json
"build": "astro build && npx pagefind --site dist"
```

### GitHub Pages shows 404

1. Check that GitHub Pages is set to "GitHub Actions" source
2. Verify your `site` and `base` config in `astro.config.mjs`
3. Check the Actions tab for deployment errors

### Comments not loading

1. Verify GitHub Discussions is enabled
2. Check that Giscus app is installed
3. Confirm repository and category IDs in `Comments.astro`

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Pagefind Documentation](https://pagefind.app/)
- [Giscus Documentation](https://giscus.app/)
- [GitHub Pages Documentation](https://docs.github.com/pages)

## License

MIT
