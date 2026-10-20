use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub icon_path: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ActionResult {
    pub success: bool,
    pub message: String,
    pub sound_effect: String, // "pickup", "unlock", "error", "click"
    pub trigger_win: bool,
}

#[wasm_bindgen]
pub struct GameEngine {
    current_room: u8,
    selected_item: Option<String>,
    inventory: Vec<Item>,
    used_items: Vec<String>,
    
    // Các cờ trạng thái giải đố (Flags)
    pub took_dog_bone: bool,
    pub dog_fed: bool,
    pub box1_unlocked: bool,
    pub paper_rubbed: bool,
    pub jbox_unlocked: bool,
    pub safe_key_inserted: bool,
    pub safe_unlocked: bool,
    pub candle_lit: bool,
    pub lights_powered: bool,
    pub heart_left_placed: bool,
    pub heart_right_placed: bool,
    pub chest_unlocked: bool,
}

#[wasm_bindgen]
impl GameEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> GameEngine {
        GameEngine {
            current_room: 1,
            selected_item: None,
            inventory: Vec::new(),
            used_items: Vec::new(),
            took_dog_bone: false,
            dog_fed: false,
            box1_unlocked: false,
            paper_rubbed: false,
            jbox_unlocked: false,
            safe_key_inserted: false,
            safe_unlocked: false,
            candle_lit: false,
            lights_powered: false,
            heart_left_placed: false,
            heart_right_placed: false,
            chest_unlocked: false,
        }
    }

    pub fn get_room(&self) -> u8 {
        self.current_room
    }

    pub fn set_room(&mut self, room: u8) {
        if (1..=3).contains(&room) {
            self.current_room = room;
        }
    }

    pub fn get_selected_item(&self) -> Option<String> {
        self.selected_item.clone()
    }

    // Trả danh sách túi đồ về cho JS hiển thị
    pub fn get_inventory(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inventory).unwrap()
    }

    pub fn select_item(&mut self, item_id: String) -> Option<String> {
        if self.selected_item.as_deref() == Some(&item_id) {
            self.selected_item = None;
        } else {
            self.selected_item = Some(item_id);
        }
        self.selected_item.clone()
    }

    fn add_item(&mut self, id: &str, name: &str, icon_path: &str) {
        if !self.inventory.iter().any(|i| i.id == id) && !self.used_items.contains(&id.to_string()) {
            self.inventory.push(Item {
                id: id.to_string(),
                name: name.to_string(),
                icon_path: icon_path.to_string(),
            });
        }
    }

    fn consume_selected_item(&mut self, id: &str) {
        self.inventory.retain(|i| i.id != id);
        self.used_items.push(id.to_string());
        self.selected_item = None;
    }

    // Xử lý tương tác với các đối tượng trong phòng
    pub fn interact_hotspot(&mut self, target: &str) -> JsValue {
        let selected = self.selected_item.clone().unwrap_or_default();
        let res = match target {
            "teddy" => {
                if !self.took_dog_bone {
                    self.took_dog_bone = true;
                    self.add_item("dog_bone", "Xương Gặm Cho Bé Gấu", "assets/items/dog_bone.png");
                    ActionResult {
                        success: true,
                        message: "Chú gấu bông nâu xinh xắn! Trong túi áo gấu có [Xương Gặm Cho Bé Gấu].".into(),
                        sound_effect: "pickup".into(),
                        trigger_win: false,
                    }
                } else {
                    ActionResult {
                        success: true,
                        message: "Túi của gấu bông nâu đã trống sau khi lấy xương gặm.".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                }
            }
            "dog" => {
                if self.dog_fed {
                    ActionResult {
                        success: true,
                        message: "Bé Gấu đang gặm xương ngon lành và ngủ say sưa!".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                } else if selected == "dog_bone" {
                    self.dog_fed = true;
                    self.consume_selected_item("dog_bone");
                    self.add_item("small_key", "Chìa Khóa Đồng Nhỏ", "assets/items/small_key.png");
                    ActionResult {
                        success: true,
                        message: "Bé Gấu thích thú gặm khúc xương và nhường lại [Chìa Khóa Đồng Nhỏ]!".into(),
                        sound_effect: "unlock".into(),
                        trigger_win: false,
                    }
                } else {
                    ActionResult {
                        success: false,
                        message: "Gâu gâu! Bé Gấu đang giữ chiếc chìa khóa dưới chân. Phải có xương thơm ngon cho Bé Gấu mới được!".into(),
                        sound_effect: "error".into(),
                        trigger_win: false,
                    }
                }
            }
            "paper" => {
                if !self.paper_rubbed && selected == "lipstick" {
                    self.paper_rubbed = true;
                    self.consume_selected_item("lipstick");
                    ActionResult {
                        success: true,
                        message: "MThư tô son đỏ lên vết hằn trên giấy! Dòng chữ bí mật hiện ra: [ V O Y E U ]".into(),
                        sound_effect: "unlock".into(),
                        trigger_win: false,
                    }
                } else if self.paper_rubbed {
                    ActionResult {
                        success: true,
                        message: "Tờ giấy đã hiện rõ 5 chữ cái: V - O - Y - E - U.".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                } else {
                    ActionResult {
                        success: false,
                        message: "Tờ giấy trắng có vết chữ chìm không màu. Cần thỏi son đỏ cà lên mới thấy được!".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                }
            }
            "candle" => {
                if !self.candle_lit && selected == "lighter" {
                    self.candle_lit = true;
                    self.consume_selected_item("lighter");
                    ActionResult {
                        success: true,
                        message: "Ngọn nến ấm áp bùng sáng! Hơi nóng làm thiệp cảm nhiệt hiện rõ: 🌹 ➔ 👑 ➔ 💖 ➔ 💎".into(),
                        sound_effect: "unlock".into(),
                        trigger_win: false,
                    }
                } else if self.candle_lit {
                    ActionResult {
                        success: true,
                        message: "Thiệp cảm nhiệt dưới ánh nến hiện 4 biểu tượng: 🌹 Hoa hồng - 👑 Vương miện - 💖 Trái tim - 💎 Kim cương.".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                } else {
                    ActionResult {
                        success: false,
                        message: "Cây nến thơm chưa thắp lửa, bên dưới có tấm thiệp in mực cảm nhiệt.".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                }
            }
            "switch" => {
                if !self.lights_powered && selected == "battery" {
                    self.lights_powered = true;
                    self.consume_selected_item("battery");
                    ActionResult {
                        success: true,
                        message: "Dây đèn đom đóm bừng sáng rực rỡ lấp lánh dòng chữ: V O Y E U!".into(),
                        sound_effect: "unlock".into(),
                        trigger_win: false,
                    }
                } else if self.lights_powered {
                    ActionResult {
                        success: true,
                        message: "Dây đèn đom đóm lấp lánh dòng chữ: V - O - Y - E - U trên nền trời đêm.".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                } else {
                    ActionResult {
                        success: false,
                        message: "Hộp nguồn của dây đèn ban công đang thiếu một viên Pin Trái Tim.".into(),
                        sound_effect: "click".into(),
                        trigger_win: false,
                    }
                }
            }
            "calendar" => {
                ActionResult {
                    success: true,
                    message: "Tờ lịch lật sang Ngày 20 Tháng 10 - Ngày Phụ Nữ Việt Nam dành trọn cho MThư! 🌹".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            "painting" | "painting_stars" => {
                ActionResult {
                    success: true,
                    message: "Bức tranh Đêm Đầy Sao (Starry Night): lung linh sắc màu dưới bầu trời đêm lãng mạn!".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            "painting_couple" => {
                ActionResult {
                    success: true,
                    message: "Ảnh kỷ niệm ngọt ngào của hai đứa mình nè vợ! Chàng trai 2006 (26) và cô gái đáng yêu sinh ngày 27/09/2007 (27)! ❤️".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            "painting_gau" => {
                ActionResult {
                    success: true,
                    message: "Chân dung của Bé Gấu cưng nhà mình nè! Bé Gấu thích ăn bánh xương lắm đó vợ ơi! 🐶".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            "painting_clue" => {
                ActionResult {
                    success: true,
                    message: "Bức tranh thư pháp hoa hồng 27 & 26: [27] là ngày sinh 27/9 & năm 2007 của vợ, [26] là năm 2006 của anh => Mật mã Hộp Gỗ là 2726!".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            "milktea" => {
                ActionResult {
                    success: true,
                    message: "Trên bàn có đúng 2 ly trà sữa trân châu đường đen ngọt ngào cho Quin & MThư!".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            "roses_vase" => {
                ActionResult {
                    success: true,
                    message: "Bình hoa thơm ngát trên lò sưởi: đúng 5 bông hồng đỏ nhung đang nở rộ!".into(),
                    sound_effect: "click".into(),
                    trigger_win: false,
                }
            }
            _ => ActionResult {
                success: true,
                message: "MThư quan sát kỹ xung quanh căn phòng.".into(),
                sound_effect: "click".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    // 1. Kiểm tra mã Hộp Gỗ 4 Số (Đáp án: 2726)
    pub fn verify_wooden_box(&mut self, d0: u8, d1: u8, d2: u8, d3: u8) -> JsValue {
        let res = if d0 == 2 && d1 == 7 && d2 == 2 && d3 == 6 {
            if !self.box1_unlocked {
                self.box1_unlocked = true;
                self.add_item("lighter", "Bật Lửa Trái Tim", "assets/items/lighter.png");
                self.add_item("lipstick", "Thỏi Son Đỏ", "assets/items/lipstick.png");
            }
            ActionResult {
                success: true,
                message: "Cạch! Mật mã 2-7-2-6 chính xác! [27] ngày sinh 27/9 & năm 2007 của vợ, [26] năm 2006 của anh! MThư nhận được [Bật Lửa Trái Tim] và [Thỏi Son Đỏ].".into(),
                sound_effect: "unlock".into(),
                trigger_win: false,
            }
        } else {
            ActionResult {
                success: false,
                message: "Mã số chưa đúng! Gợi ý: Ngày sinh nhật 27/9 & năm 2007 của vợ yêu (27) và năm 2006 của anh (26) => Mật mã là 2726!".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    // 2. Kiểm tra Hộp Trang Sức Hoàng Gia (Đáp án: 0, 1, 2, 3 ứng với 🌹, 👑, 💖, 💎)
    pub fn verify_jewelry_box(&mut self, s0: u8, s1: u8, s2: u8, s3: u8) -> JsValue {
        let res = if s0 == 0 && s1 == 1 && s2 == 2 && s3 == 3 {
            if !self.jbox_unlocked {
                self.jbox_unlocked = true;
                self.add_item("battery", "Pin Trái Tim", "assets/items/battery.png");
                self.add_item("heart_left", "Mảnh Trái Tim (Trái)", "assets/items/heart_left.png");
            }
            ActionResult {
                success: true,
                message: "Hộp trang sức bật mở! MThư nhận được [Pin Trái Tim] và [Mảnh Trái Tim Vàng (Trái)].".into(),
                sound_effect: "unlock".into(),
                trigger_win: false,
            }
        } else {
            ActionResult {
                success: false,
                message: "Thứ tự biểu tượng chưa khớp với tấm thiệp hơ nến ngoài Ban Công!".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    // 3. Tra chìa khóa & Kiểm tra Két Sắt Chữ Cái (Đáp án: VOYEU)
    pub fn insert_safe_key(&mut self) -> JsValue {
        let res = if self.selected_item.as_deref() == Some("small_key") {
            self.safe_key_inserted = true;
            self.consume_selected_item("small_key");
            ActionResult {
                success: true,
                message: "Đã mở khóa cơ! Giờ MThư hãy nhập mật khẩu 5 chữ cái trên bàn phím.".into(),
                sound_effect: "unlock".into(),
                trigger_win: false,
            }
        } else {
            ActionResult {
                success: false,
                message: "MThư hãy chọn [Chìa Khóa Đồng Nhỏ] trong túi đồ trước khi bấm tra vào ổ khóa nhé!".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    pub fn verify_safe_code(&mut self, code: &str) -> JsValue {
        let res = if !self.safe_key_inserted {
            ActionResult {
                success: false,
                message: "Két sắt đang khóa cơ! Hãy tra Chìa Khóa Đồng Nhỏ vào ổ trước.".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        } else if code.trim().to_uppercase() == "VOYEU" {
            if !self.safe_unlocked {
                self.safe_unlocked = true;
                self.add_item("heart_right", "Mảnh Trái Tim (Phải)", "assets/items/heart_right.png");
            }
            ActionResult {
                success: true,
                message: "Ting! Mật khẩu VOYEU chính xác! MThư nhận được [Mảnh Trái Tim Vàng (Phải)].".into(),
                sound_effect: "unlock".into(),
                trigger_win: false,
            }
        } else {
            ActionResult {
                success: false,
                message: "Sai mật khẩu! Hãy tô son lên tờ giấy trắng ở bàn trang điểm hoặc bật đèn ban công.".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    // 4. Lắp mảnh Trái Tim và Mở Rương Đại Lễ 20/10
    pub fn place_chest_heart(&mut self, side: &str) -> JsValue {
        let selected = self.selected_item.clone().unwrap_or_default();
        let res = if side == "left" && selected == "heart_left" {
            self.heart_left_placed = true;
            self.consume_selected_item("heart_left");
            ActionResult {
                success: true,
                message: "Đã ghép Mảnh Trái Tim bên Trái vào rương báu!".into(),
                sound_effect: "unlock".into(),
                trigger_win: false,
            }
        } else if side == "right" && selected == "heart_right" {
            self.heart_right_placed = true;
            self.consume_selected_item("heart_right");
            ActionResult {
                success: true,
                message: "Đã ghép Mảnh Trái Tim bên Phải vào rương báu!".into(),
                sound_effect: "unlock".into(),
                trigger_win: false,
            }
        } else {
            ActionResult {
                success: false,
                message: "Vợ hãy chọn đúng Mảnh Trái Tim Vàng tương ứng trong Túi Đồ nhé!".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    pub fn verify_final_chest(&mut self, c0: u8, c1: u8, c2: u8, c3: u8) -> JsValue {
        let res = if !self.heart_left_placed || !self.heart_right_placed {
            ActionResult {
                success: false,
                message: "Cần ghép đủ cả 2 mảnh Trái Tim Vàng lên nắp rương trước!".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        } else if c0 == 2 && c1 == 0 && c2 == 1 && c3 == 0 {
            self.chest_unlocked = true;
            ActionResult {
                success: true,
                message: "Rương Báu Đại Lễ 20/10 đã mở tung! Xuất hiện một bó hoa nở rộ tuyệt đẹp!".into(),
                sound_effect: "unlock".into(),
                trigger_win: true,
            }
        } else {
            ActionResult {
                success: false,
                message: "Mã 4 số chưa đúng! Gợi ý: Ngày lễ đặc biệt tôn vinh Phụ nữ Việt Nam (DDMM = 2010).".into(),
                sound_effect: "error".into(),
                trigger_win: false,
            }
        };
        serde_wasm_bindgen::to_value(&res).unwrap()
    }

    // Hệ thống Gợi ý của Quin
    pub fn get_husband_hint(&self) -> String {
        if !self.took_dog_bone {
            "Vợ sang Phòng 2 (Bàn Trang Điểm), bấm vào chú Gấu Bông Nâu để lấy Xương Gặm cho Bé Gấu nhé!".into()
        } else if !self.dog_fed {
            "Vợ chọn [Xương Gặm Cho Bé Gấu] trong túi đồ rồi cho Bé Gấu ở Phòng 1 để bé nhả chìa khóa nha!".into()
        } else if !self.box1_unlocked {
            "Hộp gỗ ở Phòng 1 cài mật mã tình yêu của chúng mình: [27] là ngày sinh 27/9 & năm 2007 của vợ, [26] là năm 2006 của anh => Mật mã là 2726!".into()
        } else if !self.candle_lit {
            "MThư mang [Bật Lửa Trái Tim] ra Phòng 3 (Ban Công) thắp cây nến thơm để hơ nóng tấm thiệp nhé!".into()
        } else if !self.jbox_unlocked {
            "Mở Hộp Trang Sức ở Phòng 2 theo thứ tự: 🌹 Hoa hồng - 👑 Vương miện - 💖 Trái tim - 💎 Kim cương!".into()
        } else if !self.safe_unlocked {
            "Dùng [Thỏi Son Đỏ] tô lên tờ giấy trắng ở Phòng 2 sẽ thấy chữ VOYEU. Nhớ tra Chìa Khóa Đồng vào Két Sắt trước khi nhập VOYEU nha!".into()
        } else {
            "Ghép 2 mảnh Trái Tim Vàng vào Rương Báu ở Ban Công rồi xoay mã số ngày lễ 2-0-1-0 để nhận món quà đặc biệt của Quin nhé!".into()
        }
    }
}
