// Dynamic content renderer: loads JSON data and renders projects / blog cards
const Render = {
  async load(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
  },

  renderProjects(projects, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = projects
      .map(
        (p, i) => `
        <div class="project-card fade-up" style="transition-delay:${i * 0.1}s">
          <div class="project-tag">${p.tag}</div>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">查看详情 →</a>` : ''}
        </div>`
      )
      .join('');
    ScrollAnim.init(); // re-bind for new elements
  },

  renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = posts
      .map(
        (p, i) => `
        <div class="post-card fade-up" style="transition-delay:${i * 0.1}s">
          <span class="post-date">${p.date}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          ${p.tags ? `<div class="post-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </div>`
      )
      .join('');
    ScrollAnim.init();
  }
};
