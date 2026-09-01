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

function renderNewsTitle(value) {
  const title = String(value || "").replace(/^●\s*/, "");
  return `<span class="news-title-dot" aria-hidden="true"></span><span>${escapeHtml(title)}</span>`;
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

function renderCover(post) {
  if (!post.cover) return "";
  return `
    <div class="news-cover">
      <img src="${escapeHtml(post.cover)}" alt="">
    </div>
  `;
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
    <article class="news-card news-card-single">
      ${renderCover(post)}
      <div class="news-card-body">
        <div class="news-meta">
          <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date, lang))}</time>
          <span>${escapeHtml(pick(post.category, lang))}</span>
        </div>
        <h2>${renderNewsTitle(pick(post.title, lang))}</h2>
        <div class="news-full-body">${renderBody(pick(post.body, lang) || pick(post.excerpt, lang))}</div>
      </div>
    </article>
  `).join("");
}

async function renderNews() {
  try {
    await renderNewsList();
  } catch (error) {
    const target = document.querySelector("#news-list");
    if (target) target.innerHTML = `<div class="content-panel"><p>News content could not be loaded.</p></div>`;
  }
}

window.addEventListener("fjs-language-change", renderNews);
renderNews();
