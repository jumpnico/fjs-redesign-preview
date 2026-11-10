(() => {
  function localize(lang) {
    const key = lang === 'en' ? 'dhjEn' : 'dhjJa';
    document.querySelectorAll('[data-dhj-ja]').forEach(node => {
      node.textContent = node.dataset[key];
    });
    document.title = lang === 'en'
      ? 'Dou Huang Jin | Organic Yuba & Video Recipes | FJS International'
      : '豆黄金｜有機揚げ湯葉ロール・有機腐竹の食べ方・簡単レシピ | FJSインターナショナル株式会社';
  }
  window.addEventListener('fjs-language-change', event => localize(event.detail.lang));
  localize(document.documentElement.lang);
  // Keep audio from multiple recipe videos from overlapping.
  const videos = [...document.querySelectorAll('.dhj-page video')];
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));
})();
