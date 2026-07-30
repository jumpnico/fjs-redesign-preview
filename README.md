# FJS International Website Preview

This folder is a static website prepared for GitHub Pages.

Upload all files and folders in this directory to the root of a GitHub repository, then enable GitHub Pages from `Settings > Pages`.

Recommended GitHub Pages settings:

- Source: Deploy from a branch
- Branch: main
- Folder: /root

The homepage is `index.html`.

## News CMS

The preview includes a Decap CMS admin shell at `/admin/`.

Posts are stored in `data/posts.json`, and uploaded images are stored in `assets/uploads`.

For GitHub Pages, Decap CMS login needs a small GitHub OAuth proxy. After preparing the OAuth proxy, add its URL to `admin/config.yml` as `backend.base_url`.
