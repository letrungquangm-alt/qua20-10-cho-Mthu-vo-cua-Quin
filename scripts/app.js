import init, { GameEngine } from '../pkg/love_mystery_2010_engine.js';
import { SoundController } from './audio.js';
import { WallGalleryManager } from './wall_gallery.js';
import { initFlowersBloom, startFlowersBloom } from './flowers_bloom.js';

let engine = null;
let wallGallery = null;
const sound = new SoundController();
let dogKeyCollected = false;

function hasItem(id) {
  if (!engine) return false;
  if (typeof engine.has_item === 'function') {
    return engine.has_item(id);
  }
  const inv = typeof engine.get_inventory === 'function' ? engine.get_inventory() : (engine.inventory || []);
  return inv.some(item => item && item.id === id);
}

// Trạng thái cho các Modal giải đố
const woodenDials = [0, 0, 0, 0];
const chestDials = [0, 0, 0, 0];

const jewelrySymbols = [0, 0, 0, 0];
const JEWELRY_ICONS = [
  'assets/ui/icon_rose.png',   // 0: 🌹
  'assets/ui/icon_crown.png',  // 1: 👑
  'assets/ui/icon_heart.png',  // 2: 💖
  'assets/ui/icon_ring.png',   // 3: 💍
  'assets/ui/icon_clover.png', // 4: 🍀
  'assets/ui/icon_star.png'    // 5: ⭐
];

let safeInputText = '';

const ROOM_NAMES = {
  1: 'Phòng 1: Phòng Khách Ngập Hoa 🌹',
  2: 'Phòng 2: Bàn Trang Điểm & Tủ Bí Mật 💄',
  3: 'Phòng 3: Ban Công Ánh Nến & Bầu Trời Đêm 🕯️'
};

const LOVE_LETTER_TEXT = `Chào vợ. HÌ là anh Quin yêu vợ nè, chà nay là 20/10 rồi đúng hong taaaa. năm nay là năm đầu anh đón dịp lễ này cùng vợ anh luôn mong rằng mai sau vẫn sẽ mãi như vậy.

Lời đầu tiên thì anh chúc vợ 20/10 này thật vui vẻ và hạnh phúc bên gia đình và người thân nhéeeee. Vợ thì vợ giỏi lắm á, anh biết vợ cực rất nhiều, cố gắng rất nhiều nhưng anh mong rằng vợ không quá ngợp những thứ mà vợ đang mang, vợ cứ nhớ rằng anh luôn bên cạnh vợ dỗ dành hỏi han chăm sóc vợ, có mệt gì đó cứ ôm anh mà khóc thật lớn anh không thấy phiền hay gì đâu ạ vợ đáng yêu lắm.

Anh cũng xin lỗi vợ vì đã làm em suy nghĩ và lo cho anh đến mức mà vợ mệt, anh trẻ con là thật nhưng yêu em cũng là thật thương em và thích em cũng là thật ạ, anh sẽ thật cố gắng để vợ ít mệt hơn và càng yêu thương vợ nhiều hơn nữa, sẽ thật cố vì tương tai của chúng ta.

Tiếp theo anh chúc 20/10 này mọi chuyện tốt đẹp luôn đến để xoa dịu một cách thật nhẹ nhàng chữa lành em của quá khứ hiện tại và tương lai. Chúc em yêu anh cảm thấy nhẹ lòng và an ủi nhất. Hì anh xin lỗi nhưng đến dòng này tự nhiên nước mắt anh rơi, anh cũng không rõ nữa nhưng thật sự mà nói anh yêu vợ lắm đấy, cực vợ quá à nen phải thật cố gắng nhé ạ.

Vợ đã chạy rồi anh cũng hong đứng im được nên là Quin Yêu Minh Thư lắm óoooooo, sẽ cưới em và không bao giờ bỏ em, Anh thề đấy. 20/10 này thật vui và hạnh phúc nhé vợ ơi. Anh yêu vợ lắm đó.

Ký tên: Quin thật lòng yêu em <3`;

async function bootstrapGame() {
  await init();
  engine = new GameEngine();

  bindNavigation();
  bindHotspots();
  bindModalControls();
  createFallingPetals(25);
  initFlowersBloom();
  renderInventory();
  updateRoomView(1);
  updateSceneSprites();

  // Khởi tạo bộ sưu tập tranh treo tường tất cả các hướng
  wallGallery = new WallGalleryManager(sound);

  // Khóa tỷ lệ khung hình chuẩn 511:287 cho sân khấu game (chống co giãn khi F11)
  fitGameStage();
  window.addEventListener('resize', fitGameStage);
  document.addEventListener('fullscreenchange', fitGameStage);

  // Bắt đầu phát Nhạc Phase 1: Every Summertime
  sound.setMusicPhase(1);

  showDialogue("Chào mừng MThư yêu dấu đến với căn phòng bí ẩn 20/10! Anh Quin đã chuẩn bị một bất ngờ lớn dành cho vợ đó, cùng khám phá nha! ❤️");
}

/* ========================================================
   CĂN CHỈNH SÂN KHẤU (GAME STAGE) KHÓA TỶ LỆ 511:287
   ======================================================== */
export function fitGameStage() {
  const viewport = document.querySelector('.game-viewport');
  const stage = document.getElementById('game-stage');
  if (!viewport || !stage) return;

  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (vw <= 0 || vh <= 0) return;

  const targetRatio = 511 / 287; // Tỷ lệ chuẩn gốc của cả 3 ảnh nền
  let w = vw;
  let h = vw / targetRatio;

  if (h > vh) {
    h = vh;
    w = vh * targetRatio;
  }

  stage.style.width = `${Math.floor(w)}px`;
  stage.style.height = `${Math.floor(h)}px`;
}

/* ========================================================
   ĐIỀU HƯỚNG PHÒNG & ÂM NHẠC
   ======================================================== */
function bindNavigation() {
  document.getElementById('btn-prev-room').addEventListener('click', () => {
    changeRoom(engine.get_room() - 1);
  });

  document.getElementById('btn-next-room').addEventListener('click', () => {
    changeRoom(engine.get_room() + 1);
  });

  document.querySelectorAll('[data-goto-room]').forEach(el => {
    el.addEventListener('click', () => {
      const targetRoom = parseInt(el.getAttribute('data-goto-room'), 10);
      changeRoom(targetRoom);
    });
  });

  // Nút Nhạc Header
  const musicPill = document.getElementById('music-status-pill');
  if (musicPill) {
    musicPill.addEventListener('click', () => {
      const isPlaying = sound.toggleMute();
      musicPill.classList.toggle('muted', !isPlaying);
      const label = document.getElementById('music-track-title');
      if (label && !isPlaying) {
        label.innerText = 'Đã Tạm Dừng Nhạc';
      } else if (label) {
        label.innerText = sound.PHASE_CONFIG[sound.currentPhase].title;
      }
    });
  }

  // Nút Gợi Ý Của Quin
  document.getElementById('btn-husband-hint').addEventListener('click', () => {
    askHusbandHint();
  });
}

function changeRoom(newRoom) {
  if (newRoom < 1 || newRoom > 3) return;
  sound.play('click');
  engine.set_room(newRoom);
  updateRoomView(newRoom);
  setTimeout(fitGameStage, 20);
}

function updateRoomView(room) {
  document.querySelectorAll('.room-scene').forEach(scene => {
    scene.classList.remove('active');
  });
  const currentScene = document.getElementById(`room-scene-${room}`);
  if (currentScene) currentScene.classList.add('active');

  document.getElementById('room-indicator').innerText = ROOM_NAMES[room] || `Phòng ${room}`;

  document.getElementById('btn-prev-room').disabled = (room === 1);
  document.getElementById('btn-next-room').disabled = (room === 3);
}

/* ========================================================
   HOTSPOTS & TƯƠNG TÁC TỪNG VẬT THỂ
   ======================================================== */
const viewedPaintings = new Set();

function isHotspotActiveOrUnlocked(target) {
  if (!engine) return false;
  switch (target) {
    case 'dog':
      return !!(engine.dog_fed || engine.dog_key_collected);
    case 'dog_key':
      return !!(dogKeyCollected || hasItem('small_key') || (engine.used_items && engine.used_items.includes('small_key')) || engine.box1_unlocked);
    case 'teddy':
      return !!engine.took_dog_bone;
    case 'wooden_box':
      return !!engine.box1_unlocked;
    case 'lipstick':
      return !!(hasItem('lipstick') || engine.paper_rubbed);
    case 'paper':
      return !!engine.paper_rubbed;
    case 'jewelry_box':
      return !!engine.jbox_unlocked;
    case 'safe':
      return !!engine.safe_unlocked;
    case 'candle':
      return !!engine.candle_lit;
    case 'switch':
      return !!engine.lights_powered;
    case 'final_chest':
      return !!engine.chest_unlocked;
    case 'mirror':
      return !!(hasItem('safe_key') || engine.safe_unlocked);
    case 'calendar':
      return !!document.getElementById('flipping-calendar')?.classList.contains('flipped');
    case 'painting_couple':
    case 'painting_frame2':
    case 'painting_stars':
    case 'painting_gau':
    case 'painting_clue':
      return viewedPaintings.has(target);
    default:
      return false;
  }
}

function getHotspotDialogue(el, target, isJustUnlocked = false) {
  const isActivated = isJustUnlocked || isHotspotActiveOrUnlocked(target);
  const dBefore = el.getAttribute('data-dialogue');
  const dAfter = el.getAttribute('data-dialogue-after');
  if (isActivated && dAfter) {
    return dAfter;
  }
  return dBefore || dAfter || null;
}

function bindHotspots() {
  // Tờ Lịch 20/10 lật trang 3D (27/09/2007 ➔ 20/10/2026)
  const calHotspot = document.getElementById('calendar-hotspot');
  const calEl = document.getElementById('flipping-calendar');
  if (calHotspot && calEl) {
    calHotspot.addEventListener('click', () => {
      calEl.classList.toggle('flipped');
      sound.play('click');
      const isFlipped = calEl.classList.contains('flipped');
      const dBefore = calHotspot.getAttribute('data-dialogue');
      const dAfter = calHotspot.getAttribute('data-dialogue-after');
      const chosen = isFlipped ? (dAfter || dBefore) : (dBefore || dAfter);
      showDialogue(chosen || "Lịch đã xé tới 20/10/2026, chúc vợ 20/10 vui vẻ ạaaa gửi tới Mẹ Ái và ngoại giúp anh lun nhaaaaa :3333");
    });
  }

  document.querySelectorAll('.hotspot[data-hotspot]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-hotspot');

      // Bỏ qua nếu là click vào lịch (đã có handler riêng)
      if (target === 'calendar') return;

      const dBefore = el.getAttribute('data-dialogue');
      const dAfter = el.getAttribute('data-dialogue-after');

      // 1A. TƯƠNG TÁC VỚI GẤU BÔNG NÂU (PHÒNG 2)
      if (target === 'teddy') {
        if (!engine.took_dog_bone) {
          engine.took_dog_bone = true;
          engine.add_item('dog_bone', 'Xương Gặm Cho Bé Gấu', 'assets/items/dog_bone.png');
          sound.play('pickup');
          updateSceneSprites();
          renderInventory();
          showDialogue(dBefore || "Quin này nhìn hơi lạ =)))) nhưng hình như trong túi có gì đó, à thì ra là xương gậm cho Gấu nè");
        } else {
          sound.play('click');
          showDialogue(dAfter || "Túi áo của chú gấu bông nâu đã trống sau khi lấy xương gặm rồi 🧸");
        }
        return;
      }

      // 1. TƯƠNG TÁC VỚI CÚN ĐEN TAI CỤP (BÉ GẤU) (PHÒNG 1)
      if (target === 'dog') {
        const isDogSitting = engine.dog_fed || engine.dog_key_collected;
        if (!isDogSitting) {
          const selected = engine.get_selected_item();
          const hasBone = hasItem('dog_bone');
          if (selected === 'dog_bone' || hasBone) {
            // Cho Bé Gấu ăn bánh gặm
            if (typeof engine.consume_selected_item === 'function') {
              if (selected === 'dog_bone') {
                engine.consume_selected_item('dog_bone');
              } else {
                engine.select_item('dog_bone');
                engine.consume_selected_item('dog_bone');
              }
            } else {
              engine.inventory = (engine.inventory || []).filter(i => i.id !== 'dog_bone');
            }
            engine.dog_fed = true;
            sound.play('unlock');
            updateSceneSprites();
            renderInventory();
            showDialogue("Bé Gấu ăn bánh gặm ngon lành rồi ngoan ngoãn ngồi dậy kìa vợ! Chiếc chìa khóa đồng rơi ra ngay bên cạnh nó đó! 🐶🔑");
          } else {
            sound.play('click');
            showDialogue(dBefore || "Má, con gấu nó đang ngủ say đè trên chìa khoá kìa vợ, lấy bánh gặm trong túi gấu bông cho nó ăn xem sao nhen");
          }
        } else {
          // Chó đã ngồi dậy
          const keyAlreadyTaken = dogKeyCollected || hasItem('small_key') || (engine.used_items && engine.used_items.includes('small_key')) || engine.box1_unlocked;
          if (!keyAlreadyTaken) {
            sound.play('click');
            showDialogue("Chiếc chìa khóa đồng đang nằm ngay bên cạnh Bé Gấu kìa vợ ơi! Nhấp vào chìa khóa để nhặt nha! 🔑");
          } else {
            sound.play('click');
            showDialogue(dAfter || "Khổ thân vợ tui, nó nặng như quỷ =)))))) giờ có ùi làm gì tiếp đây?");
          }
        }
        return;
      }

      // 1B. NHẶT CHÌA KHÓA RƠI BÊN CẠNH BÉ GẤU
      if (target === 'dog_key') {
        dogKeyCollected = true;
        if (!hasItem('small_key') && !(engine.used_items && engine.used_items.includes('small_key')) && !engine.box1_unlocked) {
          engine.add_item("small_key", "Chìa Khóa Đồng Nhỏ", "assets/items/small_key.png");
        }
        sound.play('pickup');
        updateSceneSprites();
        renderInventory();
        showDialogue(dAfter || "Khổ thân vợ tui, nó nặng như quỷ =)))))) giờ có ùi làm gì tiếp đây?");
        return;
      }

      // 1C. TƯƠNG TÁC VỚI TỜ GIẤY NỤ HÔN SON (HƠ DƯỚI NẾN ĐỂ HIỆN MẬT MÃ)
      if (target === 'paper') {
        if (!engine.paper_rubbed) {
          if (engine.candle_lit) {
            engine.paper_rubbed = true;
            sound.play('unlock');
            updateSceneSprites();
            renderInventory();
            showDialogue("Hơ tờ giấy nụ hôn dưới ngọn nến thơm ấm áp, dòng chữ mật mã tình yêu hiện ra rõ nét: V - O - Y - E - U! Mật mã mở két sắt đó vợ ơi! 📄💋");
          } else {
            sound.play('click');
            showDialogue(dBefore || "Tờ giấy in dấu nụ hôn môi son đỏ thắm thật quyến rũ. Hãy thắp nến thơm ngoài ban công và hơ tờ giấy qua hơi nóng để làm hiện mật mã ẩn giấu nha! 💋🕯️");
          }
        } else {
          sound.play('click');
          showDialogue(dAfter || "Tờ giấy hiện rõ 5 chữ cái tình yêu: V - O - Y - E - U! Mật mã mở két sắt đó vợ ơi! 📄💋");
        }
        return;
      }

      // 2. TƯƠNG TÁC VỚI NẾN THƠM & TỜ THIỆP CẢM NHIỆT (BAN CÔNG)
      if (target === 'candle') {
        const selected = engine.get_selected_item();
        if (!engine.candle_lit && selected === 'lighter') {
          const result = engine.interact_hotspot('candle');
          sound.play(result.sound_effect);
          updateSceneSprites();
          renderInventory();
          showDialogue(dAfter || result.message);
        } else {
          sound.play('click');
          if (engine.candle_lit) {
            showDialogue(dAfter || "Thiệp cảm nhiệt dưới ánh nến hiện 4 biểu tượng: 🌹 Hoa hồng - 👑 Vương miện - 💖 Trái tim - 💎 Kim cương.");
          } else {
            showDialogue(dBefore || "Cây nến thơm chưa thắp lửa, bên dưới có tấm thiệp in mực cảm nhiệt.");
          }
        }
        openInspectCardModal();
        return;
      }

      // 3. MỞ MODAL NẾU LÀ CÁC HỘP KHÓA CÂU ĐỐ
      if (['wooden_box', 'jewelry_box', 'safe', 'final_chest'].includes(target)) {
        const isUnlocked = isHotspotActiveOrUnlocked(target);
        const dlg = isUnlocked ? (dAfter || dBefore) : (dBefore || dAfter);
        if (dlg) {
          showDialogue(dlg);
        }
        openCustomModal(`modal-${target}`);
        sound.play('click');
        return;
      }

      // 4. MỞ BỘ SƯU TẬP TRANH KHI NHẤP VÀO KHUNG TRANH TƯỜNG
      if (['painting_couple', 'painting_frame2', 'painting_stars', 'painting_gau', 'painting_clue'].includes(target)) {
        const isViewed = viewedPaintings.has(target);
        const dlg = isViewed ? (dAfter || dBefore) : (dBefore || dAfter);
        if (dlg) {
          showDialogue(dlg);
        }
        viewedPaintings.add(target);
        if (wallGallery) {
          wallGallery.open(target);
        }
        return;
      }

      // 5. XỬ LÝ TƯƠNG TÁC THÔNG QUA ENGINE CHO CÁC VẬT THỂ CÒN LẠI (VÍ DỤ GẤU BÔNG, SON, GIẤY, NGUỒN ĐIỆN...)
      const wasUnlocked = isHotspotActiveOrUnlocked(target);
      const result = engine.interact_hotspot(target);
      sound.play(result.sound_effect);
      updateSceneSprites();
      renderInventory();

      const isNowUnlocked = isHotspotActiveOrUnlocked(target);
      if (isNowUnlocked || (result.success && result.sound_effect === 'unlock')) {
        showDialogue(dAfter || result.message);
      } else {
        showDialogue(dBefore || result.message);
      }
    });
  });
}

function updateSceneSprites() {
  // Đổi ảnh Gấu bông nâu: Ban đầu có bánh gặm (teddy_with_bone.png), sau khi lấy xương thì rỗng (teddy_empty.png)
  const teddyImg = document.getElementById('sprite-teddy');
  if (teddyImg) {
    if (engine.took_dog_bone) {
      teddyImg.src = 'assets/sprites/teddy_empty.png';
      teddyImg.classList.remove('with-bone');
    } else {
      teddyImg.src = 'assets/sprites/teddy_with_bone.png';
      teddyImg.classList.add('with-bone');
    }
  }

  // Đổi ảnh Cún đen tai cụp (Bé Gấu) - Ngủ say đè chìa khoá (dog_happy.png), cho ăn xong ngồi dậy to hơn xíu (dog_guard.png + .dog-sitting)
  const isDogSitting = engine.dog_fed || engine.dog_key_collected;
  const dogImg = document.getElementById('sprite-dog');
  if (dogImg) {
    if (isDogSitting) {
      dogImg.src = 'assets/sprites/dog_guard.png';
      dogImg.classList.add('dog-sitting');
    } else {
      dogImg.src = 'assets/sprites/dog_happy.png';
      dogImg.classList.remove('dog-sitting');
    }
  }

  // Chìa khóa rơi bên cạnh cún (chỉ hiện khi chó ngồi dậy VÀ chìa chưa được nhặt, nhặt rồi xóa khỏi phòng)
  const keyHotspot = document.getElementById('dog-key-hotspot');
  if (keyHotspot) {
    const keyAlreadyTaken = dogKeyCollected || hasItem('small_key') || (engine.used_items && engine.used_items.includes('small_key')) || engine.box1_unlocked;
    if (isDogSitting && !keyAlreadyTaken) {
      keyHotspot.style.display = 'block';
    } else {
      keyHotspot.style.display = 'none';
    }
  }

  // Đổi ảnh Hộp gỗ khi đã mở
  if (engine.box1_unlocked) {
    const boxImg = document.getElementById('sprite-wooden-box');
    if (boxImg) boxImg.src = 'assets/sprites/wooden_box_open.png';
  }

  // Đổi ảnh Hộp trang sức khi đã mở
  if (engine.jbox_unlocked) {
    const jBoxImg = document.getElementById('sprite-jewelry-box');
    if (jBoxImg) jBoxImg.src = 'assets/sprites/jewelry_box_open.png';
  }

  // Đổi ảnh Két sắt khi đã mở
  if (engine.safe_unlocked) {
    const safeImg = document.getElementById('sprite-safe');
    if (safeImg) safeImg.src = 'assets/sprites/safe_open.png';
  }

  // Đổi ảnh Rương báu khi đã mở
  if (engine.chest_unlocked) {
    const chestImg = document.getElementById('sprite-chest');
    if (chestImg) chestImg.src = 'assets/sprites/chest_open.png';
  }

  // Tờ giấy chữ chìm sau khi thoa son
  if (engine.paper_rubbed) {
    const paperImg = document.getElementById('sprite-paper');
    if (paperImg) {
      paperImg.src = 'assets/sprites/paper_voyeu.png';
      paperImg.classList.add('revealed');
    }
  }

  // Nến thơm sau khi thắp lửa
  if (engine.candle_lit) {
    const candleImg = document.getElementById('sprite-candle');
    if (candleImg) candleImg.classList.add('lit');
  }

  // Hộp nguồn sau khi lắp pin & BẬT SÁNG NỀN PHÒNG 3 (kèm đàn đom đóm bay lơ lửng)
  const room3 = document.getElementById('room-scene-3');
  const switchImg = document.getElementById('sprite-switch');
  if (engine.lights_powered) {
    if (switchImg) switchImg.classList.add('switch-powered');
    if (room3) {
      room3.classList.add('lights-on');
      spawnFireflyParticles();
    }
  } else {
    if (switchImg) switchImg.classList.remove('switch-powered');
    if (room3) room3.classList.remove('lights-on');
  }

  // Cập nhật giao diện bên trong các modal giải đố
  updateModalUnlockedStates();
}

function updateModalUnlockedStates() {
  // 1. Hộp Gỗ
  if (engine.box1_unlocked) {
    const visual = document.getElementById('visual-wooden-box');
    if (visual) {
      visual.style.backgroundImage = "url('assets/sprites/wooden_box_open.png')";
      visual.classList.add('visual-unlocked');
    }
    const modal = document.getElementById('modal-wooden_box');
    if (modal) {
      const sub = modal.querySelector('.modal-subtitle');
      if (sub) sub.innerHTML = '✨ <b style="color: #4cd137;">ĐÃ MỞ THÀNH CÔNG!</b> Bật Lửa Trái Tim & Thỏi Son Đỏ đã được cất vào Túi Đồ.';
      const submitBtn = document.getElementById('btn-submit-wood');
      if (submitBtn) {
        submitBtn.innerHTML = '<img src="assets/ui/btn_submit_wide.png" alt="Submit"><span>✨ Hộp Gỗ Đã Mở ✨</span>';
        submitBtn.style.opacity = '0.7';
      }
    }
  }

  // 2. Hộp Trang Sức
  if (engine.jbox_unlocked) {
    const visual = document.getElementById('visual-jewelry-box');
    if (visual) {
      visual.style.backgroundImage = "url('assets/sprites/jewelry_box_open.png')";
      visual.classList.add('visual-unlocked');
    }
    const modal = document.getElementById('modal-jewelry_box');
    if (modal) {
      const sub = modal.querySelector('.modal-subtitle');
      if (sub) sub.innerHTML = '✨ <b style="color: #4cd137;">ĐÃ MỞ THÀNH CÔNG!</b> Pin Trái Tim & Mảnh Tim (Trái) đã được cất vào Túi Đồ.';
      const submitBtn = document.getElementById('btn-submit-jewelry');
      if (submitBtn) {
        submitBtn.innerHTML = '<img src="assets/ui/btn_submit_wide.png" alt="Submit"><span>✨ Hộp Trang Sức Đã Mở ✨</span>';
        submitBtn.style.opacity = '0.7';
      }
    }
  }

  // 3. Két Sắt
  if (engine.safe_unlocked) {
    const visual = document.getElementById('visual-safe');
    if (visual) {
      visual.style.backgroundImage = "url('assets/sprites/safe_open.png')";
      visual.classList.add('visual-unlocked');
    }
    const modal = document.getElementById('modal-safe');
    if (modal) {
      const sub = modal.querySelector('.modal-subtitle');
      if (sub) sub.innerHTML = '✨ <b style="color: #4cd137;">ĐÃ MỞ THÀNH CÔNG!</b> Mảnh Trái Tim Vàng (Phải) đã được cất vào Túi Đồ.';
      const display = document.getElementById('safe-code-display');
      if (display) display.innerText = 'V O Y E U  -  ĐÃ MỞ';
    }
  }

  // 4. Rương Báu Đại Lễ
  if (engine.chest_unlocked) {
    const visual = document.getElementById('visual-chest');
    if (visual) {
      visual.style.backgroundImage = "url('assets/sprites/chest_open.png')";
      visual.classList.add('visual-unlocked');
    }
    const modal = document.getElementById('modal-final_chest');
    if (modal) {
      const sub = modal.querySelector('.modal-subtitle');
      if (sub) sub.innerHTML = '👑 <b style="color: #ffd700;">ĐÃ MỞ TOẢ SÁNG!</b> Bó hoa tình yêu và bức thư bí mật đã xuất hiện.';
      const submitBtn = document.getElementById('btn-submit-chest');
      if (submitBtn) {
        submitBtn.innerHTML = '<img src="assets/ui/btn_submit_wide.png" alt="Submit"><span>👑 Rương Báu Đã Mở 👑</span>';
        submitBtn.style.opacity = '0.7';
      }
    }
  }
}

function spawnFireflyParticles() {
  const overlay = document.getElementById('fairy-lights-overlay');
  if (!overlay || overlay.children.length > 0) return;

  for (let i = 0; i < 20; i++) {
    const f = document.createElement('div');
    f.className = 'firefly-particle';
    const size = Math.random() * 5 + 4;
    f.style.width = `${size}px`;
    f.style.height = `${size}px`;
    f.style.left = `${Math.random() * 95}%`;
    f.style.top = `${Math.random() * 90}%`;
    f.style.animationDuration = `${Math.random() * 3 + 2.5}s, ${Math.random() * 6 + 4}s`;
    f.style.animationDelay = `${Math.random() * 2}s, ${Math.random() * 2}s`;
    overlay.appendChild(f);
  }
}

/* ========================================================
   TÚI ĐỒ (INVENTORY)
   ======================================================== */
function renderInventory() {
  const items = engine.get_inventory();
  const dock = document.getElementById('inventory-dock');
  dock.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';

    if (items[i]) {
      const img = document.createElement('img');
      img.src = items[i].icon_path;
      img.alt = items[i].name;
      slot.appendChild(img);

      const tooltip = document.createElement('div');
      tooltip.className = 'slot-tooltip';
      tooltip.innerText = items[i].name;
      slot.appendChild(tooltip);

      const activeId = engine.get_selected_item();
      if (activeId === items[i].id) {
        slot.classList.add('selected');
      }

      slot.addEventListener('click', () => {
        const selected = engine.select_item(items[i].id);
        sound.play('click');
        renderInventory();
        if (selected) {
          showDialogue(`MThư đang cầm: [${items[i].name}] - Nhấp vào đối tượng trong phòng để dùng nhé!`);
        } else {
          showDialogue(`Đã cất [${items[i].name}] vào túi đồ.`);
        }
      });
    }
    dock.appendChild(slot);
  }
}

/* ========================================================
   ĐIỀU KHIỂN CÁC MODAL GIẢI ĐỐ
   ======================================================== */
function bindModalControls() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
      sound.play('click');
    });
  });

  // Hỗ trợ cuộn chuột trên các bánh lăn đồng
  document.querySelectorAll('.reel-window').forEach(win => {
    win.addEventListener('wheel', (e) => {
      e.preventDefault();
      const reelType = win.getAttribute('data-reel-type');
      const idx = parseInt(win.getAttribute('data-reel-index'), 10);
      const delta = e.deltaY < 0 ? 1 : -1;
      stepDial(reelType, idx, delta);
    });
  });

  // 1. MODAL HỘP GỖ 4 SỐ (5243)
  for (let i = 0; i < 4; i++) {
    const upBtn = document.getElementById(`wood-dial-up-${i}`);
    const downBtn = document.getElementById(`wood-dial-down-${i}`);

    if (upBtn && downBtn) {
      upBtn.addEventListener('click', () => stepDial('wood', i, 1));
      downBtn.addEventListener('click', () => stepDial('wood', i, -1));
    }
  }

  const btnSubmitWood = document.getElementById('btn-submit-wood');
  if (btnSubmitWood) {
    btnSubmitWood.addEventListener('click', () => {
      const res = engine.verify_wooden_box(woodenDials[0], woodenDials[1], woodenDials[2], woodenDials[3]);
      sound.play(res.sound_effect);
      const feedbackEl = document.getElementById('wood-feedback');
      if (res.success) {
        if (feedbackEl) feedbackEl.innerHTML = '';
        const afterDlg = document.querySelector('[data-hotspot="wooden_box"]')?.getAttribute('data-dialogue-after');
        showDialogue(afterDlg || res.message);
        closeAllModals();
        renderInventory();
        updateSceneSprites();
      } else {
        showDialogue(res.message);
        if (feedbackEl) {
          feedbackEl.innerHTML = `⚠️ <b>${res.message}</b><br><span style="font-size:0.83rem;color:#f3ca7e;">Gợi ý: Ngày sinh vợ (27) ghép năm sinh anh (26) ➔ 2 7 2 6</span>`;
          feedbackEl.classList.remove('shake');
          void feedbackEl.offsetWidth;
          feedbackEl.classList.add('shake');
        }
      }
    });
  }

  // 2. MODAL HỘP TRANG SỨC HOÀNG GIA (🌹 👑 💖 💍)
  for (let i = 0; i < 4; i++) {
    const dial = document.getElementById(`jewelry-dial-${i}`);
    if (dial) {
      dial.addEventListener('click', () => {
        jewelrySymbols[i] = (jewelrySymbols[i] + 1) % JEWELRY_ICONS.length;
        const iconImg = dial.querySelector('img');
        if (iconImg) {
          iconImg.src = JEWELRY_ICONS[jewelrySymbols[i]];
        }
        sound.play('click');
      });
    }
  }

  const btnSubmitJewelry = document.getElementById('btn-submit-jewelry');
  if (btnSubmitJewelry) {
    btnSubmitJewelry.addEventListener('click', () => {
      const res = engine.verify_jewelry_box(jewelrySymbols[0], jewelrySymbols[1], jewelrySymbols[2], jewelrySymbols[3]);
      sound.play(res.sound_effect);
      const feedbackEl = document.getElementById('jewelry-feedback');
      if (res.success) {
        if (feedbackEl) feedbackEl.innerHTML = '';
        const afterDlg = document.querySelector('[data-hotspot="jewelry_box"]')?.getAttribute('data-dialogue-after');
        showDialogue(afterDlg || res.message);
        closeAllModals();
        renderInventory();
        updateSceneSprites();
      } else {
        showDialogue(res.message);
        if (feedbackEl) {
          feedbackEl.innerHTML = `⚠️ <b>${res.message}</b><br><span style="font-size:0.83rem;color:#f3ca7e;">Gợi ý từ tấm thiệp: 🌹 Hoa Hồng ➔ 👑 Vương Miện ➔ 💖 Trái Tim ➔ 💍 Kim Cương (Bấm ô 1 để chuyển từ 🍀 sang 🌹 nhé vợ!)</span>`;
          feedbackEl.classList.remove('shake');
          void feedbackEl.offsetWidth;
          feedbackEl.classList.add('shake');
        }
      }
    });
  }

  // 3. MODAL KÉT SẮT CHỮ CÁI (VOYEU)
  const btnSafeKeyhole = document.getElementById('btn-safe-keyhole');
  if (btnSafeKeyhole) {
    btnSafeKeyhole.addEventListener('click', () => {
      const res = engine.insert_safe_key();
      sound.play(res.sound_effect);
      showDialogue(res.message);
      if (res.success) {
        const imgKeyhole = document.getElementById('img-safe-keyhole');
        if (imgKeyhole) imgKeyhole.src = 'assets/ui/keyhole_unlocked.png';
        const label = document.getElementById('safe-keyhole-label');
        if (label) label.innerText = 'Ổ Khóa Cơ: ĐÃ MỞ (Xanh)';
        const statusWrap = document.getElementById('safe-keyhole-status');
        if (statusWrap) statusWrap.classList.add('unlocked');
        btnSafeKeyhole.classList.add('btn-secondary');
        btnSafeKeyhole.innerHTML = '<span>🔑 Đã Mở Khóa Cơ!</span>';
        renderInventory();
      }
    });
  }

  document.querySelectorAll('[data-safe-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-safe-key');
      sound.play('click');
      if (key === 'CLEAR') {
        safeInputText = '';
      } else if (key === 'ENTER') {
        const res = engine.verify_safe_code(safeInputText);
        sound.play(res.sound_effect);
        const feedbackEl = document.getElementById('safe-feedback');
        if (res.success) {
          if (feedbackEl) feedbackEl.innerHTML = '';
          const afterDlg = document.querySelector('[data-hotspot="safe"]')?.getAttribute('data-dialogue-after');
          showDialogue(afterDlg || res.message);
          closeAllModals();
          renderInventory();
          updateSceneSprites();
        } else {
          showDialogue(res.message);
          if (feedbackEl) {
            feedbackEl.innerHTML = `⚠️ <b>${res.message}</b><br><span style="font-size:0.83rem;color:#f3ca7e;">Gợi ý: Dấu nụ hôn môi son hơ nến ➔ V O Y E U (Vợ Yêu)</span>`;
            feedbackEl.classList.remove('shake');
            void feedbackEl.offsetWidth;
            feedbackEl.classList.add('shake');
          }
        }
      } else {
        if (safeInputText.length < 5) {
          safeInputText += key;
        }
      }
      updateSafeDisplay();
    });
  });

  // 4. MODAL RƯƠNG BÁU ĐẠI LỄ 20/10 (2010)
  const slotHeartLeft = document.getElementById('chest-slot-left');
  const slotHeartRight = document.getElementById('chest-slot-right');

  if (slotHeartLeft) {
    slotHeartLeft.addEventListener('click', () => {
      const res = engine.place_chest_heart('left');
      sound.play(res.sound_effect);
      showDialogue(res.message);
      if (res.success) {
        slotHeartLeft.classList.add('filled');
        const img = slotHeartLeft.querySelector('img');
        if (img) img.src = 'assets/items/heart_left.png';
        renderInventory();
      }
    });
  }

  if (slotHeartRight) {
    slotHeartRight.addEventListener('click', () => {
      const res = engine.place_chest_heart('right');
      sound.play(res.sound_effect);
      showDialogue(res.message);
      if (res.success) {
        slotHeartRight.classList.add('filled');
        const img = slotHeartRight.querySelector('img');
        if (img) img.src = 'assets/items/heart_right.png';
        renderInventory();
      }
    });
  }

  for (let i = 0; i < 4; i++) {
    const upBtn = document.getElementById(`chest-dial-up-${i}`);
    const downBtn = document.getElementById(`chest-dial-down-${i}`);

    if (upBtn && downBtn) {
      upBtn.addEventListener('click', () => stepDial('chest', i, 1));
      downBtn.addEventListener('click', () => stepDial('chest', i, -1));
    }
  }

  const btnSubmitChest = document.getElementById('btn-submit-chest');
  if (btnSubmitChest) {
    btnSubmitChest.addEventListener('click', () => {
      const res = engine.verify_final_chest(chestDials[0], chestDials[1], chestDials[2], chestDials[3]);
      sound.play(res.sound_effect);
      const feedbackEl = document.getElementById('chest-feedback');
      if (res.success && res.trigger_win) {
        if (feedbackEl) feedbackEl.innerHTML = '';
        const afterDlg = document.querySelector('[data-hotspot="final_chest"]')?.getAttribute('data-dialogue-after');
        showDialogue(afterDlg || res.message);
        closeAllModals();
        updateSceneSprites();
        // Kích hoạt Phase 2: Xuất hiện bó hoa nở rộ!
        triggerPhase2Bouquet();
      } else {
        showDialogue(res.message);
        if (feedbackEl) {
          feedbackEl.innerHTML = `⚠️ <b>${res.message}</b><br><span style="font-size:0.83rem;color:#f3ca7e;">Gợi ý: Gắn đủ 2 mảnh tim vàng & nhập ngày đại lễ 2 0 1 0</span>`;
          feedbackEl.classList.remove('shake');
          void feedbackEl.offsetWidth;
          feedbackEl.classList.add('shake');
        }
      }
    });
  }

  // Tương tác khi nhấp vào Bó Hoa Nở Rộ hoặc Phong Bì
  const openCardBtn = document.getElementById('openCard');
  if (openCardBtn) {
    openCardBtn.addEventListener('click', () => {
      sound.play('pickup');
      closeAllModals();
      triggerPhase2LoveLetter();
    });
  }

  const btnOpenLetterFromBouquet = document.getElementById('btn-open-letter-from-bouquet');
  if (btnOpenLetterFromBouquet) {
    btnOpenLetterFromBouquet.addEventListener('click', () => {
      sound.play('pickup');
      closeAllModals();
      triggerPhase2LoveLetter();
    });
  }

  const bouquetStage = document.getElementById('bouquetStageWrapper');
  if (bouquetStage) {
    bouquetStage.addEventListener('dblclick', () => {
      sound.play('pickup');
      closeAllModals();
      triggerPhase2LoveLetter();
    });
  }

  // Nút "Ngắm lại bó hoa" từ trong Thư Tình
  const btnBackToBouquet = document.getElementById('btn-back-to-bouquet');
  if (btnBackToBouquet) {
    btnBackToBouquet.addEventListener('click', () => {
      sound.play('click');
      closeAllModals();
      triggerPhase2Bouquet();
    });
  }

  // Nút "Dạ đọc xong òi" -> Kích hoạt Phase 3
  const btnFinishedReading = document.getElementById('btn-finished-reading');
  if (btnFinishedReading) {
    btnFinishedReading.addEventListener('click', () => {
      sound.play('click');
      closeAllModals();
      triggerPhase3Transition();
    });
  }
}

/* ========================================================
   MODAL TỜ THIỆP CẢM NHIỆT (BAN CÔNG)
   ======================================================== */
export function openInspectCardModal() {
  const hintUnlit = document.getElementById('thermal-hint-unlit');
  const cluesLit = document.getElementById('thermal-clues-lit');
  if (engine && engine.candle_lit) {
    if (hintUnlit) hintUnlit.style.display = 'none';
    if (cluesLit) cluesLit.style.display = 'flex';
  } else {
    if (hintUnlit) hintUnlit.style.display = 'block';
    if (cluesLit) cluesLit.style.display = 'none';
  }

  openCustomModal('modal-inspect-card');
}

function stepDial(type, index, delta) {
  const dials = (type === 'wood') ? woodenDials : chestDials;
  dials[index] = (dials[index] + delta + 10) % 10;
  sound.play('click');

  const strip = document.getElementById(`${type}-reel-strip-${index}`);
  if (strip) {
    strip.style.transform = `translateY(-${dials[index] * 70}px)`;
  }
}

function updateSafeDisplay() {
  const display = document.getElementById('safe-code-display');
  if (!display) return;
  let formatted = '';
  for (let i = 0; i < 5; i++) {
    formatted += (safeInputText[i] || '_') + ' ';
  }
  display.innerText = formatted.trim();
}

/* ========================================================
   PHASE 2: BÓ HOA NỞ RỘ (FLOWERS-20-10) & THƯ TÌNH TĨNH
   ======================================================== */
function triggerPhase2Bouquet() {
  setTimeout(() => {
    sound.setMusicPhase(2);
    sound.play('fanfare');
    openCustomModal('modal-bouquet-reveal');
    startFlowersBloom();
  }, 400);
}

function triggerPhase2LoveLetter() {
  // Đổi nhạc sang Phase 2: "Die For You"
  sound.setMusicPhase(2);
  openCustomModal('modal-love-letter');

  // Hiển thị toàn bộ nội dung thư tình của Quin ngay lập tức (bỏ ghi chậm, bỏ lia camera)
  const letterEl = document.getElementById('typewriter-text');
  if (letterEl) {
    letterEl.innerText = LOVE_LETTER_TEXT;
  }

  const finishPrompt = document.getElementById('letter-finish-prompt');
  if (finishPrompt) {
    finishPrompt.style.display = 'block';
  }

  const viewport = document.getElementById('letter-scroll-viewport');
  if (viewport) {
    viewport.scrollTop = 0;
  }
}

/* ========================================================
   PHASE 3: MODAL SẮP SỬA HIỆN LÊN -> TRÁI TIM 3D ĐA NGÔN NGỮ
   ======================================================== */
function triggerPhase3Transition() {
  openCustomModal('modal-transition-suspense');
  sound.play('heartbeat');

  let beatCount = 0;
  const beatTimer = setInterval(() => {
    sound.play('heartbeat');
    beatCount++;
    if (beatCount >= 3) {
      clearInterval(beatTimer);
    }
  }, 700);

  // Sau 2.5 giây, chuyển nhạc sang Phase 3 và mở toàn màn hình
  setTimeout(() => {
    closeAllModals();
    sound.setMusicPhase(3);
    const p3Container = document.getElementById('phase3-fullscreen');
    if (p3Container) {
      p3Container.classList.add('active');
      init3DMultiLanguageHeart();
    }
  }, 2600);
}

/* ========================================================
   CANVAS TRÁI TIM 3D ĐA NGÔN NGỮ
   ======================================================== */
function init3DMultiLanguageHeart() {
  const canvas = document.getElementById('canvas-3d-heart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const LOVE_PHRASES = [
    'I Love You', 'Te Amo', 'Je t\'aime', 'Ti amo', '사랑해', '我爱你',
    '愛してる', 'ฉันรักเธอ', 'Mahal kita', 'Seni seviyorum', 'Eu te amo',
    'Ya tebya lyublyu', 'Kocham Cię', 'Ik hou van jou', 'Aku Cinta Kamu',
    'Ngiyakuthanda', 'Te quiero', 'Amo-te', 'Miluji tě', 'Jeg elsker deg',
    'Jag älskar dig', 'Rakastan sinua', 'S\'agapo', 'Ngo oiy nei',
    'Quin Yêu MThư', 'Quin ❤️ Minh Thư', 'Mãi Bên Nhau', 'Hạnh Phúc 20/10'
  ];

  const points = [];
  const total = 90;

  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const z = (Math.sin(t * 3) * 6);

    points.push({
      x: x * 10,
      y: y * 10,
      z: z * 10,
      text: LOVE_PHRASES[i % LOVE_PHRASES.length],
      color: `hsl(${340 + Math.random() * 40}, 90%, ${70 + Math.random() * 20}%)`,
      size: Math.random() * 3 + 11
    });
  }

  let angleY = 0;
  let heartScale = 1;
  let pulseDir = 0.008;

  function renderHeart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    angleY += 0.015;
    heartScale += pulseDir;
    if (heartScale > 1.15 || heartScale < 0.92) {
      pulseDir = -pulseDir;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 10;

    points.forEach(p => {
      const cosA = Math.cos(angleY);
      const sinA = Math.sin(angleY);

      const rotX = p.x * cosA - p.z * sinA;
      const rotZ = p.x * sinA + p.z * cosA;

      const fov = 320;
      const scale = (fov / (fov + rotZ)) * heartScale;

      const screenX = cx + rotX * scale;
      const screenY = cy + p.y * scale;

      ctx.save();
      ctx.font = `600 ${Math.max(9, p.size * scale)}px 'Montserrat', sans-serif`;
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(255, 117, 140, 0.8)';
      ctx.shadowBlur = 10 * scale;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, screenX, screenY);
      ctx.restore();
    });

    requestAnimationFrame(renderHeart);
  }

  renderHeart();
}

/* ========================================================
   HỆ THỐNG GỢI Ý CỦA QUIN
   ======================================================== */
export function askHusbandHint() {
  sound.play('click');
  const hintText = engine.get_husband_hint();
  const hintBody = document.getElementById('hint-modal-body');
  if (hintBody) hintBody.innerText = hintText;
  openCustomModal('modal-husband-hint');
}

export function openCustomModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
  updateModalUnlockedStates();
}

export function closeAllModals() {
  document.querySelectorAll('.custom-modal-backdrop').forEach(m => m.classList.remove('active'));
}

function showDialogue(text) {
  const box = document.getElementById('dialogue-text');
  if (box) box.innerText = text;
}

/* ========================================================
   CÁNH HOA RƠI LÃNG MẠN
   ======================================================== */
function createFallingPetals(count = 25) {
  const container = document.getElementById('petals-container');
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const size = Math.random() * 12 + 10;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 4 + 4}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(petal);
  }
}

window.addEventListener('DOMContentLoaded', bootstrapGame);
