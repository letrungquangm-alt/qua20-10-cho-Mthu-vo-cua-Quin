// Visual Hotspot Calibrator & Content Editor (Quin & MThư)
// Cho phép kéo thả trực quan vị trí và sửa trực tiếp lời thoại / nhãn
// của toàn bộ vật thể trong 3 căn phòng.

export const WALL_PHOTO_OPTIONS = [
  { id: 'anh_1_cun_con_giu_nguyen_anh_goc.png', name: '🐶 Bé Gấu cưng' },
  { id: 'anh_2_om_guong_giu_nguyen_anh_goc.png', name: '🪞 Ôm gương' },
  { id: 'anh_3_selfie_thang_may_giu_nguyen_anh_goc.png', name: '🛗 Selfie thang máy' },
  { id: 'anh_4_tim_tay_giu_nguyen_anh_goc.png', name: '🫶 Bắn tim tay' },
  { id: 'anh_5_nam_tay_giu_nguyen_anh_goc.png', name: '🤝 Nắm tay dạo phố' },
  { id: 'anh_6_call_video_giu_nguyen_anh_goc.png', name: '📱 Call video' }
];

export const DEFAULT_HOTSPOT_DATA = {
  // Phòng 1
  painting_couple: {
    room: 1,
    label: "🖼️ Quin & Minh Thư",
    dialogue: "Ảnh kỷ niệm ngọt ngào của hai đứa mình nè vợ! Chàng trai 2006 (26) và cô gái đáng yêu sinh ngày 27/09/2007 (27)! ❤️",
    dialogue_after: "à hoá ra nó là mật khẩu của hộp gỗ, vở giỏi dạaaaa",
    frameId: "khung_1_ngoai_cung_trai",
    src: "assets/wall_frames/khung_1_ngoai_cung_trai/anh_2_om_guong_giu_nguyen_anh_goc.png"
  },
  painting_frame2: {
    room: 1,
    label: "anh và vợ chụp ở thang máy :3",
    dialogue: "Ảnh selfie trong thang máy của hai đứa mình nè vợ! Đáng yêu xỉu luôn á! ❤️",
    dialogue_after: "Ảnh selfie trong thang máy của hai đứa mình nè vợ! Đáng yêu xỉu luôn á! ❤️",
    frameId: "khung_2_tren_trai",
    src: "assets/wall_frames/khung_2_tren_trai/anh_3_selfie_thang_may_giu_nguyen_anh_goc.png"
  },
  calendar: {
    room: 1,
    label: "📅 Lịch",
    dialogue: "Lịch đã xé tới 20/10/2026, chúc vợ 20/10 vui vẻ ạaaa gửi tới Mẹ Ái và ngoại giúp anh lun nhaaaaa :3333",
    dialogue_after: "Lịch đã xé tới 20/10/2026, chúc vợ 20/10 vui vẻ ạaaa gửi tới Mẹ Ái và ngoại giúp anh lun nhaaaaa :3333"
  },
  painting_stars: {
    room: 1,
    label: "⭐lúc call video",
    dialogue: "lúc này vợ xinh gái điên và anh cũng chụp lại ngôi sao may mắn của anh :3⭐",
    dialogue_after: "lúc này vợ xinh gái điên và anh cũng chụp lại ngôi sao may mắn của anh :3⭐",
    frameId: "khung_3_giua_tren",
    src: "assets/wall_frames/khung_3_giua_tren/anh_6_call_video_giu_nguyen_anh_goc.png"
  },
  painting_gau: {
    room: 1,
    label: "🐶 Chân Dung Bé Gấu",
    dialogue: "",
    dialogue_after: "tay vợ mềm nhắm á :3 cũng thơm nữaaaaaaaaaaa",
    frameId: "khung_4_giua_duoi",
    src: "assets/wall_frames/khung_4_giua_duoi/anh_5_nam_tay_giu_nguyen_anh_goc.png"
  },
  painting_clue: {
    room: 1,
    label: "Gấu lúc bé",
    dialogue: "Gấu nó lúc bé dễ thương ghê ha vợ =))))))",
    dialogue_after: "Gấu nó lúc bé dễ thương ghê ha vợ =))))))",
    frameId: "khung_5_tuong_phai",
    src: "assets/wall_frames/khung_5_tuong_phai/anh_1_cun_con_giu_nguyen_anh_goc.png"
  },
  wooden_box: {
    room: 1,
    label: "🔒 Hộp Gỗ (Mã 2726)",
    dialogue: "Hộp kỳ lạ có thể xoay số? Nó làm gì?",
    dialogue_after: "giỏi thía hộp này gặp anh chắc phải 3 ngày mới giải được cơ ^^",
    src: "assets/sprites/wooden_box_closed.png"
  },
  dog: {
    room: 1,
    label: "🐶 Bé Gấu (Cún Cưng)",
    src: "assets/sprites/dog_happy.png",
    dialogue: "Má, con gấu nó đang ngủ say đè trên chìa khoá kìa vợ, bấm vào người nó lần nữa để gọi nó dậy xem sao nhen",
    dialogue_after: "Khổ thân vợ tui, nó nặng như quỷ =)))))) giờ có ùi lfàm gì tiếp đây?"
  },
  milktea: {
    room: 1,
    label: "🧋 2 Ly Trà Sữa",
    dialogue: "Chà con mắm uống xong lại không dọn rồi, cực vợ nữa ùi :<",
    dialogue_after: "Chà con mắm uống xong lại không dọn rồi, cực vợ nữa ùi :<",
    src: "assets/sprites/milktea.png"
  },
  roses_vase: {
    room: 1,
    label: "🌹 Bình Hoa Hồng",
    dialogue: "Hoa này là hoa sinh nhật của em á, nhớ lại vui gheeeeeee",
    dialogue_after: "Hoa này là hoa sinh nhật của em á, nhớ lại vui gheeeeeee",
    src: "assets/sprites/roses_vase.png"
  },
  // Phòng 2
  teddy: {
    room: 2,
    label: "🧸 Gấu Bông Nâu",
    dialogue: "Quin này nhìn hơi lạ =)))) nhưng hình như trong túi có gì đó, à thì ra là xương gậm cho Gấu nè",
    dialogue_after: "Túi áo của chú gấu bông nâu đã trống sau khi lấy xương gặm rồi 🧸",
    src: "assets/sprites/teddy_with_bone.png"
  },
  safe: {
    room: 2,
    label: "🔐 Két Sắt Bí Mật",
    dialogue: "Một cái két gì đó chỉ có thể ghi bằng chữ nhưng chữ gì ta?",
    dialogue_after: "Vợ giỏi cáaaaa vợ mở được ùi xem túi đồ có gì chưa, chắc nó mở gì á 🔐",
    src: "assets/objects/safe.png"
  },
  jewelry_box: {
    room: 2,
    label: "💎 Hộp Trang Sức",
    dialogue: "hiếm hoi lắm vợ mới mua đồ trang điểm cho bản thân nên anh cất ở đây :3",
    dialogue_after: "Hộp trang sức hoàng gia đã mở! Pin Trái Tim & Mảnh Tim (Trái) đã được cất vào túi đồ rùi áaaaaaaaaa! 💎",
    src: "assets/sprites/jewelry_box_closed.png"
  },
  paper: {
    room: 2,
    label: "💋 Tờ Giấy Nụ Hôn",
    dialogue: "Tờ giấy in dấu nụ hôn môi son đỏ thắm thật quyến rũ. Hãy thắp nến thơm ngoài ban công và hơ tờ giấy qua hơi nóng để làm hiện mật mã ẩn giấu nha!",
    dialogue_after: "Tờ giấy hiện rõ 5 chữ cái tình yêu: V - O - Y - E - U! Mật mã mở két sắt đó vợ ơi! 📄💋",
    src: "assets/sprites/paper_blank.png"
  },
  dog_key: {
    room: 1,
    label: "🔑 Chìa Khóa Đồng",
    dialogue: "Khổ thân vợ tui, nó nặng như quỷ =)))))) giờ có ùi làm gì tiếp đây?",
    dialogue_after: "Khổ thân vợ tui, nó nặng như quỷ =)))))) giờ có ùi làm gì tiếp đây?",
    src: "assets/items/small_key.png"
  },
  // Phòng 3
  candle: {
    room: 3,
    label: "🕯️ Nến Thơm & Thiệp",
    dialogue: "Cây nến thơm chưa thắp lửa, bên dưới có tấm thiệp in mực cảm nhiệt.",
    dialogue_after: "Ngọn nến thơm ấm áp bùng sáng! Hơi nóng làm thiệp cảm nhiệt hiện rõ: 🌹 ➔ 👑 ➔ 💖 ➔ 💎",
    src: "assets/sprites/candle_lit.png"
  },
  switch: {
    room: 3,
    label: "💡 Nguồn Đèn Đom Đóm",
    dialogue: "Thiên lý ơi em có thể ở lại đây không =)))) cái này cần viên pin gì đó vợ thử tìm xem",
    dialogue_after: "Dây đèn đom đóm bừng sáng lung linh trên bầu trời đêm ban công! Đẹp quá vợ ơiiii ✨",
    src: "assets/sprites/switch_box.png"
  },
  final_chest: {
    room: 3,
    label: "🎁 Rương Báu 20/10",
    dialogue: "Rương này hơi lạ nó cần 2 mảnh trái tim và nhập mật khẩu, vợ thử tìm đâu đó xem",
    dialogue_after: "hehe vợ giỏi dạaaa xem hết thư i có thú vị lắm áaaa! 👑",
    src: "assets/sprites/chest_closed.png"
  }
};

export class HotspotCalibrator {
  constructor() {
    this.isActive = false;
    this.selectedEl = null;
    this.isDragging = false;
    this.isResizing = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.initialLeft = 0;
    this.initialTop = 0;
    this.initialWidth = 0;
    this.initialHeight = 0;
    this.currentParentRect = null;

    // Bộ nhớ dữ liệu tùy chỉnh nội dung
    this.customData = JSON.parse(JSON.stringify(DEFAULT_HOTSPOT_DATA));

    this.init();
  }

  async init() {
    await this.loadSavedConfig();
    this.createPanelDOM();
    this.bindGlobalEvents();
    this.applyLoadedContentToDOM();
  }

  async loadSavedConfig() {
    try {
      const resp = await fetch('/hotspots_config.json?t=' + Date.now());
      if (resp.ok) {
        const config = await resp.json();
        if (config && config.hotspots) {
          Object.entries(config.hotspots).forEach(([key, val]) => {
            if (!this.customData[key]) {
              this.customData[key] = {};
            }
            if (val.label) this.customData[key].label = val.label;
            if (val.dialogue) this.customData[key].dialogue = val.dialogue;
            if (val.dialogue_after) this.customData[key].dialogue_after = val.dialogue_after;
            if (val.src) this.customData[key].src = val.src;
          });
        }
      }
    } catch (e) {
      // Dùng default nếu chưa có file
    }
  }

  applyLoadedContentToDOM() {
    // Áp dụng nhãn, dialogue, dialogue_after và src vào HTML attributes
    Object.entries(this.customData).forEach(([key, data]) => {
      const el = document.querySelector(`.hotspot[data-hotspot="${key}"]`);
      if (el) {
        if (data.dialogue) {
          el.setAttribute('data-dialogue', data.dialogue);
        }
        if (data.dialogue_after) {
          el.setAttribute('data-dialogue-after', data.dialogue_after);
        }
        if (data.label) {
          const labelEl = el.querySelector('.hotspot-label');
          if (labelEl) labelEl.textContent = data.label;
        }
        if (data.src) {
          const imgEl = el.querySelector('img');
          if (imgEl) imgEl.src = data.src;
        }
      }
    });
  }

  createPanelDOM() {
    const panel = document.createElement('div');
    panel.id = 'calibrator-floating-panel';
    panel.className = 'calibrator-floating-panel';
    panel.innerHTML = `
      <div class="cal-panel-header" id="cal-panel-drag-handle">
        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
          <span class="cal-title">🎯 CĂN CHỈNH TỌA ĐỘ & QUẢN LÝ HỘI THOẠI</span>
          <div class="cal-room-tabs" style="margin: 0;">
            <button class="cal-tab-btn active" data-cal-room="1">🛋️ Phòng 1</button>
            <button class="cal-tab-btn" data-cal-room="2">💄 Phòng 2</button>
            <button class="cal-tab-btn" data-cal-room="3">🕯️ Phòng 3</button>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" id="btn-toggle-panel-size" class="cal-size-btn" title="Phóng to / Thu nhỏ panel">⤢</button>
          <button class="cal-close-btn" id="btn-cal-close" title="Đóng panel">✕</button>
        </div>
      </div>

      <div class="cal-panel-body">
        <!-- NÚT BẬT TẮT BẢNG QUẢN LÝ TẤT CẢ 17 HỘI THOẠI -->
        <button type="button" id="btn-toggle-all-dialogues" class="cal-btn-all-dialogues">
          <span>📖</span>
          <span>XEM & SỬA TẤT CẢ 17 HỘI THOẠI TRONG GAME (BẢNG SO SÁNH 2 TRẠNG THÁI NGANG HÀNG)</span>
        </button>

        <!-- BẢNG TỔNG HỢP TOÀN BỘ 17 HỘI THOẠI (ẨN / HIỆN) -->
        <div id="cal-all-dialogues-box" style="display: none;" class="cal-all-dialogues-container">
          <div class="cal-all-dialogues-header">
            <div>
              <span style="font-weight: 700; color: var(--gold-warm); font-size: 0.95rem;">📜 BẢNG QUẢN LÝ 17 HỘI THOẠI TOÀN BỘ VẬT PHẨM</span>
              <div style="font-size: 0.74rem; color: #e6ccb2; margin-top: 2px;">Cột Trái: Thoại ban đầu (Chưa kích hoạt) — Cột Phải: Thoại giải mã / nhận đồ (Đã kích hoạt)</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btn-save-all-dialogues-quick" class="cal-btn-save" style="padding: 6px 16px; font-size: 0.82rem; width: auto;">💾 Lưu Nhanh Tất Cả</button>
              <button type="button" id="btn-close-all-dialogues-sub" class="cal-btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; width: auto;">Đóng Bảng</button>
            </div>
          </div>
          <div id="cal-all-dialogues-list"></div>
        </div>

        <!-- BỐ CỤC CHÍNH: 2 CỘT NGANG RỘNG RÃI -->
        <div class="cal-main-2col-layout" id="cal-main-2col-layout">
          <!-- CỘT TRÁI: VỊ TRÍ, TỌA ĐỘ & VẬT PHẨM -->
          <div class="cal-col-left">
            <div class="cal-section-box">
              <div class="cal-section-title">📍 1. CHỌN VẬT THỂ & NHÃN TÊN</div>
              <div class="cal-field-group">
                <label class="cal-label">Vật phẩm đang chọn:</label>
                <select id="cal-item-select" class="cal-select"></select>
              </div>
              <div class="cal-field-group">
                <label class="cal-label">🏷️ Tên nhãn (Label):</label>
                <input type="text" id="cal-inp-label" class="cal-text-input" placeholder="Tên nhãn hiển thị...">
              </div>
            </div>

            <div class="cal-section-box" style="margin-top: 10px;">
              <div class="cal-section-title">📐 2. TỌA ĐỘ (% SÂN KHẤU) & KÍCH THƯỚC</div>
              <div class="cal-coords-grid">
                <div class="cal-coord-box">
                  <span class="cal-coord-tag">X (Left - Trái)</span>
                  <div class="cal-input-wrap">
                    <button class="cal-step-btn" data-step-dir="left-dec">◀</button>
                    <input type="number" step="0.1" id="cal-inp-left" class="cal-num-input">
                    <span class="cal-unit">%</span>
                    <button class="cal-step-btn" data-step-dir="left-inc">▶</button>
                  </div>
                </div>

                <div class="cal-coord-box">
                  <span class="cal-coord-tag">Y (Top - Trên)</span>
                  <div class="cal-input-wrap">
                    <button class="cal-step-btn" data-step-dir="top-dec">▲</button>
                    <input type="number" step="0.1" id="cal-inp-top" class="cal-num-input">
                    <span class="cal-unit">%</span>
                    <button class="cal-step-btn" data-step-dir="top-inc">▼</button>
                  </div>
                </div>

                <div class="cal-coord-box">
                  <span class="cal-coord-tag">Rộng (Width)</span>
                  <div class="cal-input-wrap">
                    <button class="cal-step-btn" data-step-dir="width-dec">-</button>
                    <input type="number" step="0.1" id="cal-inp-width" class="cal-num-input">
                    <span class="cal-unit">%</span>
                    <button class="cal-step-btn" data-step-dir="width-inc">+</button>
                  </div>
                </div>

                <div class="cal-coord-box">
                  <span class="cal-coord-tag">Cao (Height)</span>
                  <div class="cal-input-wrap">
                    <button class="cal-step-btn" data-step-dir="height-dec">-</button>
                    <input type="number" step="0.1" id="cal-inp-height" class="cal-num-input">
                    <span class="cal-unit">%</span>
                    <button class="cal-step-btn" data-step-dir="height-inc">+</button>
                  </div>
                </div>
              </div>

              <!-- CHỌN ẢNH UỐN NGHIÊNG 3D CHO CÁC KHUNG PHÒNG KHÁCH -->
              <div id="cal-frame-photo-group" class="cal-field-group" style="display: none; background: rgba(243, 202, 126, 0.08); border: 1px solid var(--brown-toffee); padding: 8px; border-radius: 8px; margin-top: 4px;">
                <label class="cal-label" style="color: var(--gold-warm); font-weight: 700;">🖼️ Đổi ảnh uốn nghiêng 3D (1 trong 6 ảnh):</label>
                <div id="cal-photo-selector-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px;"></div>
              </div>

              <div class="cal-hint-box">
                💡 Bạn có thể <b>kéo thả chuột trực tiếp</b> trên phòng, kéo <b>núm vàng</b> để co giãn, hoặc bấm mũi tên tăng giảm milimet.
              </div>
            </div>
          </div>

          <!-- CỘT PHẢI: LỜI THOẠI 2 TRẠNG THÁI & LƯU -->
          <div class="cal-col-right">
            <div class="cal-section-box" style="height: 100%; justify-content: space-between;">
              <div>
                <div class="cal-section-title">💬 3. HỘI THOẠI 2 TRẠNG THÁI CỦA VẬT THỂ</div>

                <!-- SỬA THOẠI 1 (CHƯA KÍCH HOẠT / LẦN 1) -->
                <div class="cal-field-group">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label class="cal-label" style="color: #ffd166;">Thoại 1 (Chưa kích hoạt / Trước khi mở / Lần 1):</label>
                    <button type="button" id="btn-preview-dialogue" class="cal-btn-preview" title="Xem thử Thoại 1">👁️ Thử Thoại 1</button>
                  </div>
                  <textarea id="cal-inp-dialogue" class="cal-textarea" style="min-height: 85px;" placeholder="Lời thoại hiển thị lúc ban đầu hoặc trước khi giải..."></textarea>
                </div>

                <!-- SỬA THOẠI 2 (ĐÃ KÍCH HOẠT / LẦN 2) -->
                <div class="cal-field-group" style="margin-top: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label class="cal-label" style="color: #4cd137;">✨ Thoại 2 (Đã kích hoạt / Sau khi mở / Nhận chìa / Lần 2):</label>
                    <button type="button" id="btn-preview-dialogue-2" class="cal-btn-preview" title="Xem thử Thoại 2">👁️ Thử Thoại 2</button>
                  </div>
                  <textarea id="cal-inp-dialogue-after" class="cal-textarea" style="min-height: 85px;" placeholder="Lời thoại hiển thị sau khi đã kích hoạt, mở khóa, hoặc lần 2..."></textarea>
                </div>
              </div>

              <div class="cal-actions" style="margin-top: 14px;">
                <button id="btn-save-coordinates" class="cal-btn-save">
                  💾 Lưu Toàn Bộ Tọa Độ & Nội Dung
                </button>
                <button id="btn-copy-json" class="cal-btn-secondary" title="Sao chép toàn bộ chuỗi JSON">
                  📋 Sao Chép JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    this.populateDropdown();

    // Resize handle
    const handle = document.createElement('div');
    handle.id = 'calibrator-resize-handle';
    handle.className = 'calibrator-resize-handle';
    handle.title = 'Kéo để co giãn kích thước (Width x Height)';
    document.body.appendChild(handle);
  }

  populateDropdown() {
    const select = document.getElementById('cal-item-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Nhấp vật phẩm trong phòng hoặc chọn ở đây --</option>';

    [1, 2, 3].forEach(roomNum => {
      const optGroup = document.createElement('optgroup');
      optGroup.label = `--- PHÒNG ${roomNum} ---`;
      Object.entries(this.customData).forEach(([key, meta]) => {
        if (meta.room === roomNum) {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = meta.label || key;
          optGroup.appendChild(opt);
        }
      });
      select.appendChild(optGroup);
    });

    select.addEventListener('change', (e) => {
      const key = e.target.value;
      if (key) {
        this.selectHotspotByKey(key);
      }
    });
  }

  bindGlobalEvents() {
    // 1. Nút bật/tắt trên Header
    const toggleBtn = document.getElementById('btn-toggle-calibrator');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Nút đóng trên panel
    const closeBtn = document.getElementById('btn-cal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.deactivate();
      });
    }

    // Tabs chuyển phòng
    document.querySelectorAll('[data-cal-room]').forEach(btn => {
      btn.addEventListener('click', () => {
        const room = parseInt(btn.getAttribute('data-cal-room'), 10);
        this.switchRoom(room);
      });
    });

    // Lắng nghe sửa Tên nhãn (Label)
    const labelInp = document.getElementById('cal-inp-label');
    if (labelInp) {
      labelInp.addEventListener('input', () => {
        if (!this.selectedEl) return;
        const key = this.selectedEl.getAttribute('data-hotspot');
        const newLabel = labelInp.value;
        if (!this.customData[key]) this.customData[key] = {};
        this.customData[key].label = newLabel;

        const lblEl = this.selectedEl.querySelector('.hotspot-label');
        if (lblEl) lblEl.textContent = newLabel;

        // Cập nhật lại dropdown text
        const opt = document.querySelector(`#cal-item-select option[value="${key}"]`);
        if (opt) opt.textContent = newLabel;
      });
    }

    // Lắng nghe sửa Thoại 1
    const dialogueInp = document.getElementById('cal-inp-dialogue');
    if (dialogueInp) {
      dialogueInp.addEventListener('input', () => {
        if (!this.selectedEl) return;
        const key = this.selectedEl.getAttribute('data-hotspot');
        const newDia = dialogueInp.value;
        if (!this.customData[key]) this.customData[key] = {};
        this.customData[key].dialogue = newDia;
        this.selectedEl.setAttribute('data-dialogue', newDia);
      });
    }

    // Lắng nghe sửa Thoại 2
    const dialogueAfterInp = document.getElementById('cal-inp-dialogue-after');
    if (dialogueAfterInp) {
      dialogueAfterInp.addEventListener('input', () => {
        if (!this.selectedEl) return;
        const key = this.selectedEl.getAttribute('data-hotspot');
        const newDiaAfter = dialogueAfterInp.value;
        if (!this.customData[key]) this.customData[key] = {};
        this.customData[key].dialogue_after = newDiaAfter;
        this.selectedEl.setAttribute('data-dialogue-after', newDiaAfter);
      });
    }

    // Nút Xem thử Thoại 1
    const previewBtn = document.getElementById('btn-preview-dialogue');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        if (!this.selectedEl) return;
        const key = this.selectedEl.getAttribute('data-hotspot');
        const text = (this.customData[key] && this.customData[key].dialogue) || (dialogueInp ? dialogueInp.value : '');
        const diaBox = document.getElementById('dialogue-text');
        if (diaBox) {
          diaBox.innerText = text;
        }
      });
    }

    // Nút Xem thử Thoại 2
    const previewBtn2 = document.getElementById('btn-preview-dialogue-2');
    if (previewBtn2) {
      previewBtn2.addEventListener('click', () => {
        if (!this.selectedEl) return;
        const key = this.selectedEl.getAttribute('data-hotspot');
        const text = (this.customData[key] && this.customData[key].dialogue_after) || (dialogueAfterInp ? dialogueAfterInp.value : '');
        const diaBox = document.getElementById('dialogue-text');
        if (diaBox) {
          diaBox.innerText = text;
        }
      });
    }

    // Nút bật/tắt xem tất cả 17 hội thoại
    const toggleAllBtn = document.getElementById('btn-toggle-all-dialogues');
    const allBox = document.getElementById('cal-all-dialogues-box');
    if (toggleAllBtn && allBox) {
      toggleAllBtn.addEventListener('click', () => {
        const isShowing = allBox.style.display !== 'none';
        allBox.style.display = isShowing ? 'none' : 'block';
        if (!isShowing) {
          this.renderAllDialoguesList();
        }
      });
    }

    // Nút lưu nhanh trong bảng hội thoại
    document.getElementById('btn-save-all-dialogues-quick')?.addEventListener('click', () => {
      this.saveAllDataToServer();
    });

    // Nút đóng bảng hội thoại phụ
    document.getElementById('btn-close-all-dialogues-sub')?.addEventListener('click', () => {
      const allBox = document.getElementById('cal-all-dialogues-box');
      if (allBox) allBox.style.display = 'none';
    });

    // Nút phóng to / thu nhỏ panel (Toggle Ultra-Wide)
    const sizeBtn = document.getElementById('btn-toggle-panel-size');
    const panel = document.getElementById('calibrator-floating-panel');
    if (sizeBtn && panel) {
      sizeBtn.addEventListener('click', () => {
        const isUltra = panel.classList.toggle('ultra-wide');
        sizeBtn.innerText = isUltra ? '⤡' : '⤢';
        sizeBtn.title = isUltra ? 'Thu nhỏ về 900px' : 'Phóng to lên 1180px';
      });
    }

    // Inputs tọa độ
    const leftInp = document.getElementById('cal-inp-left');
    const topInp = document.getElementById('cal-inp-top');
    const widthInp = document.getElementById('cal-inp-width');
    const heightInp = document.getElementById('cal-inp-height');

    const handleInputChange = () => {
      if (!this.selectedEl) return;
      const l = parseFloat(leftInp.value) || 0;
      const t = parseFloat(topInp.value) || 0;
      const w = parseFloat(widthInp.value) || 10;
      const h = parseFloat(heightInp.value) || 10;

      this.selectedEl.style.left = `${l.toFixed(1)}%`;
      this.selectedEl.style.top = `${t.toFixed(1)}%`;
      this.selectedEl.style.width = `${w.toFixed(1)}%`;
      this.selectedEl.style.height = `${h.toFixed(1)}%`;
      this.updateResizeHandlePosition();
    };

    [leftInp, topInp, widthInp, heightInp].forEach(inp => {
      if (inp) inp.addEventListener('input', handleInputChange);
    });

    // Step buttons
    document.querySelectorAll('[data-step-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.selectedEl) return;
        const dir = btn.getAttribute('data-step-dir');
        let l = parseFloat(this.selectedEl.style.left) || 0;
        let t = parseFloat(this.selectedEl.style.top) || 0;
        let w = parseFloat(this.selectedEl.style.width) || 10;
        let h = parseFloat(this.selectedEl.style.height) || 10;

        const step = 0.2;
        if (dir === 'left-dec') l = Math.max(0, l - step);
        if (dir === 'left-inc') l = Math.min(100, l + step);
        if (dir === 'top-dec') t = Math.max(0, t - step);
        if (dir === 'top-inc') t = Math.min(100, t + step);
        if (dir === 'width-dec') w = Math.max(2, w - step);
        if (dir === 'width-inc') w = Math.min(100, w + step);
        if (dir === 'height-dec') h = Math.max(2, h - step);
        if (dir === 'height-inc') h = Math.min(100, h + step);

        this.selectedEl.style.left = `${l.toFixed(1)}%`;
        this.selectedEl.style.top = `${t.toFixed(1)}%`;
        this.selectedEl.style.width = `${w.toFixed(1)}%`;
        this.selectedEl.style.height = `${h.toFixed(1)}%`;

        this.syncInputsWithSelected();
        this.updateResizeHandlePosition();
      });
    });

    // Nút Lưu
    const saveBtn = document.getElementById('btn-save-coordinates');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveAllDataToServer();
      });
    }

    // Nút Copy JSON
    const copyBtn = document.getElementById('btn-copy-json');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyJsonToClipboard();
      });
    }

    this.bindPanelDrag();

    // Mouse down trên Hotspots
    document.querySelectorAll('.hotspot[data-hotspot]').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        if (!this.isActive) return;
        e.preventDefault();
        e.stopPropagation();

        this.selectHotspot(el);
        this.startDragging(e, el);
      });
    });

    // Resize Handle Mouse Down
    const resizeHandle = document.getElementById('calibrator-resize-handle');
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', (e) => {
        if (!this.isActive || !this.selectedEl) return;
        e.preventDefault();
        e.stopPropagation();
        this.startResizing(e);
      });
    }

    // Mouse Move & Up
    window.addEventListener('mousemove', (e) => {
      if (!this.isActive) return;
      if (this.isDragging) {
        this.onDragMove(e);
      } else if (this.isResizing) {
        this.onResizeMove(e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging || this.isResizing) {
        this.isDragging = false;
        this.isResizing = false;
        this.syncInputsWithSelected();
        this.updateResizeHandlePosition();
      }
    });

    // Phím mũi tên
    window.addEventListener('keydown', (e) => {
      if (!this.isActive || !this.selectedEl) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const step = e.shiftKey ? 1.0 : (e.altKey ? 0.5 : 0.2);

      let l = parseFloat(this.selectedEl.style.left) || 0;
      let t = parseFloat(this.selectedEl.style.top) || 0;
      let w = parseFloat(this.selectedEl.style.width) || 10;
      let h = parseFloat(this.selectedEl.style.height) || 10;

      let handled = false;

      if (e.altKey) {
        if (e.key === 'ArrowLeft') { w = Math.max(2, w - step); handled = true; }
        if (e.key === 'ArrowRight') { w = Math.min(100, w + step); handled = true; }
        if (e.key === 'ArrowUp') { h = Math.max(2, h - step); handled = true; }
        if (e.key === 'ArrowDown') { h = Math.min(100, h + step); handled = true; }
      } else {
        if (e.key === 'ArrowLeft') { l = Math.max(0, l - step); handled = true; }
        if (e.key === 'ArrowRight') { l = Math.min(100, l + step); handled = true; }
        if (e.key === 'ArrowUp') { t = Math.max(0, t - step); handled = true; }
        if (e.key === 'ArrowDown') { t = Math.min(100, t + step); handled = true; }
      }

      if (handled) {
        e.preventDefault();
        this.selectedEl.style.left = `${l.toFixed(1)}%`;
        this.selectedEl.style.top = `${t.toFixed(1)}%`;
        this.selectedEl.style.width = `${w.toFixed(1)}%`;
        this.selectedEl.style.height = `${h.toFixed(1)}%`;
        this.syncInputsWithSelected();
        this.updateResizeHandlePosition();
      }
    });
  }

  toggle() {
    if (this.isActive) this.deactivate();
    else this.activate();
  }

  activate() {
    this.isActive = true;
    document.body.classList.add('calibrator-active');

    const panel = document.getElementById('calibrator-floating-panel');
    if (panel) panel.classList.add('visible');

    const toggleBtn = document.getElementById('btn-toggle-calibrator');
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.innerText = '🔴 Đang Căn Chỉnh';
    }

    const currentRoomEl = document.querySelector('.room-scene.active');
    const firstHotspot = currentRoomEl ? currentRoomEl.querySelector('.hotspot[data-hotspot]') : null;
    if (firstHotspot) {
      this.selectHotspot(firstHotspot);
    }
  }

  deactivate() {
    this.isActive = false;
    document.body.classList.remove('calibrator-active');

    const panel = document.getElementById('calibrator-floating-panel');
    if (panel) panel.classList.remove('visible');

    const toggleBtn = document.getElementById('btn-toggle-calibrator');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.innerText = '🎯 Căn Chỉnh Vị Trí';
    }

    if (this.selectedEl) {
      this.selectedEl.classList.remove('calibrator-selected');
      this.selectedEl = null;
    }

    const handle = document.getElementById('calibrator-resize-handle');
    if (handle) handle.style.display = 'none';
  }

  selectHotspot(el) {
    if (this.selectedEl) {
      this.selectedEl.classList.remove('calibrator-selected');
    }
    this.selectedEl = el;
    this.selectedEl.classList.add('calibrator-selected');

    const key = el.getAttribute('data-hotspot');
    const select = document.getElementById('cal-item-select');
    if (select && key) {
      select.value = key;
    }

    const meta = this.customData[key];
    if (meta && meta.room) {
      document.querySelectorAll('[data-cal-room]').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.getAttribute('data-cal-room'), 10) === meta.room);
      });
    }

    // Hiển thị bộ chọn ảnh 3D nếu là khung tranh tường
    const photoGroup = document.getElementById('cal-frame-photo-group');
    const photoGrid = document.getElementById('cal-photo-selector-grid');
    const frameId = el.getAttribute('data-frame-id');

    if (photoGroup && photoGrid) {
      if (frameId) {
        photoGroup.style.display = 'block';
        photoGrid.innerHTML = '';
        const currentSrc = el.querySelector('img')?.getAttribute('src') || '';

        WALL_PHOTO_OPTIONS.forEach(opt => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cal-photo-opt-btn';
          const targetSrc = `assets/wall_frames/${frameId}/${opt.id}`;
          const isSelected = currentSrc.includes(opt.id);

          btn.style.cssText = `
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: ${isSelected ? 'rgba(243, 202, 126, 0.35)' : 'rgba(38, 22, 14, 0.85)'};
            border: 1px solid ${isSelected ? 'var(--gold-warm)' : 'var(--brown-toffee)'};
            border-radius: 6px; padding: 4px; cursor: pointer; color: var(--cream-soft);
            font-size: 0.68rem; gap: 4px; transition: all 0.2s;
          `;

          btn.innerHTML = `
            <img src="${targetSrc}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid #7f4f24;">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70px;">${opt.name}</span>
          `;

          btn.addEventListener('click', () => {
            const imgEl = el.querySelector('img');
            if (imgEl) imgEl.src = targetSrc;
            if (!this.customData[key]) this.customData[key] = {};
            this.customData[key].src = targetSrc;
            this.selectHotspot(el);
          });

          photoGrid.appendChild(btn);
        });
      } else {
        photoGroup.style.display = 'none';
      }
    }

    this.syncInputsWithSelected();
    this.updateResizeHandlePosition();
  }

  selectHotspotByKey(key) {
    const el = document.querySelector(`.hotspot[data-hotspot="${key}"]`);
    if (!el) return;

    const meta = this.customData[key];
    if (meta && meta.room) {
      this.switchRoom(meta.room);
    }

    setTimeout(() => {
      this.selectHotspot(el);
    }, 50);
  }

  switchRoom(roomNum) {
    const sceneArrows = document.querySelectorAll(`[data-goto-room="${roomNum}"]`);
    if (sceneArrows.length > 0) {
      sceneArrows[0].click();
    } else {
      document.querySelectorAll('.room-scene').forEach(r => r.classList.remove('active'));
      const target = document.getElementById(`room-scene-${roomNum}`);
      if (target) target.classList.add('active');
    }

    document.querySelectorAll('[data-cal-room]').forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.getAttribute('data-cal-room'), 10) === roomNum);
    });

    setTimeout(() => {
      this.updateResizeHandlePosition();
    }, 100);
  }

  syncInputsWithSelected() {
    if (!this.selectedEl) return;
    const key = this.selectedEl.getAttribute('data-hotspot');

    const leftInp = document.getElementById('cal-inp-left');
    const topInp = document.getElementById('cal-inp-top');
    const widthInp = document.getElementById('cal-inp-width');
    const heightInp = document.getElementById('cal-inp-height');
    const labelInp = document.getElementById('cal-inp-label');
    const dialogueInp = document.getElementById('cal-inp-dialogue');

    if (leftInp) leftInp.value = parseFloat(this.selectedEl.style.left || 0).toFixed(1);
    if (topInp) topInp.value = parseFloat(this.selectedEl.style.top || 0).toFixed(1);
    if (widthInp) widthInp.value = parseFloat(this.selectedEl.style.width || 0).toFixed(1);
    if (heightInp) heightInp.value = parseFloat(this.selectedEl.style.height || 0).toFixed(1);

    const data = this.customData[key] || {};
    if (labelInp) {
      const lblEl = this.selectedEl.querySelector('.hotspot-label');
      labelInp.value = data.label || (lblEl ? lblEl.textContent.trim() : key);
    }
    if (dialogueInp) {
      dialogueInp.value = data.dialogue || this.selectedEl.getAttribute('data-dialogue') || '';
    }
    const dialogueAfterInp = document.getElementById('cal-inp-dialogue-after');
    if (dialogueAfterInp) {
      dialogueAfterInp.value = data.dialogue_after || this.selectedEl.getAttribute('data-dialogue-after') || '';
    }
  }

  updateResizeHandlePosition() {
    const handle = document.getElementById('calibrator-resize-handle');
    if (!handle) return;

    if (!this.isActive || !this.selectedEl) {
      handle.style.display = 'none';
      return;
    }

    const rect = this.selectedEl.getBoundingClientRect();
    handle.style.display = 'block';
    handle.style.left = `${rect.right - 10}px`;
    handle.style.top = `${rect.bottom - 10}px`;
  }

  startDragging(e, el) {
    this.isDragging = true;
    this.isResizing = false;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;

    const parent = el.closest('.room-scene');
    this.currentParentRect = parent.getBoundingClientRect();

    this.initialLeft = parseFloat(el.style.left) || 0;
    this.initialTop = parseFloat(el.style.top) || 0;
  }

  onDragMove(e) {
    if (!this.isDragging || !this.selectedEl || !this.currentParentRect) return;

    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;

    const deltaPctX = (deltaX / this.currentParentRect.width) * 100;
    const deltaPctY = (deltaY / this.currentParentRect.height) * 100;

    let newLeft = Math.max(0, Math.min(100, this.initialLeft + deltaPctX));
    let newTop = Math.max(0, Math.min(100, this.initialTop + deltaPctY));

    this.selectedEl.style.left = `${newLeft.toFixed(1)}%`;
    this.selectedEl.style.top = `${newTop.toFixed(1)}%`;

    this.syncInputsWithSelected();
    this.updateResizeHandlePosition();
  }

  startResizing(e) {
    this.isResizing = true;
    this.isDragging = false;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;

    const parent = this.selectedEl.closest('.room-scene');
    this.currentParentRect = parent.getBoundingClientRect();

    this.initialWidth = parseFloat(this.selectedEl.style.width) || 10;
    this.initialHeight = parseFloat(this.selectedEl.style.height) || 10;
  }

  onResizeMove(e) {
    if (!this.isResizing || !this.selectedEl || !this.currentParentRect) return;

    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;

    const deltaPctW = (deltaX / this.currentParentRect.width) * 100;
    const deltaPctH = (deltaY / this.currentParentRect.height) * 100;

    let newW = Math.max(2, Math.min(100, this.initialWidth + deltaPctW));
    let newH = Math.max(2, Math.min(100, this.initialHeight + deltaPctH));

    this.selectedEl.style.width = `${newW.toFixed(1)}%`;
    this.selectedEl.style.height = `${newH.toFixed(1)}%`;

    this.syncInputsWithSelected();
    this.updateResizeHandlePosition();
  }

  bindPanelDrag() {
    const handle = document.getElementById('cal-panel-drag-handle');
    const panel = document.getElementById('calibrator-floating-panel');
    if (!handle || !panel) return;

    let isPanelDragging = false;
    let pStartX = 0;
    let pStartY = 0;
    let pInitLeft = 0;
    let pInitTop = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.id === 'btn-cal-close' || e.target.closest('button')) return;
      isPanelDragging = true;
      pStartX = e.clientX;
      pStartY = e.clientY;

      const rect = panel.getBoundingClientRect();
      pInitLeft = rect.left;
      pInitTop = rect.top;
      panel.style.transform = 'none';
      panel.style.left = `${pInitLeft}px`;
      panel.style.top = `${pInitTop}px`;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanelDragging) return;
      const dx = e.clientX - pStartX;
      const dy = e.clientY - pStartY;
      panel.style.left = `${pInitLeft + dx}px`;
      panel.style.top = `${pInitTop + dy}px`;
      panel.style.right = 'auto';
    });

    window.addEventListener('mouseup', () => {
      isPanelDragging = false;
    });
  }

  collectAllData() {
    const data = {
      savedAt: new Date().toLocaleString('vi-VN'),
      hotspots: {}
    };

    document.querySelectorAll('.hotspot[data-hotspot]').forEach(el => {
      const key = el.getAttribute('data-hotspot');
      if (key) {
        const meta = this.customData[key] || {};
        const lblEl = el.querySelector('.hotspot-label');
        const imgEl = el.querySelector('img');
        data.hotspots[key] = {
          left: el.style.left || '0%',
          top: el.style.top || '0%',
          width: el.style.width || '10%',
          height: el.style.height || '10%',
          label: meta.label || (lblEl ? lblEl.textContent.trim() : key),
          dialogue: meta.dialogue || el.getAttribute('data-dialogue') || '',
          dialogue_after: meta.dialogue_after || el.getAttribute('data-dialogue-after') || '',
          src: meta.src || (imgEl ? imgEl.getAttribute('src') : undefined)
        };
      }
    });

    return data;
  }

  renderAllDialoguesList() {
    const listEl = document.getElementById('cal-all-dialogues-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    [1, 2, 3].forEach(roomNum => {
      const roomHead = document.createElement('div');
      roomHead.style.cssText = 'color: var(--gold-warm); font-weight: 700; margin: 10px 0 6px; font-size: 0.85rem; border-bottom: 1px dashed #7f4f24; padding-bottom: 3px;';
      roomHead.innerText = `🛋️ PHÒNG ${roomNum}`;
      listEl.appendChild(roomHead);

      Object.entries(this.customData).forEach(([key, meta]) => {
        if (meta.room !== roomNum) return;

        const card = document.createElement('div');
        card.style.cssText = 'background: rgba(38, 22, 14, 0.85); border: 1.5px solid var(--brown-toffee); border-radius: 12px; padding: 12px 14px; margin-bottom: 12px;';

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 700; color: #fdf0d5; font-size: 0.9rem;">${meta.label || key} <code style="color: #ffd166; font-size: 0.78rem;">[${key}]</code></span>
            <span style="font-size: 0.74rem; background: rgba(243, 202, 126, 0.15); color: #ffd166; padding: 2px 10px; border-radius: 99px; border: 1px solid rgba(243, 202, 126, 0.3);">Phòng ${meta.room}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.76rem; font-weight: 600; color: #ffd166; margin-bottom: 4px;">💬 Thoại 1 (Chưa kích hoạt / Trước khi mở / Click 1):</label>
              <textarea class="cal-textarea all-d1-input" data-item-key="${key}" style="min-height: 56px; font-size: 0.82rem; width: 100%;">${meta.dialogue || ''}</textarea>
            </div>
            <div>
              <label style="display: block; font-size: 0.76rem; font-weight: 600; color: #4cd137; margin-bottom: 4px;">✨ Thoại 2 (Đã kích hoạt / Sau khi mở / Click 2):</label>
              <textarea class="cal-textarea all-d2-input" data-item-key="${key}" style="min-height: 56px; font-size: 0.82rem; width: 100%;">${meta.dialogue_after || ''}</textarea>
            </div>
          </div>
        `;

        const d1Inp = card.querySelector('.all-d1-input');
        d1Inp.addEventListener('input', (e) => {
          this.customData[key].dialogue = e.target.value;
          const el = document.querySelector(`.hotspot[data-hotspot="${key}"]`);
          if (el) el.setAttribute('data-dialogue', e.target.value);
          if (this.selectedEl === el) {
            const curInp = document.getElementById('cal-inp-dialogue');
            if (curInp) curInp.value = e.target.value;
          }
        });

        const d2Inp = card.querySelector('.all-d2-input');
        d2Inp.addEventListener('input', (e) => {
          this.customData[key].dialogue_after = e.target.value;
          const el = document.querySelector(`.hotspot[data-hotspot="${key}"]`);
          if (el) el.setAttribute('data-dialogue-after', e.target.value);
          if (this.selectedEl === el) {
            const curInp2 = document.getElementById('cal-inp-dialogue-after');
            if (curInp2) curInp2.value = e.target.value;
          }
        });

        listEl.appendChild(card);
      });
    });
  }

  async saveAllDataToServer() {
    const saveBtn = document.getElementById('btn-save-coordinates');
    if (saveBtn) {
      saveBtn.innerText = '⏳ Đang lưu dữ liệu...';
      saveBtn.disabled = true;
    }

    const payload = this.collectAllData();

    try {
      const resp = await fetch('/api/save-coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const res = await resp.json();
      if (res.success) {
        this.showSuccessNotification(payload);
      } else {
        alert('Lỗi lưu: ' + (res.error || 'Không xác định'));
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ để lưu: ' + err.message);
    } finally {
      if (saveBtn) {
        saveBtn.innerText = '💾 Ổn rồi, ghi nhớ toạ độ & nội dung này!';
        saveBtn.disabled = false;
      }
    }
  }

  showSuccessNotification(payload) {
    const modalId = 'calibrator-success-modal';
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'custom-modal-backdrop active';
      document.body.appendChild(modal);
    } else {
      modal.classList.add('active');
    }

    const count = Object.keys(payload.hotspots).length;

    modal.innerHTML = `
      <div class="custom-modal-window" style="max-width: 520px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 10px;">✨ 💾 ✨</div>
        <h3 class="modal-title" style="color: #ffd166; font-size: 1.35rem; margin-bottom: 8px;">
          ĐÃ GHI NHỚ TOẠ ĐỘ & NỘI DUNG!
        </h3>
        <p style="color: #fdf0d5; font-size: 0.95rem; line-height: 1.6; margin-bottom: 18px;">
          Đã cập nhật toàn bộ tọa độ, nhãn hiển thị và lời thoại của <b>${count} vật phẩm</b> cả 3 căn phòng trực tiếp vào hệ thống!
          <br><br>
          Dù bấm <b>F11 toàn màn hình</b> hay thay đổi kích thước cửa sổ, mọi vật phẩm sẽ luôn giữ đúng vị trí và lời thoại như bạn đã đặt.
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button id="btn-modal-done" class="game-btn">
            🥰 Tiếp tục trải nghiệm
          </button>
          <button id="btn-modal-reload" class="game-btn btn-secondary">
            🔄 Tải lại trang (F5)
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-modal-done').addEventListener('click', () => {
      modal.classList.remove('active');
      this.deactivate();
    });

    document.getElementById('btn-modal-reload').addEventListener('click', () => {
      window.location.reload();
    });
  }

  copyJsonToClipboard() {
    const payload = this.collectAllData();
    const jsonStr = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert('Đã sao chép toàn bộ cấu hình JSON vào bộ nhớ đệm!\nBạn có thể dán vào chat để gửi cho AI.');
    }).catch(() => {
      prompt('Hãy copy chuỗi JSON này:', jsonStr);
    });
  }
}
