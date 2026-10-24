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
    const disc = document.getElementById('music-disc');
    const display = document.createElement('div');
    display.className = 'music-display';
    disc.before(display);
    display.append(disc);
    const stageCover = document.createElement('img');
    stageCover.className = 'music-stage-cover';
    stageCover.hidden = true;
    stageCover.addEventListener('error', () => { stageCover.hidden = true; display.classList.remove('has-cover'); });
    display.append(stageCover);
    let selected = 0;
    let currentTrack = -1;
    let embedController = null;
    let embedFallback = false;
    let playerOpen = false;
    let pendingPlay = false;
    let isPlaying = false;
    let currentEntity = albums[0] && albums[0].spotifyUrl || '';
    let loadedEntity = '';
    const miniSong = document.getElementById('music-mini-song');
    const miniTime = document.getElementById('music-mini-time');
    const miniFill = document.getElementById('music-mini-fill');
    const miniPlay = document.getElementById('music-mini-play');
    const playerShell = document.createElement('div');
    playerShell.className = 'spotify-shell';
    playerShell.hidden = true;
    document.querySelector('.music-mini-player').after(playerShell);
    const shellHead = document.createElement('div');
    shellHead.className = 'spotify-shell-head';
    const shellLabel = document.createElement('span');
    shellLabel.textContent = 'SPOTIFY 官方试听';
    const closePlayer = document.createElement('button');
    closePlayer.type = 'button';
    closePlayer.textContent = '收起 ×';
    closePlayer.setAttribute('aria-label', '暂停并收起 Spotify 播放器');
    shellHead.append(shellLabel, closePlayer);
    playerShell.append(shellHead);
    const playerHost = document.createElement('div');
    playerHost.className = 'spotify-player';
    playerHost.setAttribute('aria-label', 'Spotify 官方播放器');
    playerShell.append(playerHost);
    const playerHint = document.createElement('p');
    playerHint.className = 'spotify-hint';
    playerHint.textContent = '如未自动播放，请在 Spotify 播放器中点击播放。';
    playerShell.append(playerHint);
    const albumLink = document.createElement('a');
    albumLink.className = 'spotify-album-link';
    albumLink.target = '_blank';
    albumLink.rel = 'noopener noreferrer';
    albumLink.textContent = '在 Spotify 打开整张专辑 ↗';
    playerShell.append(albumLink);
    function formatTime(milliseconds) {
      const seconds = Math.max(0, Math.floor(milliseconds / 1000));
      return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    }
    function setMiniPlaying(playing) {
      isPlaying = playing;
      miniPlay.textContent = playing ? 'Ⅱ' : '▶';
      miniPlay.setAttribute('aria-label', playing ? '暂停试听' : '播放试听');
    }
    function closeSpotifyPlayer() {
      if (embedController) embedController.pause();
      playerOpen = false;
      pendingPlay = false;
      playerShell.hidden = true;
      setMiniPlaying(false);
    }
    closePlayer.addEventListener('click', closeSpotifyPlayer);
    function albumEntity(album) { return album.spotifyUrl || ''; }
    function showFallback() {
      embedFallback = true;
      playerHost.replaceChildren();
      if (!currentEntity) return;
      const frame = document.createElement('iframe');
      frame.title = 'Spotify 官方试听播放器';
      frame.src = currentEntity.replace('open.spotify.com/', 'open.spotify.com/embed/');
      frame.loading = 'lazy';
      frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      frame.setAttribute('allowfullscreen', '');
      playerHost.append(frame);
      loadedEntity = currentEntity;
    }
    function loadEntity(url, autoPlay = false) {
      currentEntity = url;
      if (!url) {
        closeSpotifyPlayer();
        if (embedFallback) playerHost.replaceChildren();
        loadedEntity = '';
        return;
      }
      if (embedController && url !== loadedEntity) {
        embedController.loadEntity(url);
        loadedEntity = url;
      } else if (embedFallback && url !== loadedEntity) showFallback();
      if (autoPlay) {
        pendingPlay = true;
        playerOpen = true;
        playerShell.hidden = false;
        if (embedController) embedController.play();
      }
    }
    window.onSpotifyIframeApiReady = IFrameAPI => {
      if (!playerHost.isConnected) return;
      embedFallback = false;
      playerHost.replaceChildren();
      const initialEntity = currentEntity || albumEntity(albums[0]);
      const embedMount = document.createElement('div');
      playerHost.append(embedMount);
      const panelWidth = document.querySelector('.music-disc-panel').clientWidth - 56;
      IFrameAPI.createController(embedMount, { url: initialEntity, width: Math.min(370, panelWidth || 370), height: 80 }, controller => {
        embedController = controller;
        loadedEntity = initialEntity;
        if (currentEntity && currentEntity !== initialEntity) loadEntity(currentEntity);
        controller.addListener('ready', () => {
          if (playerOpen && pendingPlay) controller.play();
        });
        controller.addListener('playback_started', () => {
          pendingPlay = false;
          setMiniPlaying(true);
        });
        controller.addListener('playback_update', event => {
          const state = event.data;
          if (!state) return;
          if (state.duration > 0) {
            miniTime.textContent = formatTime(state.position) + ' / ' + formatTime(state.duration);
            miniFill.style.width = Math.min(100, state.position / state.duration * 100) + '%';
          }
          setMiniPlaying(!state.isPaused);
        });
        if (playerOpen && pendingPlay) controller.play();
      });
    };
    const spotifyScript = document.createElement('script');
    spotifyScript.src = 'https://open.spotify.com/embed/iframe-api/v1';
    spotifyScript.async = true;
    spotifyScript.onerror = showFallback;
    document.head.append(spotifyScript);
    setTimeout(() => { if (!embedController && !embedFallback) showFallback(); }, 7000);
    document.getElementById('album-count').textContent = String(albums.length).padStart(2, '0') + ' RECORDS';
    function renderDetail() {
      const album = albums[selected];
      if (!album) return;
      document.getElementById('music-now-title').textContent = album.title;
      document.getElementById('music-now-artist').textContent = album.artist;
      disc.style.background = 'repeating-radial-gradient(circle,' + album.colors[0] + ' 0 2px,' + album.colors[1] + ' 3px 4px,' + album.colors[0] + ' 5px 8px)';
      display.style.setProperty('--album-glow', album.colors[0]);
      display.classList.toggle('has-cover', Boolean(album.cover));
      stageCover.hidden = !album.cover;
      if (album.cover) {
        stageCover.alt = album.title + '专辑封面';
        stageCover.src = album.cover;
      }
      content.innerHTML = '';
      const inner = document.createElement('div');
      inner.className = 'music-detail-inner';
      const title = document.createElement('h3');
      title.textContent = 'Tracklist';
      inner.append(title);
      if (!album.tracks.length) {
        const description = document.createElement('p');
        description.textContent = '这张专辑的曲目还在整理中。';
        inner.append(description);
      } else {
        const count = document.createElement('p');
        count.className = 'music-track-count';
        count.textContent = String(album.tracks.length).padStart(2, '0') + ' SONGS · 2017';
        inner.append(count);
        const list = document.createElement('ol');
        list.className = 'music-tracklist';
        album.tracks.forEach((track, index) => {
          const item = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'music-track' + (index === currentTrack ? ' active' : '');
          button.setAttribute('aria-label', '选择第' + (index + 1) + '首 ' + track.title);
          const number = document.createElement('span');
          number.textContent = String(index + 1).padStart(2, '0');
          const copy = document.createElement('span');
          copy.className = 'music-track-copy';
          const name = document.createElement('strong');
          name.textContent = track.title;
          const credit = document.createElement('small');
          credit.textContent = track.lyricist && track.composer
            ? '作词 ' + track.lyricist + '  ·  作曲 ' + track.composer
            : album.artist;
          copy.append(name, credit);
          const duration = document.createElement('span');
          duration.textContent = track.duration;
          button.append(number, copy, duration);
          button.addEventListener('click', () => selectTrack(index));
          item.append(button);
          list.append(item);
        });
        inner.append(list);
      }
      content.append(inner);
      albumLink.href = album.spotifyUrl || '#';
      miniPlay.disabled = !album.tracks.length;
      if (currentTrack < 0) {
        miniSong.textContent = album.tracks.length ? '选择右侧曲目' : '试听待添加';
        miniTime.textContent = '0:00 / --:--';
        miniFill.style.width = '0%';
      }
      loadEntity(currentTrack >= 0 && album.tracks[currentTrack]
        ? 'https://open.spotify.com/track/' + album.tracks[currentTrack].spotifyId
        : albumEntity(album));
      wall.querySelectorAll('.music-album').forEach((button, index) => button.classList.toggle('selected', index === selected));
    }
    function selectTrack(index) {
      const track = albums[selected] && albums[selected].tracks[index];
      if (!track) return;
      currentTrack = index;
      miniSong.textContent = track.title;
      miniTime.textContent = '0:00 / ' + track.duration;
      miniFill.style.width = '0%';
      setMiniPlaying(false);
      loadEntity('https://open.spotify.com/track/' + track.spotifyId, true);
      renderDetail();
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
      if (album.cover) {
        const cover = document.createElement('img');
        cover.alt = album.title + '专辑封面';
        cover.loading = 'lazy';
        cover.decoding = 'async';
        cover.addEventListener('error', () => { cover.remove(); art.classList.remove('has-cover'); });
        cover.src = album.cover;
        art.classList.add('has-cover');
        art.append(cover);
      }
      const artTitle = document.createElement('span');
      artTitle.textContent = album.title;
      art.append(artTitle);
      const title = document.createElement('strong');
      title.textContent = album.title;
      const artist = document.createElement('small');
      artist.textContent = album.artist;
      button.append(art, title, artist);
      button.addEventListener('click', () => { closeSpotifyPlayer(); selected = index; currentTrack = -1; renderDetail(); document.querySelector('.music-stage').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      wall.append(button);
    });
    document.getElementById('music-prev').addEventListener('click', () => { closeSpotifyPlayer(); selected = (selected - 1 + albums.length) % albums.length; currentTrack = -1; renderDetail(); });
    document.getElementById('music-next').addEventListener('click', () => { closeSpotifyPlayer(); selected = (selected + 1) % albums.length; currentTrack = -1; renderDetail(); });
    miniPlay.addEventListener('click', () => {
      if (currentTrack < 0) { selectTrack(0); return; }
      playerOpen = true;
      playerShell.hidden = false;
      if (embedController) {
        if (isPlaying) embedController.pause();
        else embedController.play();
      } else pendingPlay = true;
    });
    renderDetail();
  }
})();
