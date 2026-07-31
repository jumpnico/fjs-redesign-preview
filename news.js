let postsCache = [];

function currentLang() {
  return localStorage.getItem("fjs-lang") || document.documentElement.lang || "ja";
}

function pick(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value.trim() ? value : "";

  const localized = value[lang];
  if (typeof localized === "string" && localized.trim()) return localized;
  if (localized) return localized;

  const japanese = value.ja;
  if (typeof japanese === "string" && japanese.trim()) return japanese;
  if (japanese) return japanese;

  const english = value.en;
  if (typeof english === "string" && english.trim()) return english;
  return english || "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value, lang) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function renderBody(text) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

async function loadPosts() {
  if (postsCache.length) return postsCache;
  const response = await fetch("data/posts.json", { cache: "no-store" });
  const data = await response.json();
  postsCache = (data.posts || [])
    .filter((post) => post.status !== "draft")
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return postsCache;
}

async function renderNewsList() {
  const container = document.querySelector("#news-list");
  if (!container) return;
  const lang = currentLang();
  const posts = await loadPosts();

  if (!posts.length) {
    container.innerHTML = `<div class="content-panel"><p>${lang === "ja" ? "現在、お知らせはありません。" : "No news posts are available."}</p></div>`;
    return;
  }

  container.innerHTML = posts.map((post) => `
    <article class="news-card">
      <a class="news-cover" href="post.html?id=${encodeURIComponent(post.id)}" aria-label="${escapeHtml(pick(post.title, lang))}">
        <img src="${escapeHtml(post.cover || "assets/home-hero-lifestyle.png")}" alt="">
      </a>
      <div class="news-card-body">
        <div class="news-meta">
          <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date, lang))}</time>
          <span>${escapeHtml(pick(post.category, lang))}</span>
        </div>
        <h2><a href="post.html?id=${encodeURIComponent(post.id)}">${escapeHtml(pick(post.title, lang))}</a></h2>
        <p>${escapeHtml(pick(post.excerpt, lang))}</p>
      </div>
    </article>
  `).join("");
}

async function renderPostDetail() {
  const container = document.querySelector("#post-detail");
  if (!container) return;
  const lang = currentLang();
  const id = new URLSearchParams(window.location.search).get("id");
  const posts = await loadPosts();
  const post = posts.find((entry) => entry.id === id) || posts[0];

  if (!post) {
    container.innerHTML = `<div class="content-panel"><p>${lang === "ja" ? "記事が見つかりません。" : "Post not found."}</p></div>`;
    return;
  }

  document.title = `${pick(post.title, lang)} | FJSインターナショナル株式会社`;
  container.innerHTML = `
    <a class="back-link" href="news.html">${lang === "ja" ? "お知らせ一覧へ" : "Back to News"}</a>
    <div class="post-hero-card">
      <div class="news-meta">
        <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date, lang))}</time>
        <span>${escapeHtml(pick(post.category, lang))}</span>
      </div>
      <h1>${escapeHtml(pick(post.title, lang))}</h1>
      <p>${escapeHtml(pick(post.excerpt, lang))}</p>
    </div>
    <img class="post-cover" src="${escapeHtml(post.cover || "assets/home-hero-lifestyle.png")}" alt="">
    <div class="post-body">${renderBody(pick(post.body, lang))}</div>
  `;
}

async function renderNews() {
  try {
    await Promise.all([renderNewsList(), renderPostDetail()]);
  } catch (error) {
    const target = document.querySelector("#news-list, #post-detail");
    if (target) target.innerHTML = `<div class="content-panel"><p>News content could not be loaded.</p></div>`;
  }
}

window.addEventListener("fjs-language-change", renderNews);
renderNews();
