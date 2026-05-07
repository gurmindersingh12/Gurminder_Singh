# Gurminder Singh — Modern Research Portfolio

A refreshed static portfolio for GitHub Pages. The redesign removes Bootstrap/jQuery, uses modern responsive CSS, and keeps publications/conference data in `data.js` so future updates are simple.

## What changed

- Modern dark/light portfolio UI with glass cards, bento research grid, sticky navigation, and mobile menu.
- Searchable and filterable publications and conferences.
- Native, accessible dialogs for abstracts and citing papers.
- Automatically generated stats and citation snapshot from `data.js`.
- Optimized image assets in `assets/` with WebP versions.
- Improved SEO/meta tags, keyboard focus states, reduced-motion support, and no external CSS/JS dependencies.

## How to update content

Most research content lives in `data.js`:

- Add or edit publications in the `publications` array.
- Add or edit presentations in the `conferences` array.
- Keep `year`, `title`, `authors`, `journal` or `conference`, `abstract`, `url`, and `citations` updated.

Personal/profile sections are in `index.html` under the About, Research, Awards, and Contact sections.

## How to deploy on GitHub Pages

1. Upload these files to your repository.
2. In GitHub, go to **Settings → Pages**.
3. Select the branch that contains `index.html` and save.
4. Visit the generated GitHub Pages URL.

No build step is required.
