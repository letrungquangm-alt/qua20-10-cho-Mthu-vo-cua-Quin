// Wall Photo Gallery & Direction Manager (Quin & MThư)
// Cho phép quản lý tất cả các hướng và gắn bất kỳ ảnh nào vào khung trên tường
// Hỗ trợ nhấp trực tiếp vào khung hoặc bấm nút trên Header.

export const WALL_FRAMES = [
  {
    key: 'painting_couple',
    id: 'khung_1_ngoai_cung_trai',
    name: 'Khung 1',
    label: 'Khung 1 (Ngoài cùng trái)',
    icon: '🖼️',
    title: 'Ảnh Kỷ Niệm Quin & Minh Thư'
  },
  {
    key: 'painting_frame2',
    id: 'khung_2_tren_trai',
    name: 'Khung 2',
    label: 'Khung 2 (Trên bên trái)',
    icon: '🛗',
    title: 'Ảnh Selfie Thang Máy'
  },
  {
    key: 'painting_stars',
    id: 'khung_3_giua_tren',
    name: 'Khung 3',
    label: 'Khung 3 (Giữa trên)',
    icon: '⭐',
    title: 'Ảnh Kỷ Niệm / Đêm Đầy Sao'
  },
  {
    key: 'painting_gau',
    id: 'khung_4_giua_duoi',
    name: 'Khung 4',
    label: 'Khung 4 (Giữa dưới)',
    icon: '🐶',
    title: 'Chân Dung Bé Gấu Cưng'
  },
  {
    key: 'painting_clue',
    id: 'khung_5_tuong_phai',
    name: 'Khung 5',
    label: 'Khung 5 (Tường phải gần rèm)',
    icon: '🌹',
    title: 'Ảnh Mật Mã 27 & 26'
  }
];

export const CORE_PHOTOS = [
  { file: 'anh_1_cun_con_giu_nguyen_anh_goc.png', name: 'Bé Gấu cưng', icon: '🐶', desc: 'Chân dung Bé Gấu lúc nhỏ siêu cưng' },
  { file: 'anh_2_om_guong_giu_nguyen_anh_goc.png', name: 'Ôm gương ngọt ngào', icon: '🪞', desc: 'Quin & MThư ôm nhau trước gương' },
  { file: 'anh_3_selfie_thang_may_giu_nguyen_anh_goc.png', name: 'Selfie thang máy', icon: '🛗', desc: 'Ảnh selfie trong thang máy đáng yêu' },
  { file: 'anh_4_tim_tay_giu_nguyen_anh_goc.png', name: 'Bắn tim tay', icon: '🫶', desc: 'Khoảnh khắc bắn tim tay đôi' },
  { file: 'anh_5_nam_tay_giu_nguyen_anh_goc.png', name: 'Nắm tay dạo phố', icon: '🤝', desc: 'Hai bàn tay đan chặt ấm áp' },
  { file: 'anh_6_call_video_giu_nguyen_anh_goc.png', name: 'Call video đêm muộn', icon: '📱', desc: 'Cuộc gọi video vui vẻ mỗi tối' }
];

export class WallGalleryManager {
  constructor(soundController) {
    this.sound = soundController;
    this.currentFrameKey = 'painting_couple';
    this.currentCategory = '3d_perspective'; // '3d_perspective' | 'highres' | '1x' | 'full'
    this.createModalDOM();
    this.bindEvents();
  }

  createModalDOM() {
    let modal = document.getElementById('modal-wall-photo-picker');
    if (modal) return;

    modal = document.createElement('div');
    modal.id = 'modal-wall-photo-picker';
    modal.className = 'custom-modal-backdrop';
    modal.innerHTML = `
      <div class="custom-modal-window wall-gallery-window">
        <div class="modal-close-x" id="btn-close-wall-gallery" title="Đóng bảng quản lý">✕</div>
        
        <div class="modal-header-ornate">
          <h3 class="modal-title">🖼️ BỘ SƯU TẬP TRANH TREO TƯỜNG (TẤT CẢ CÁC HƯỚNG)</h3>
          <p class="modal-subtitle">Nhấp chọn khung tranh bên dưới, rồi nhấp vào ảnh bất kỳ để gắn ngay vào khung trên tường!</p>
        </div>

        <div class="modal-body wall-gallery-body">
          <!-- 1. THANH CHỌN 5 HƯỚNG KHUNG TRANH -->
          <div class="gallery-frame-tabs" id="gallery-frame-tabs"></div>

          <!-- 2. VÙNG THÔNG TIN KHUNG ĐANG CHỌN -->
          <div class="gallery-selected-summary">
            <div class="current-frame-preview-wrap">
              <img id="gallery-current-img" src="" alt="Ảnh hiện tại">
              <span class="preview-badge" id="gallery-current-badge">Đang treo</span>
            </div>
            <div class="current-frame-meta">
              <h4 id="gallery-frame-title">Khung 1</h4>
              <p id="gallery-frame-desc">Ảnh hiện tại đang được hiển thị trên tường phòng khách.</p>
              <div class="gallery-notice-pill" id="gallery-toast-pill" style="display: none;">✨ Đã gắn ảnh vào khung thành công!</div>
            </div>
          </div>

          <!-- 3. TABS PHÂN LOẠI BỘ ẢNH (HƯỚNG 3D, HIGHRES, 1X, NGUYÊN BẢN, TẢI ẢNH RIÊNG) -->
          <div class="gallery-category-tabs">
            <button class="gallery-cat-btn active" data-cat="3d_perspective">🌟 6 Ảnh Uốn 3D (Chuẩn Phối Cảnh)</button>
            <button class="gallery-cat-btn" data-cat="highres">💎 Bộ Tách Sắc Nét (HighRes)</button>
            <button class="gallery-cat-btn" data-cat="other_sets">🌿 Bộ 1x & Nguyên Bản</button>
            <button class="gallery-cat-btn" data-cat="upload">📤 Tải Lên Ảnh Riêng</button>
          </div>

          <!-- 4. LƯỚI ẢNH ĐỂ CHỌN ("NHẤP VÀO ẢNH ĐỂ GẮN VÔ KHUNG TRÊN") -->
          <div class="gallery-photos-container" id="gallery-photos-container"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  bindEvents() {
    // Nút đóng
    const closeBtn = document.getElementById('btn-close-wall-gallery');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Đóng khi click backdrop ngoài window
    const modal = document.getElementById('modal-wall-photo-picker');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    }

    // Tabs phân loại bộ ảnh
    document.querySelectorAll('.gallery-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-cat');
        this.renderPhotoOptions();
      });
    });

    // Nút mở trên Header
    const openHeaderBtn = document.getElementById('btn-open-wall-gallery');
    if (openHeaderBtn) {
      openHeaderBtn.addEventListener('click', () => {
        this.open(this.currentFrameKey);
      });
    }
  }

  open(frameKey = 'painting_couple') {
    this.currentFrameKey = frameKey;
    const modal = document.getElementById('modal-wall-photo-picker');
    if (!modal) return;

    this.renderFrameTabs();
    this.updateCurrentFrameSummary();
    this.renderPhotoOptions();

    modal.classList.add('active');
    if (this.sound) this.sound.play('click');
  }

  close() {
    const modal = document.getElementById('modal-wall-photo-picker');
    if (modal) modal.classList.remove('active');
  }

  renderFrameTabs() {
    const container = document.getElementById('gallery-frame-tabs');
    if (!container) return;
    container.innerHTML = '';

    WALL_FRAMES.forEach(frame => {
      const tab = document.createElement('button');
      tab.className = `gallery-frame-tab ${frame.key === this.currentFrameKey ? 'active' : ''}`;
      tab.innerHTML = `<span class="tab-icon">${frame.icon}</span> <span class="tab-title">${frame.name}</span>`;
      tab.title = frame.label;
      tab.addEventListener('click', () => {
        this.currentFrameKey = frame.key;
        this.renderFrameTabs();
        this.updateCurrentFrameSummary();
        this.renderPhotoOptions();
        if (this.sound) this.sound.play('click');
      });
      container.appendChild(tab);
    });
  }

  getCurrentFrameMeta() {
    return WALL_FRAMES.find(f => f.key === this.currentFrameKey) || WALL_FRAMES[0];
  }

  getCurrentFrameImgElement() {
    const frameMeta = this.getCurrentFrameMeta();
    const el = document.querySelector(`.hotspot[data-hotspot="${frameMeta.key}"]`);
    return el ? el.querySelector('img') : null;
  }

  updateCurrentFrameSummary() {
    const frameMeta = this.getCurrentFrameMeta();
    const currentImg = this.getCurrentFrameImgElement();
    const previewEl = document.getElementById('gallery-current-img');
    const titleEl = document.getElementById('gallery-frame-title');
    const descEl = document.getElementById('gallery-frame-desc');

    if (currentImg && previewEl) {
      previewEl.src = currentImg.getAttribute('src') || '';
    }
    if (titleEl) {
      titleEl.innerHTML = `${frameMeta.icon} ${frameMeta.label}`;
    }
    if (descEl) {
      descEl.textContent = `Hướng phối cảnh: ${frameMeta.id}. Nhấp vào bất kỳ ảnh nào bên dưới để gắn trực tiếp vào khung này.`;
    }
  }

  renderPhotoOptions() {
    const container = document.getElementById('gallery-photos-container');
    if (!container) return;
    container.innerHTML = '';

    const frameMeta = this.getCurrentFrameMeta();
    const currentImg = this.getCurrentFrameImgElement();
    const currentSrc = currentImg ? currentImg.getAttribute('src') : '';

    if (this.currentCategory === '3d_perspective') {
      // 1. BỘ 6 ẢNH UỐN NGHIÊNG 3D THEO KHUNG
      const grid = document.createElement('div');
      grid.className = 'gallery-cards-grid';

      CORE_PHOTOS.forEach(photo => {
        const targetSrc = `assets/wall_frames/${frameMeta.id}/${photo.file}`;
        const isCurrent = currentSrc === targetSrc;

        const card = document.createElement('div');
        card.className = `gallery-photo-card ${isCurrent ? 'selected-current' : ''}`;
        card.innerHTML = `
          <div class="card-thumb-wrap">
            <img src="${targetSrc}" alt="${photo.name}">
            ${isCurrent ? '<span class="card-active-badge">✓ Đang Treo</span>' : ''}
          </div>
          <div class="card-info">
            <div class="card-name">${photo.icon} ${photo.name}</div>
            <div class="card-desc">${photo.desc}</div>
            <button class="card-apply-btn">${isCurrent ? '✨ Đang hiển thị' : '➕ Gắn Vào Khung'}</button>
          </div>
        `;

        card.addEventListener('click', () => {
          this.applyPhotoToCurrentFrame(targetSrc, photo.name);
        });

        grid.appendChild(card);
      });

      container.appendChild(grid);
    } else if (this.currentCategory === 'highres') {
      // 2. BỘ HIGHRES
      const grid = document.createElement('div');
      grid.className = 'gallery-cards-grid';

      const highResMap = {
        'khung_1_ngoai_cung_trai': ['khung_1_ngoai_cung_trai__anh_1_cun_con.png'],
        'khung_2_tren_trai': ['khung_2_tren_trai__anh_2_om_guong.png'],
        'khung_3_giua_tren': ['khung_3_giua_tren__anh_3_selfie_thang_may.png'],
        'khung_4_giua_duoi': ['khung_4_giua_duoi__anh_4_tim_tay.png', 'khung_4_giua_duoi__anh_6_call_video.png'],
        'khung_5_tuong_phai': ['khung_5_tuong_phai__anh_5_nam_tay.png', 'khung_5_tuong_phai__anh_6_call_video.png']
      };

      const files = highResMap[frameMeta.id] || [];

      files.forEach(f => {
        const targetSrc = `assets/wall_frames/01_highres/${f}`;
        const isCurrent = currentSrc === targetSrc;

        const card = document.createElement('div');
        card.className = `gallery-photo-card ${isCurrent ? 'selected-current' : ''}`;
        card.innerHTML = `
          <div class="card-thumb-wrap">
            <img src="${targetSrc}" alt="${f}">
            ${isCurrent ? '<span class="card-active-badge">✓ Đang Treo</span>' : ''}
          </div>
          <div class="card-info">
            <div class="card-name">💎 HighRes Sắc Nét</div>
            <div class="card-desc">${f}</div>
            <button class="card-apply-btn">${isCurrent ? '✨ Đang hiển thị' : '➕ Gắn Vào Khung'}</button>
          </div>
        `;
        card.addEventListener('click', () => {
          this.applyPhotoToCurrentFrame(targetSrc, 'HighRes ' + f);
        });
        grid.appendChild(card);
      });

      container.appendChild(grid);
    } else if (this.currentCategory === 'other_sets') {
      // 3. BỘ 1X & FULL FRAME
      const grid = document.createElement('div');
      grid.className = 'gallery-cards-grid';

      // 1x
      const file1x = `khung_${frameMeta.id.split('_')[1]}_...`;
      const target1x = `assets/wall_frames/02_1x/${frameMeta.id}__anh_1_cun_con.png`;
      // Starry night
      const starrySrc = 'assets/sprites/painting_stars.png';

      const extras = [
        { src: starrySrc, name: '⭐ Tranh Đêm Đầy Sao', desc: 'Bản vẽ nghệ thuật Starry Night lãng mạn' }
      ];

      extras.forEach(item => {
        const isCurrent = currentSrc === item.src;
        const card = document.createElement('div');
        card.className = `gallery-photo-card ${isCurrent ? 'selected-current' : ''}`;
        card.innerHTML = `
          <div class="card-thumb-wrap">
            <img src="${item.src}" alt="${item.name}">
            ${isCurrent ? '<span class="card-active-badge">✓ Đang Treo</span>' : ''}
          </div>
          <div class="card-info">
            <div class="card-name">${item.name}</div>
            <div class="card-desc">${item.desc}</div>
            <button class="card-apply-btn">${isCurrent ? '✨ Đang hiển thị' : '➕ Gắn Vào Khung'}</button>
          </div>
        `;
        card.addEventListener('click', () => {
          this.applyPhotoToCurrentFrame(item.src, item.name);
        });
        grid.appendChild(card);
      });

      container.appendChild(grid);
    } else if (this.currentCategory === 'upload') {
      // 4. TẢI LÊN ẢNH RIÊNG
      const uploadWrap = document.createElement('div');
      uploadWrap.className = 'gallery-upload-box';
      uploadWrap.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 8px;">📤</div>
        <h4>Tải Lên Ảnh Riêng Từ Máy Tính Của Bạn</h4>
        <p>Chọn ảnh kỷ niệm khác (JPG, PNG) để gắn vào khung này.</p>
        <label class="game-btn" style="display: inline-block; cursor: pointer; margin-top: 10px;">
          📂 Chọn Ảnh Từ Máy Tính
          <input type="file" id="inp-upload-frame-photo" accept="image/png, image/jpeg" style="display: none;">
        </label>
        <div id="upload-status-text" style="margin-top: 10px; font-size: 0.85rem; color: var(--gold-warm);"></div>
      `;

      const inp = uploadWrap.querySelector('#inp-upload-frame-photo');
      const statusText = uploadWrap.querySelector('#upload-status-text');

      inp.addEventListener('change', async () => {
        const file = inp.files[0];
        if (!file) return;

        statusText.textContent = `⏳ Đang xử lý tải lên ${file.name}...`;

        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result;
          try {
            const resp = await fetch('/api/upload-frame-photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl, filename: file.name })
            });
            const res = await resp.json();
            if (res.success && res.url) {
              statusText.textContent = '✨ Tải lên thành công! Đang gắn vào khung...';
              this.applyPhotoToCurrentFrame(res.url, file.name);
            } else {
              statusText.textContent = '❌ Lỗi tải lên: ' + (res.error || 'Thử lại sau');
            }
          } catch (e) {
            statusText.textContent = '❌ Lỗi kết nối: ' + e.message;
          }
        };
        reader.readAsDataURL(file);
      });

      container.appendChild(uploadWrap);
    }
  }

  async applyPhotoToCurrentFrame(newSrc, photoTitle) {
    const frameMeta = this.getCurrentFrameMeta();
    const frameHotspot = document.querySelector(`.hotspot[data-hotspot="${frameMeta.key}"]`);
    if (!frameHotspot) return;

    // 1. Cập nhật DOM trên tường phòng khách
    const imgEl = frameHotspot.querySelector('img');
    if (imgEl) {
      imgEl.src = newSrc;
    }

    // 2. Cập nhật xem trước trong Modal
    const previewEl = document.getElementById('gallery-current-img');
    if (previewEl) previewEl.src = newSrc;

    // 3. Hiệu ứng âm thanh & thông báo
    if (this.sound) this.sound.play('pickup');

    const toast = document.getElementById('gallery-toast-pill');
    if (toast) {
      toast.style.display = 'inline-block';
      toast.textContent = `✨ Đã gắn [${photoTitle}] vào ${frameMeta.name}!`;
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3500);
    }

    // Cập nhật lại UI lưới ảnh
    this.renderPhotoOptions();

    // 4. Lưu vĩnh viễn vào index.html & hotspots_config.json qua Server API
    try {
      const payload = {
        savedAt: new Date().toLocaleString('vi-VN'),
        hotspots: {
          [frameMeta.key]: {
            left: frameHotspot.style.left || '0%',
            top: frameHotspot.style.top || '0%',
            width: frameHotspot.style.width || '10%',
            height: frameHotspot.style.height || '10%',
            label: frameHotspot.querySelector('.hotspot-label')?.textContent.trim() || frameMeta.label,
            dialogue: frameHotspot.getAttribute('data-dialogue') || '',
            src: newSrc
          }
        }
      };

      await fetch('/api/save-coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Lưu khung ảnh ngầm thất bại:', err);
    }
  }
}
