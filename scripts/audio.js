// Multi-Phase Music & Audio Controller (Quin & MThư)
// Reads directly from folder `song/`:
// Phase 1 (Sảnh & Game): song/bai1.mp3 (Every Summertime)
// Phase 2 (Bó hoa nở rộ -> Thư tình): song/bai2.mp3 (Die For You)
// Phase 3 (Trái tim 3D -> Dải ảnh): song/bai3.mp3 (Beauty and a Beat)

export class SoundController {
  constructor() {
    this.ctx = null;
    this.currentPhase = 1;
    this.isMuted = false;
    this.synthInterval = null;

    this.PHASE_CONFIG = {
      1: {
        title: 'Phase 1: Every Summertime (NIKI)',
        localFiles: ['song/bai1.mp3', 'song/bai1.m4a', 'song/bai1.wav', 'assets/audio/every_summertime.mp3'],
        ytId: 'D-YDEiaPtCE'
      },
      2: {
        title: 'Phase 2: Die For You (The Weeknd)',
        localFiles: ['song/bai2.mp3', 'song/bai2.m4a', 'song/bai2.wav', 'assets/audio/die_for_you.mp3'],
        ytId: 'QLCpqdqeoII'
      },
      3: {
        title: 'Phase 3: Beauty and a Beat (Justin Bieber)',
        localFiles: ['song/bai3.mp3', 'song/bai3.m4a', 'song/bai3.wav', 'assets/audio/beauty_and_a_beat.mp3'],
        ytId: 'Ys7-6_t7OEQ'
      }
    };
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMusicPhase(phase) {
    this.initContext();
    this.currentPhase = phase;
    const config = this.PHASE_CONFIG[phase];
    if (!config) return;

    // Cập nhật nhãn bài hát trên thanh tiêu đề
    const label = document.getElementById('music-track-title');
    if (label) {
      label.innerText = config.title;
      label.title = `Đang phát từ folder song/ hoặc luồng nhạc: ${config.title}`;
    }

    // Thử tuần tự các file cục bộ trong folder song/
    this.playWithFallback(config);
    this.startSynthMelody(phase);
  }

  async playWithFallback(config) {
    const audioEl = document.getElementById('bgm-audio-player');
    if (!audioEl) return;

    let played = false;
    for (const filePath of config.localFiles) {
      try {
        const resp = await fetch(filePath, { method: 'HEAD' });
        if (resp.ok) {
          audioEl.src = filePath;
          await audioEl.play();
          played = true;
          console.log(`[Audio] Phát thành công từ file: ${filePath}`);
          // Dừng iframe youtube nếu file local đã chạy
          const yt = document.getElementById('yt-audio-container');
          if (yt) yt.innerHTML = '';
          break;
        }
      } catch (e) {
        // Tiếp tục thử
      }
    }

    // Nếu người dùng chưa bỏ file vào folder song/, phát qua IFrame YouTube nền
    if (!played) {
      this.playYouTubeTrack(config.ytId);
    }
  }

  playYouTubeTrack(ytId) {
    const container = document.getElementById('yt-audio-container');
    if (!container) return;
    container.innerHTML = `
      <iframe id="yt-player" width="1" height="1"
        src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&enablejsapi=1"
        frameborder="0" allow="autoplay" style="opacity: 0; pointer-events: none; position: absolute;">
      </iframe>
    `;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const audioEl = document.getElementById('bgm-audio-player');
    if (audioEl) audioEl.muted = this.isMuted;

    const ytContainer = document.getElementById('yt-audio-container');
    if (ytContainer) ytContainer.style.display = this.isMuted ? 'none' : 'block';

    if (this.isMuted) {
      if (this.synthInterval) clearInterval(this.synthInterval);
    } else {
      this.startSynthMelody(this.currentPhase);
    }
    return !this.isMuted;
  }

  // SFX Hiệu ứng âm thanh trò chơi
  play(effectName) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    switch (effectName) {
      case 'click':
        this.playClick();
        break;
      case 'pickup':
        this.playPickup();
        break;
      case 'unlock':
        this.playUnlock();
        break;
      case 'error':
        this.playError();
        break;
      case 'fanfare':
        this.playFanfare();
        break;
      case 'typewriter':
        this.playTypewriterClick();
        break;
      case 'heartbeat':
        this.playHeartbeat();
        break;
      default:
        this.playClick();
    }
  }

  playClick() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playTypewriterClick() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  playHeartbeat() {
    const now = this.ctx.currentTime;
    // Thump 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.08);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Thump 2
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(70, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(40, now + 0.22);
    gain2.gain.setValueAtTime(0.4, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.23);
  }

  playPickup() {
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
  }

  playUnlock() {
    const now = this.ctx.currentTime;
    const chord = [440.0, 554.37, 659.25, 880.0, 1108.73];
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.55);
    });
  }

  playError() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playFanfare() {
    const now = this.ctx.currentTime;
    const melody = [
      { f: 587.33, t: 0.0, d: 0.18 },
      { f: 739.99, t: 0.2, d: 0.18 },
      { f: 880.00, t: 0.4, d: 0.22 },
      { f: 1174.66, t: 0.65, d: 0.7 }
    ];
    melody.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.25, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  startSynthMelody(phase) {
    if (this.synthInterval) clearInterval(this.synthInterval);
    if (this.isMuted) return;

    let melodyNotes = [];
    if (phase === 1) {
      melodyNotes = [329.63, 392.00, 440.00, 493.88, 392.00, 440.00, 523.25, 440.00];
    } else if (phase === 2) {
      melodyNotes = [293.66, 349.23, 440.00, 523.25, 440.00, 392.00, 349.23, 329.63];
    } else {
      melodyNotes = [440.00, 493.88, 554.37, 659.25, 554.37, 493.88, 440.00, 370.00];
    }

    let idx = 0;
    this.synthInterval = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const freq = melodyNotes[idx % melodyNotes.length];
      idx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.85);
    }, 550);
  }
}
