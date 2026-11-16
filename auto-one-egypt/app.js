(() => {
  const STORAGE_KEY = 'auto-one-egypt-store-prototype-v1';
  const platforms = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'x', label: 'X' },
    { id: 'snapchat', label: 'Snapchat' },
    { id: 'threads', label: 'Threads' },
    { id: 'pinterest', label: 'Pinterest' },
  ];
  const defaultCars = [
    { id: 'tucson-nx4-turbo', name: 'Hyundai Tucson NX4 Turbo' },
    { id: 'corolla-gr-sport', name: 'Toyota Corolla GR Sport' },
    { id: 'lexus-nx-350-f-sport', name: 'Lexus NX 350 F-Sport' },
  ];

  const blankLinks = () => Object.fromEntries(platforms.map(({ id }) => [id, { url: '', visible: false }]));
  const blankCar = (car) => ({ ...car, links: blankLinks(), slides: [] });
  const defaultState = () => ({
    main: blankLinks(),
    cars: defaultCars.map(blankCar),
    customPlatforms: [],
  });

  function readState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const oldSaved = localStorage.getItem('auto-one-egypt-social-prototype-v1');
        if (!oldSaved) return defaultState();
        return migrateState(JSON.parse(oldSaved));
      }
      const parsed = JSON.parse(saved);
      return normalizeState(parsed);
    } catch (error) {
      console.error('Unable to read saved prototype data.', error);
      return defaultState();
    }
  }

  function migrateState(parsed) {
    const state = defaultState();
    state.main = { ...state.main, ...(parsed.main || {}) };
    state.customPlatforms = Array.isArray(parsed.customPlatforms) ? parsed.customPlatforms : [];
    state.cars = state.cars.map((car) => ({
      ...car,
      links: { ...car.links, ...(parsed.cars?.[car.id] || {}) },
    }));
    return state;
  }

  function normalizeState(parsed) {
    const state = defaultState();
    state.main = { ...state.main, ...(parsed.main || {}) };
    state.customPlatforms = Array.isArray(parsed.customPlatforms) ? parsed.customPlatforms : [];
    if (Array.isArray(parsed.cars)) {
      state.cars = parsed.cars
        .filter((car) => car && typeof car.id === 'string' && typeof car.name === 'string')
        .map((car) => ({
          id: car.id,
          name: car.name,
          links: { ...blankLinks(), ...(car.links || {}) },
          slides: Array.isArray(car.slides) ? car.slides.filter((slide) => slide && typeof slide.url === 'string') : [],
        }));
    } else {
      state.cars = state.cars.map((car) => ({
        ...car,
        links: { ...car.links, ...(parsed.cars?.[car.id] || {}) },
      }));
    }
    return state;
  }

  let state = readState();
  let activeScope = 'main';
  let activeCar = state.cars[0]?.id || null;
  const mainEditor = document.querySelector('#main-editor');
  const carEditor = document.querySelector('#car-editor');
  const mainPreview = document.querySelector('#main-preview');
  const carPreview = document.querySelector('#car-preview');
  const previewCarSelect = document.querySelector('#preview-car');
  const editCarSelect = document.querySelector('#edit-car');
  const manageCarSelect = document.querySelector('#manage-car');
  const saveStatus = document.querySelector('#save-status');

  function currentCar() {
    return state.cars.find((car) => car.id === activeCar) || null;
  }

  function allPlatforms() {
    return [...platforms, ...state.customPlatforms];
  }

  function safeHttpUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch {
      return '';
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      saveStatus.textContent = 'Saved in this browser only. Not published to autonegypt.com.';
    } catch (error) {
      console.error('Unable to save prototype data.', error);
      saveStatus.textContent = 'Could not save in this browser. Check storage availability and try again.';
    }
    renderCarSelectors();
    renderCarManager();
    renderEditor();
    renderPreviews();
  }

  function scopeLinks(scope) {
    return scope === 'main' ? state.main : currentCar()?.links || {};
  }

  function makeLinkRow(platform, links) {
    const value = links[platform.id] || { url: '', visible: false };
    const row = document.createElement('div');
    row.className = 'link-row';

    const meta = document.createElement('div');
    meta.className = 'link-meta';
    const title = document.createElement('strong');
    title.textContent = platform.label;
    const hint = document.createElement('small');
    hint.textContent = 'Add a public profile or contact URL';
    meta.append(title, hint);

    const form = document.createElement('div');
    form.className = 'form-row';
    const input = document.createElement('input');
    input.type = 'url';
    input.placeholder = 'https://…';
    input.value = value.url || '';
    input.setAttribute('aria-label', `${platform.label} URL`);
    input.autocomplete = 'url';
    input.addEventListener('change', () => {
      const url = safeHttpUrl(input.value.trim());
      if (input.value.trim() && !url) {
        saveStatus.textContent = 'Social links must be absolute HTTP or HTTPS URLs.';
        input.focus();
        return;
      }
      links[platform.id] = { ...value, url };
      save();
    });

    const label = document.createElement('label');
    label.className = 'visibility';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = Boolean(value.visible);
    toggle.addEventListener('change', () => {
      const url = safeHttpUrl(input.value.trim());
      if (toggle.checked && !url) {
        saveStatus.textContent = 'Enter a valid HTTP or HTTPS URL before showing this link.';
        toggle.checked = false;
        input.focus();
        return;
      }
      links[platform.id] = { ...value, url, visible: toggle.checked };
      save();
    });
    label.append(toggle, document.createTextNode('Show on page'));
    form.append(input, label);
    row.append(meta, form);
    return row;
  }

  function renderEditor() {
    const root = activeScope === 'main' ? mainEditor : carEditor;
    root.replaceChildren();
    const links = scopeLinks(activeScope);
    allPlatforms().forEach((platform) => root.append(makeLinkRow(platform, links)));

    const add = document.createElement('form');
    add.className = 'add-platform';
    const heading = document.createElement('strong');
    heading.textContent = 'Add another platform';
    const formRow = document.createElement('div');
    formRow.className = 'form-row';
    const name = document.createElement('input');
    name.type = 'text';
    name.placeholder = 'Platform name';
    name.maxLength = 40;
    name.required = true;
    name.setAttribute('aria-label', 'New platform name');
    const url = document.createElement('input');
    url.type = 'url';
    url.placeholder = 'https://…';
    url.setAttribute('aria-label', 'New platform URL');
    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add platform';
    formRow.append(name, url, addButton);
    add.append(heading, formRow);
    add.addEventListener('submit', (event) => {
      event.preventDefault();
      const label = name.value.trim();
      if (!label) return;
      const platformUrl = safeHttpUrl(url.value.trim());
      if (url.value.trim() && !platformUrl) {
        saveStatus.textContent = 'Social links must be absolute HTTP or HTTPS URLs.';
        url.focus();
        return;
      }
      const id = `custom-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
      state.customPlatforms.push({ id, label });
      links[id] = { url: platformUrl, visible: false };
      save();
    });
    root.append(add);
  }

  function createSlidePreview(slide) {
    const card = document.createElement('article');
    card.className = 'slide-card';
    const url = document.createElement('a');
    url.className = 'slide-visual';
    url.href = slide.url;
    url.target = '_blank';
    url.rel = 'noopener noreferrer';
    if (slide.kind === 'image') {
      const image = document.createElement('img');
      image.src = slide.url;
      image.alt = slide.caption || 'Car slide';
      image.loading = 'lazy';
      url.append(image);
    } else {
      url.textContent = 'Open video';
    }
    const caption = document.createElement('p');
    caption.textContent = slide.caption || (slide.kind === 'image' ? 'Vehicle photo' : 'Vehicle video');
    card.append(url, caption);
    return card;
  }

  function renderSlidePreview() {
    const target = document.querySelector('#car-slides-preview');
    const car = state.cars.find(({ id }) => id === previewCarSelect.value);
    target.replaceChildren();
    const slides = (car?.slides || []).filter((slide) => slide.visible !== false);
    if (!slides.length) {
      const message = document.createElement('p');
      message.className = 'empty';
      message.textContent = 'No visible car slides configured.';
      target.append(message);
      return;
    }
    slides.forEach((slide) => target.append(createSlidePreview(slide)));
  }

  function renderCarSelectors() {
    [previewCarSelect, editCarSelect, manageCarSelect].forEach((select) => {
      const selected = select.value || activeCar || '';
      select.replaceChildren();
      state.cars.forEach((car) => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = car.name;
        select.append(option);
      });
      if (state.cars.some((car) => car.id === selected)) select.value = selected;
    });
    activeCar = state.cars.some((car) => car.id === activeCar) ? activeCar : (state.cars[0]?.id || null);
    if (activeCar) {
      editCarSelect.value = activeCar;
      manageCarSelect.value = activeCar;
    }
    const hasCars = state.cars.length > 0;
    editCarSelect.disabled = !hasCars;
    manageCarSelect.disabled = !hasCars;
    document.querySelector('#car-form').hidden = !hasCars;
    document.querySelector('#new-slide-form').hidden = !hasCars;
  }

  function renderCarManager() {
    const car = currentCar();
    document.querySelector('#car-name').value = car?.name || '';
    document.querySelector('#delete-car').disabled = !car;
    const list = document.querySelector('#slides-list');
    list.replaceChildren();
    if (!car) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Add a car to manage its slides.';
      list.append(empty);
      return;
    }
    if (!car.slides.length) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'This car has no slides yet. Add an image or video URL below.';
      list.append(empty);
      return;
    }
    car.slides.forEach((slide, index) => {
      const row = document.createElement('div');
      row.className = 'managed-slide';
      row.append(createSlidePreview(slide));
      const details = document.createElement('div');
      details.className = 'slide-details';
      const urlText = document.createElement('a');
      urlText.href = slide.url;
      urlText.target = '_blank';
      urlText.rel = 'noopener noreferrer';
      urlText.textContent = slide.url;
      urlText.className = 'url-overflow';
      const visibility = document.createElement('label');
      visibility.className = 'visibility';
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = slide.visible !== false;
      toggle.addEventListener('change', () => {
        slide.visible = toggle.checked;
        save();
      });
      visibility.append(toggle, document.createTextNode('Show slide'));
      details.append(urlText, visibility);
      const controls = document.createElement('div');
      controls.className = 'slide-actions';
      const up = makeActionButton('Move up', '▲', () => moveSlide(index, -1), index === 0);
      const down = makeActionButton('Move down', '▼', () => moveSlide(index, 1), index === car.slides.length - 1);
      const remove = makeActionButton('Remove slide', 'Remove', () => {
        if (!window.confirm('Remove this slide from the local prototype?')) return;
        car.slides.splice(index, 1);
        save();
      }, false, 'danger-button');
      controls.append(up, down, remove);
      row.append(details, controls);
      list.append(row);
    });
  }

  function makeActionButton(label, text, action, disabled = false, className = 'action-button') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.setAttribute('aria-label', label);
    button.disabled = disabled;
    button.addEventListener('click', action);
    return button;
  }

  function moveSlide(index, direction) {
    const car = currentCar();
    const target = index + direction;
    if (!car || target < 0 || target >= car.slides.length) return;
    [car.slides[index], car.slides[target]] = [car.slides[target], car.slides[index]];
    save();
  }

  function renderOnePreview(target, links) {
    target.replaceChildren();
    const visible = allPlatforms()
      .filter(({ id }) => links[id]?.visible && safeHttpUrl(links[id]?.url))
      .map(({ id, label }) => ({ id, label, url: safeHttpUrl(links[id].url) }));
    if (!visible.length) {
      const message = document.createElement('span');
      message.className = 'empty';
      message.textContent = 'No visible social links configured.';
      target.append(message);
      return;
    }
    visible.forEach(({ label, url }) => {
      const anchor = document.createElement('a');
      anchor.className = 'social-link';
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = label;
      target.append(anchor);
    });
  }

  function renderPreviews() {
    renderOnePreview(mainPreview, state.main);
    const car = state.cars.find(({ id }) => id === previewCarSelect.value);
    renderOnePreview(carPreview, car?.links || {});
    document.querySelector('#car-preview-title').textContent =
      car?.name || 'Car';
    renderSlidePreview();
  }

  renderCarSelectors();
  previewCarSelect.addEventListener('change', renderPreviews);
  editCarSelect.addEventListener('change', () => {
    activeCar = editCarSelect.value;
    renderEditor();
  });
  manageCarSelect.addEventListener('change', () => {
    activeCar = manageCarSelect.value;
    renderCarManager();
    renderEditor();
  });

  document.querySelector('#car-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const car = currentCar();
    const name = document.querySelector('#car-name').value.trim();
    if (!car || !name) return;
    car.name = name;
    save();
  });

  document.querySelector('#new-car-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.querySelector('#new-car-name');
    const name = nameInput.value.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'car'}-${Date.now()}`;
    state.cars.push({ id, name, links: blankLinks(), slides: [] });
    activeCar = id;
    nameInput.value = '';
    save();
    manageCarSelect.value = id;
    editCarSelect.value = id;
    previewCarSelect.value = id;
    renderPreviews();
  });

  document.querySelector('#delete-car').addEventListener('click', () => {
    const car = currentCar();
    if (!car || !window.confirm(`Delete ${car.name} and its local slides and social links?`)) return;
    state.cars = state.cars.filter(({ id }) => id !== car.id);
    activeCar = state.cars[0]?.id || null;
    save();
  });

  document.querySelector('#new-slide-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const car = currentCar();
    const urlInput = document.querySelector('#new-slide-url');
    const captionInput = document.querySelector('#new-slide-caption');
    const url = urlInput.value.trim();
    if (!car || !url) return;
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      saveStatus.textContent = 'Enter a valid absolute URL for the image or video.';
      return;
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      saveStatus.textContent = 'Slide URLs must use HTTP or HTTPS.';
      return;
    }
    const isVideo = /\.(mp4|webm|mov)(?:$|[?#])/i.test(parsed.href) || /youtube\.com|youtu\.be|vimeo\.com/i.test(parsed.hostname);
    car.slides.push({
      id: `slide-${Date.now()}`,
      url: parsed.href,
      caption: captionInput.value.trim(),
      kind: isVideo ? 'video' : 'image',
      visible: true,
    });
    urlInput.value = '';
    captionInput.value = '';
    save();
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeScope = tab.dataset.scope;
      document.querySelectorAll('.tab').forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      document.querySelector('#cars-panel').hidden = activeScope !== 'cars';
      document.querySelector('#main-panel').hidden = activeScope !== 'main';
      document.querySelector('#car-panel').hidden = activeScope !== 'car';
      if (activeScope === 'cars') renderCarManager();
      else renderEditor();
    });
  });

  renderEditor();
  renderCarManager();
  renderPreviews();
})();
