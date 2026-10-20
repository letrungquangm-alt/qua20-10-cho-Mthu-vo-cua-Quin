// WebAssembly Engine Module for Love Mystery 20/10 (Quin & MThư)
// Mirrors Rust GameEngine logic exactly.

export class GameEngine {
  constructor() {
    this.current_room = 1;
    this.selected_item = null;
    this.inventory = [];
    this.used_items = [];

    // Puzzle flags
    this.took_dog_bone = false;
    this.dog_fed = false;
    this.dog_key_collected = false;
    this.dog_click_count = 0;
    this.box1_unlocked = false;
    this.paper_rubbed = false;
    this.jbox_unlocked = false;
    this.safe_key_inserted = false;
    this.safe_unlocked = false;
    this.candle_lit = false;
    this.lights_powered = false;
    this.heart_left_placed = false;
    this.heart_right_placed = false;
    this.chest_unlocked = false;
  }

  get_room() {
    return this.current_room;
  }

  set_room(room) {
    if (room >= 1 && room <= 3) {
      this.current_room = room;
    }
  }

  get_selected_item() {
    return this.selected_item;
  }

  get_inventory() {
    return this.inventory;
  }

  select_item(item_id) {
    if (this.selected_item === item_id) {
      this.selected_item = null;
    } else {
      this.selected_item = item_id;
    }
    return this.selected_item;
  }

  has_item(id) {
    return this.inventory.some(i => i.id === id);
  }

  add_item(id, name, icon_path) {
    if (!this.inventory.some(i => i.id === id) && !this.used_items.includes(id)) {
      this.inventory.push({ id, name, icon_path });
    }
  }

  consume_selected_item(id) {
    const targetId = id || this.selected_item;
    if (targetId) {
      this.inventory = this.inventory.filter(i => i.id !== targetId);
      if (!this.used_items.includes(targetId)) {
        this.used_items.push(targetId);
      }
      if (this.selected_item === targetId) {
        this.selected_item = null;
      }
    }
  }

  interact_hotspot(target) {
    const selected = this.selected_item || '';
    switch (target) {
      case 'teddy': {
        if (!this.took_dog_bone) {
          this.took_dog_bone = true;
          this.add_item('dog_bone', 'Xương Gặm Cho Bé Gấu', 'assets/items/dog_bone.png');
          return {
            success: true,
            message: 'Chú gấu bông nâu xinh xắn! Trong túi áo gấu có [Xương Gặm Cho Bé Gấu].',
            sound_effect: 'pickup',
            trigger_win: false
          };
        }
        return {
          success: true,
          message: 'Túi của gấu bông nâu đã trống sau khi lấy xương gặm.',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'dog': {
        if (this.dog_key_collected) {
          return {
            success: true,
            message: 'Bé Gấu đã tỉnh dậy mừng rỡ vẫy đuôi bên cạnh chiếc đệm hoa hồng! 🐶✨',
            sound_effect: 'click',
            trigger_win: false
          };
        }

        if (!this.dog_fed && selected === 'dog_bone') {
          this.dog_fed = true;
          this.consume_selected_item('dog_bone');
          this.dog_click_count = 1;
          return {
            success: true,
            message: 'Bé Gấu thích thú ngửi mùi bánh xương và cựa mình! Vợ thử bấm vào người bé lần nữa xem chìa khóa ở đâu nhé!',
            sound_effect: 'unlock',
            trigger_win: false
          };
        }

        this.dog_click_count = (this.dog_click_count || 0) + 1;

        if (this.dog_click_count === 1) {
          return {
            success: true,
            message: 'Má, con gấu nó đang ngủ say đè trên chìa khoá kìa vợ, bấm vào người nó lần nữa để gọi nó dậy lấy chìa khoá nhé!',
            sound_effect: 'click',
            trigger_win: false
          };
        } else {
          // Lần 2: Bé Gấu tỉnh dậy mừng rỡ, nhận chìa khóa!
          this.dog_key_collected = true;
          this.dog_fed = true;
          this.add_item('small_key', 'Chìa Khóa Đồng Nhỏ', 'assets/items/small_key.png');
          return {
            success: true,
            message: 'À hoá ra chìa khoá là ở đây à! Bé Gấu tỉnh dậy mừng rỡ, để lộ chiếc Chìa Khóa Đồng Nhỏ rồi! 🔑',
            sound_effect: 'pickup',
            trigger_win: false
          };
        }
      }
      case 'paper': {
        if (!this.paper_rubbed && selected === 'lipstick') {
          this.paper_rubbed = true;
          this.consume_selected_item('lipstick');
          return {
            success: true,
            message: 'MThư tô son đỏ lên vết hằn trên giấy! Dòng chữ bí mật hiện ra: [ V O Y E U ]',
            sound_effect: 'unlock',
            trigger_win: false
          };
        } else if (this.paper_rubbed) {
          return {
            success: true,
            message: 'Tờ giấy đã hiện rõ 5 chữ cái: V - O - Y - E - U.',
            sound_effect: 'click',
            trigger_win: false
          };
        } else {
          return {
            success: false,
            message: 'Tờ giấy trắng có vết chữ dập nổi không màu. Cần thỏi son đỏ cà lên mới thấy được!',
            sound_effect: 'click',
            trigger_win: false
          };
        }
      }
      case 'candle': {
        if (!this.candle_lit && selected === 'lighter') {
          this.candle_lit = true;
          this.consume_selected_item('lighter');
          return {
            success: true,
            message: 'Ngọn nến ấm áp bùng sáng! Hơi nóng làm thiệp cảm nhiệt hiện rõ: 🌹 ➔ 👑 ➔ 💖 ➔ 💎',
            sound_effect: 'unlock',
            trigger_win: false
          };
        } else if (this.candle_lit) {
          return {
            success: true,
            message: 'Thiệp cảm nhiệt dưới ánh nến hiện 4 biểu tượng: 🌹 Hoa hồng - 👑 Vương miện - 💖 Trái tim - 💎 Kim cương.',
            sound_effect: 'click',
            trigger_win: false
          };
        } else {
          return {
            success: false,
            message: 'Cây nến thơm chưa thắp lửa, bên dưới có tấm thiệp in mực cảm nhiệt.',
            sound_effect: 'click',
            trigger_win: false
          };
        }
      }
      case 'switch': {
        if (!this.lights_powered && selected === 'battery') {
          this.lights_powered = true;
          this.consume_selected_item('battery');
          return {
            success: true,
            message: 'Dây đèn đom đóm bừng sáng rực rỡ lấp lánh dòng chữ: V O Y E U!',
            sound_effect: 'unlock',
            trigger_win: false
          };
        } else if (this.lights_powered) {
          return {
            success: true,
            message: 'Dây đèn đom đóm lấp lánh dòng chữ: V - O - Y - E - U trên nền trời đêm.',
            sound_effect: 'click',
            trigger_win: false
          };
        } else {
          return {
            success: false,
            message: 'Hộp nguồn của dây đèn ban công đang thiếu một viên Pin Trái Tim.',
            sound_effect: 'click',
            trigger_win: false
          };
        }
      }
      case 'calendar': {
        return {
          success: true,
          message: 'Tờ lịch lật sang Ngày 20 Tháng 10 - Ngày Phụ Nữ Việt Nam dành trọn cho MThư! 🌹',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'painting':
      case 'painting_stars': {
        return {
          success: true,
          message: 'Bức tranh Đêm Đầy Sao (Starry Night): lung linh sắc màu dưới bầu trời đêm lãng mạn!',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'painting_couple': {
        return {
          success: true,
          message: 'Ảnh kỷ niệm ngọt ngào của hai đứa mình nè vợ! Chàng trai 2006 (26) và cô gái đáng yêu sinh ngày 27/09/2007 (27)! ❤️',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'painting_gau': {
        return {
          success: true,
          message: 'Chân dung của Bé Gấu cưng nhà mình nè! Bé Gấu thích ăn bánh xương lắm đó vợ ơi! 🐶',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'painting_clue': {
        return {
          success: true,
          message: 'Bức tranh thư pháp hoa hồng 27 & 26: [27] là ngày sinh 27/9 & năm 2007 của vợ, [26] là năm 2006 của anh => Mật mã Hộp Gỗ là 2726!',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'milktea': {
        return {
          success: true,
          message: 'Trên bàn có đúng 2 ly trà sữa trân châu đường đen ngọt ngào cho Quin & MThư!',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      case 'roses_vase': {
        return {
          success: true,
          message: 'Bình hoa thơm ngát trên bàn: những bông hồng đỏ nhung đang nở rộ ngọt ngào!',
          sound_effect: 'click',
          trigger_win: false
        };
      }
      default: {
        return {
          success: true,
          message: 'MThư quan sát kỹ xung quanh căn phòng.',
          sound_effect: 'click',
          trigger_win: false
        };
      }
    }
  }

  verify_wooden_box(d0, d1, d2, d3) {
    if (d0 === 2 && d1 === 7 && d2 === 2 && d3 === 6) {
      if (!this.box1_unlocked) {
        this.box1_unlocked = true;
        this.add_item('lighter', 'Bật Lửa Trái Tim', 'assets/items/lighter.png');
        this.add_item('lipstick', 'Thỏi Son Đỏ', 'assets/items/lipstick.png');
      }
      return {
        success: true,
        message: 'Cạch! Mật mã 2-7-2-6 chính xác! [27] ngày sinh 27/9 & năm 2007 của vợ, [26] năm 2006 của anh! MThư nhận được [Bật Lửa Trái Tim] và [Thỏi Son Đỏ].',
        sound_effect: 'unlock',
        trigger_win: false
      };
    } else {
      return {
        success: false,
        message: 'Mã số chưa đúng! Gợi ý: Ngày sinh nhật 27/9 & năm 2007 của vợ yêu (27) và năm 2006 của anh (26) => Mật mã là 2726!',
        sound_effect: 'error',
        trigger_win: false
      };
    }
  }

  verify_jewelry_box(s0, s1, s2, s3) {
    if (s0 === 0 && s1 === 1 && s2 === 2 && s3 === 3) {
      if (!this.jbox_unlocked) {
        this.jbox_unlocked = true;
        this.add_item('battery', 'Pin Trái Tim', 'assets/items/battery.png');
        this.add_item('heart_left', 'Mảnh Trái Tim (Trái)', 'assets/items/heart_left.png');
      }
      return {
        success: true,
        message: 'Hộp trang sức bật mở! MThư nhận được [Pin Trái Tim] và [Mảnh Trái Tim Vàng (Trái)].',
        sound_effect: 'unlock',
        trigger_win: false
      };
    } else {
      return {
        success: false,
        message: 'Thứ tự biểu tượng chưa khớp với tấm thiệp hơ nến ngoài Ban Công!',
        sound_effect: 'error',
        trigger_win: false
      };
    }
  }

  insert_safe_key() {
    if (this.selected_item === 'small_key') {
      this.safe_key_inserted = true;
      this.consume_selected_item('small_key');
      return {
        success: true,
        message: 'Đã mở khóa cơ! Giờ MThư hãy nhập mật khẩu 5 chữ cái trên bàn phím.',
        sound_effect: 'unlock',
        trigger_win: false
      };
    } else {
      return {
        success: false,
        message: 'MThư hãy chọn [Chìa Khóa Đồng Nhỏ] trong túi đồ trước khi bấm tra vào ổ khóa nhé!',
        sound_effect: 'error',
        trigger_win: false
      };
    }
  }

  verify_safe_code(code) {
    if (!this.safe_key_inserted) {
      return {
        success: false,
        message: 'Két sắt đang khóa cơ! Hãy tra Chìa Khóa Đồng Nhỏ vào ổ trước.',
        sound_effect: 'error',
        trigger_win: false
      };
    } else if (code.trim().toUpperCase() === 'VOYEU') {
      if (!this.safe_unlocked) {
        this.safe_unlocked = true;
        this.add_item('heart_right', 'Mảnh Trái Tim (Phải)', 'assets/items/heart_right.png');
      }
      return {
        success: true,
        message: 'Ting! Mật khẩu VOYEU chính xác! MThư nhận được [Mảnh Trái Tim Vàng (Phải)].',
        sound_effect: 'unlock',
        trigger_win: false
      };
    } else {
      return {
        success: false,
        message: 'Sai mật khẩu! Hãy tô son lên tờ giấy trắng ở bàn trang điểm hoặc bật đèn ban công.',
        sound_effect: 'error',
        trigger_win: false
      };
    }
  }

  place_chest_heart(side) {
    const selected = this.selected_item || '';
    if (side === 'left' && selected === 'heart_left') {
      this.heart_left_placed = true;
      this.consume_selected_item('heart_left');
      return {
        success: true,
        message: 'Đã ghép Mảnh Trái Tim bên Trái vào rương báu!',
        sound_effect: 'unlock',
        trigger_win: false
      };
    } else if (side === 'right' && selected === 'heart_right') {
      this.heart_right_placed = true;
      this.consume_selected_item('heart_right');
      return {
        success: true,
        message: 'Đã ghép Mảnh Trái Tim bên Phải vào rương báu!',
        sound_effect: 'unlock',
        trigger_win: false
      };
    } else {
      return {
        success: false,
        message: 'Vợ hãy chọn đúng Mảnh Trái Tim Vàng tương ứng trong Túi Đồ nhé!',
        sound_effect: 'error',
        trigger_win: false
      };
    }
  }

  verify_final_chest(c0, c1, c2, c3) {
    if (!this.heart_left_placed || !this.heart_right_placed) {
      return {
        success: false,
        message: 'Cần ghép đủ cả 2 mảnh Trái Tim Vàng lên nắp rương trước!',
        sound_effect: 'error',
        trigger_win: false
      };
    } else if (c0 === 2 && c1 === 0 && c2 === 1 && c3 === 0) {
      this.chest_unlocked = true;
      return {
        success: true,
        message: 'Rương Báu Đại Lễ 20/10 đã mở tung! Xuất hiện một bó hoa nở rộ tuyệt đẹp!',
        sound_effect: 'unlock',
        trigger_win: true
      };
    } else {
      return {
        success: false,
        message: 'Mã 4 số chưa đúng! Gợi ý: Ngày lễ đặc biệt tôn vinh Phụ nữ Việt Nam (DDMM = 2010).',
        sound_effect: 'error',
        trigger_win: false
      };
    }
  }

  get_husband_hint() {
    if (!this.took_dog_bone) {
      return 'Vợ sang Phòng 2 (Bàn Trang Điểm), bấm vào chú Gấu Bông Nâu để lấy Xương Gặm cho Bé Gấu nhé!';
    } else if (!this.dog_fed) {
      return 'Vợ chọn [Xương Gặm Cho Bé Gấu] trong túi đồ rồi cho Bé Gấu ở Phòng 1 để bé nhả chìa khóa nha!';
    } else if (!this.box1_unlocked) {
      return 'Hộp gỗ ở Phòng 1 cài mật mã tình yêu của chúng mình: [27] là ngày sinh 27/9 & năm 2007 của vợ, [26] là năm 2006 của anh => Mật mã là 2726!';
    } else if (!this.candle_lit) {
      return 'MThư mang [Bật Lửa Trái Tim] ra Phòng 3 (Ban Công) thắp cây nến thơm để hơ nóng tấm thiệp nhé!';
    } else if (!this.jbox_unlocked) {
      return 'Mở Hộp Trang Sức ở Phòng 2 theo thứ tự: 🌹 Hoa hồng - 👑 Vương miện - 💖 Trái tim - 💎 Kim cương!';
    } else if (!this.safe_unlocked) {
      return 'Dùng [Thỏi Son Đỏ] tô lên tờ giấy trắng ở Phòng 2 sẽ thấy chữ VOYEU. Nhớ tra Chìa Khóa Đồng vào Két Sắt trước khi nhập VOYEU nha!';
    } else {
      return 'Ghép 2 mảnh Trái Tim Vàng vào Rương Báu ở Ban Công rồi xoay mã số ngày lễ 2-0-1-0 để nhận món quà đặc biệt của Quin nhé!';
    }
  }
}

export default async function init() {
  return Promise.resolve();
}
