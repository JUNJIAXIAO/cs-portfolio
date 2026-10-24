(() => {
  const page = document.body.dataset.page;
  const toastEl = document.getElementById('toast');
  let toastTimer;
  const toast = message => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3000);
  };
  document.querySelectorAll('[data-top]').forEach(button => button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })));
  document.querySelectorAll('[data-theme]').forEach(button => button.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    button.textContent = document.body.classList.contains('dark') ? '☼' : '☾';
  }));

  if (page === 'pub') {
    document.querySelectorAll('[data-pub-filter]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-pub-filter]').forEach(item => item.classList.toggle('active', item === button));
      toast('该分类暂无已发表内容；目前只展示版式。');
    }));
  }

  if (page === 'cv') {
    document.querySelectorAll('[data-cv-tab]').forEach(button => button.addEventListener('click', () => {
      const resume = button.dataset.cvTab === 'resume';
      document.getElementById('cv-resume').hidden = !resume;
      document.getElementById('cv-updates').hidden = resume;
      document.querySelectorAll('[data-cv-tab]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
    }));
  }

  if (page === 'photo') {
    const highResOnly = Boolean(window.PHOTO_HIGH_RES_ONLY);
    const categories = window.PHOTO_CATEGORIES || [];
    const all = window.PHOTO_ITEMS || [];
    const albumRoot = document.getElementById('photo-albums');
    const gallerySection = document.getElementById('photo-gallery');
    const galleryRoot = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('photo-lightbox');
    let currentList = [];
    let rendered = 0;
    let activeIndex = 0;
    const chunk = 20;

    function showLightbox(index) {
      activeIndex = (index + currentList.length) % currentList.length;
      const item = currentList[activeIndex];
      const image = document.getElementById('lightbox-image');
      image.src = item.display || item.src;
      image.alt = item.alt || item.title;
      document.getElementById('lightbox-count').textContent = String(activeIndex + 1).padStart(2, '0') + ' / ' + String(currentList.length).padStart(2, '0');
      const original = document.getElementById('lightbox-original');
      original.href = highResOnly ? (item.display || item.src) : (item.original || item.display || item.src);
      original.textContent = highResOnly ? '查看高清图 ↗' : '查看原图 ↗';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }
    function renderMore() {
      const end = Math.min(rendered + chunk, currentList.length);
      for (let index = rendered; index < end; index++) {
        const item = currentList[index];
        const button = document.createElement('button');
        button.className = 'gallery-tile';
        button.type = 'button';
        button.setAttribute('aria-label', '打开' + item.title);
        const image = document.createElement('img');
        image.src = item.src;
        image.alt = item.alt || item.title;
        image.loading = 'lazy';
        button.append(image);
        button.addEventListener('click', () => showLightbox(index));
        galleryRoot.append(button);
      }
      rendered = end;
      document.getElementById('gallery-more').hidden = rendered >= currentList.length;
    }
    function openCategory(category) {
      currentList = all.filter(item => item.category === category.id);
      rendered = 0;
      galleryRoot.innerHTML = '';
      document.getElementById('gallery-title').textContent = category.label;
      document.getElementById('gallery-count').textContent = currentList.length + ' 张照片 · 点击照片可放大，查看' + (highResOnly ? '高清图' : '原图');
      gallerySection.hidden = false;
      renderMore();
      gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    categories.forEach(category => {
      const items = all.filter(item => item.category === category.id);
      if (!items.length) return;
      const button = document.createElement('button');
      button.className = 'photo-album';
      button.type = 'button';
      const stack = document.createElement('span');
      stack.className = 'album-stack';
      const image = document.createElement('img');
      image.src = items[0].src;
      image.alt = category.label + '相册封面';
      stack.append(image);
      const title = document.createElement('span');
      title.className = 'album-title';
      title.textContent = category.label;
      const subtitle = document.createElement('span');
      subtitle.className = 'album-sub';
      subtitle.textContent = items.length + ' 张照片 · CLICK TO OPEN';
      button.append(stack, title, subtitle);
      button.addEventListener('click', () => openCategory(category));
      albumRoot.append(button);
    });
    document.getElementById('photo-back').addEventListener('click', () => { gallerySection.hidden = true; albumRoot.scrollIntoView({ behavior: 'smooth' }); });
    document.getElementById('gallery-more').addEventListener('click', renderMore);
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('photo-prev').addEventListener('click', () => showLightbox(activeIndex - 1));
    document.getElementById('photo-next').addEventListener('click', () => showLightbox(activeIndex + 1));
    lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', event => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showLightbox(activeIndex - 1);
      if (event.key === 'ArrowRight') showLightbox(activeIndex + 1);
    });
  }

  if (page === 'music') {
    const albums = window.MUSIC_ALBUMS || [];
    const wall = document.getElementById('music-wall');
    const content = document.getElementById('music-info-content');
    let selected = -1;
    let tab = 'about';
    document.getElementById('album-count').textContent = String(albums.length).padStart(2, '0') + ' RECORDS';
    function renderDetail() {
      const album = albums[selected];
      if (!album) return;
      document.getElementById('music-now-title').textContent = album.title;
      document.getElementById('music-now-artist').textContent = album.artist;
      const disc = document.getElementById('music-disc');
      disc.style.background = 'repeating-radial-gradient(circle,' + album.colors[0] + ' 0 2px,' + album.colors[1] + ' 3px 4px,' + album.colors[0] + ' 5px 8px)';
      content.innerHTML = '';
      const inner = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = tab === 'about' ? album.title : 'Tracklist';
      const description = document.createElement('p');
      description.textContent = tab === 'about' ? album.note : (album.tracks && album.tracks.length ? album.tracks.join(' · ') : '曲目待整理；确定最终专辑名单后再填写。');
      inner.append(title, description);
      content.append(inner);
      wall.querySelectorAll('.music-album').forEach((button, index) => button.classList.toggle('selected', index === selected));
    }
    albums.forEach((album, index) => {
      const button = document.createElement('button');
      button.className = 'music-album';
      button.type = 'button';
      button.setAttribute('aria-label', '查看专辑' + album.title);
      const art = document.createElement('div');
      art.className = 'music-art';
      art.style.setProperty('--c1', album.colors[0]);
      art.style.setProperty('--c2', album.colors[1]);
      const artTitle = document.createElement('span');
      artTitle.textContent = album.title;
      art.append(artTitle);
      const title = document.createElement('strong');
      title.textContent = album.title;
      const artist = document.createElement('small');
      artist.textContent = album.artist;
      button.append(art, title, artist);
      button.addEventListener('click', () => { selected = index; renderDetail(); document.querySelector('.music-stage').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      wall.append(button);
    });
    document.querySelectorAll('[data-music-tab]').forEach(button => button.addEventListener('click', () => {
      tab = button.dataset.musicTab;
      document.querySelectorAll('[data-music-tab]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      renderDetail();
    }));
    document.getElementById('music-prev').addEventListener('click', () => { selected = (selected - 1 + albums.length) % albums.length; renderDetail(); });
    document.getElementById('music-next').addEventListener('click', () => { selected = (selected + 1) % albums.length; renderDetail(); });
    document.getElementById('music-play').addEventListener('click', () => toast('尚未接入音源。公开网站建议使用正版平台官方嵌入播放器。'));
  }
})();
