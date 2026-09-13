/**
 * Portfolio Interactivity & High-End Micro-Animations
 * Syahiid Idham — Software Engineer & AI Enthusiast
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Year
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- Web Audio API Futuristic Synthesizer ---
  class CosmicAudio {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem("syahiid_audio_fx") !== "disabled";
      this.soundBtn = document.querySelector("#sound-toggle-btn");
      this.cmdSoundStatus = document.querySelector("#cmd-sound-status");
      this.updateUI();
    }

    init() {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    updateUI() {
      if (this.soundBtn) {
        this.soundBtn.classList.toggle("is-muted", !this.enabled);
        this.soundBtn.classList.toggle("is-playing", this.enabled);
        this.soundBtn.setAttribute("title", this.enabled ? "Audio FX: Enabled (Click to mute)" : "Audio FX: Muted (Click to enable)");
      }
      if (this.cmdSoundStatus) {
        this.cmdSoundStatus.textContent = this.enabled ? "ON" : "OFF";
      }
    }

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      localStorage.setItem("syahiid_audio_fx", this.enabled ? "enabled" : "disabled");
      this.updateUI();
      if (this.enabled) {
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        this.playSuccessSound();
      }
      return this.enabled;
    }

    playHoverSound() {
      if (!this.enabled) return;
      this.init();
      try {
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (_) {}
    }

    playClickSound() {
      if (!this.enabled) return;
      this.init();
      try {
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(1280, now + 0.06);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(960, now);

        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.07);
        osc2.stop(now + 0.07);
      } catch (_) {}
    }

    playSuccessSound() {
      if (!this.enabled) return;
      this.init();
      try {
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + idx * 0.06;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.03, start);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.18);
        });
      } catch (_) {}
    }
  }

  const audioFx = new CosmicAudio();
  window.audioFx = audioFx;

  if (audioFx.soundBtn) {
    audioFx.soundBtn.addEventListener("click", () => {
      audioFx.toggle();
    });
  }

  // 2. Interactive Cursor Glow (Ambient Light Follower)
  const cursorGlow = document.querySelector("#cursor-glow");
  let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let currentPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener("pointermove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  }, { passive: true });

  const updateCursorGlow = () => {
    if (cursorGlow) {
      // Smooth lerp movement
      currentPos.x += (mousePos.x - currentPos.x) * 0.12;
      currentPos.y += (mousePos.y - currentPos.y) * 0.12;
      cursorGlow.style.left = `${currentPos.x}px`;
      cursorGlow.style.top = `${currentPos.y}px`;
    }
    requestAnimationFrame(updateCursorGlow);
  };
  requestAnimationFrame(updateCursorGlow);

  // 3. Dynamic Role Cycler (Typewriter Effect)
  const roleElement = document.querySelector("#role-cycler");
  if (roleElement) {
    const roles = [
      "SOFTWARE ENGINEER",
      "FULLSTACK DEVELOPER",
      "AI & WEB ENTHUSIAST",
      "CREATIVE CODER",
      "PROBLEM SOLVER"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        roleElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        roleElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at completed text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeRole, typingSpeed);
    };

    setTimeout(typeRole, 800);
  }

  // 4. Interactive 3D Card Tilt & Mouse Spotlight Glow
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const spotlightCards = document.querySelectorAll(".spotlight-card");

  if (!isTouchDevice) {
    spotlightCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight CSS Variables
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        // 3D Tilt calculation (subtle and smooth)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }, { passive: true });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        card.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.35s ease, box-shadow 0.35s ease";
      });

      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.1s ease-out, border-color 0.35s ease, box-shadow 0.35s ease";
      });
    });
  }

  // 5. Copy Email to Clipboard & Toast System
  const toast = document.querySelector("#toast");
  let toastTimer = null;

  const showToast = (message = "Email copied to clipboard! 📋✨") => {
    if (!toast) return;
    const msgEl = toast.querySelector(".toast-message");
    if (msgEl) msgEl.textContent = message;

    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  };

  const copyButtons = document.querySelectorAll(".copy-email-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.dataset.email || "syahididham7@gmail.com";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = email;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }
        showToast(`Email (${email}) copied to clipboard! 📋✨`);
      } catch (err) {
        console.error("Failed to copy email:", err);
        showToast(`Contact: ${email}`);
      }
    });
  });

  // 6. Animated Number Counter for Mini Stats
  const statNumbers = document.querySelectorAll(".stat-number[data-count]");
  let statsCounted = false;

  const animateStats = () => {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count"), 10);
      if (isNaN(target)) return;

      const duration = 1600;
      const steps = 30;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          stat.textContent = target < 10 ? `0${target}+` : `${target}+`;
          clearInterval(timer);
        } else {
          const val = Math.floor(current);
          stat.textContent = val < 10 ? `0${val}+` : `${val}+`;
        }
      }, stepTime);
    });
  };

  // 7. Scroll Reveal Observer
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          if (entry.target.classList.contains("about") || entry.target.querySelector(".mini-stats")) {
            animateStats();
          }

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Trigger stats if already in view
  const statsContainer = document.querySelector(".mini-stats");
  if (statsContainer) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        statsObserver.disconnect();
      }
    }, { threshold: 0.2 });
    statsObserver.observe(statsContainer);
  }

  // 8. Zero-Delay Navigation & Smooth Scroll Controller
  const sections = document.querySelectorAll("main section[id]");
  const dockLinks = document.querySelectorAll(".dock-link");
  let isNavScrolling = false;
  let navScrollTimer = null;

  const navObserver = new IntersectionObserver(
    (entries) => {
      if (isNavScrolling) return; // Prevent dock jitter/override while user scrolls programmatically

      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) return;

      const id = activeEntry.target.getAttribute("id");
      dockLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isMatch);
      });
    },
    { rootMargin: "-25% 0px -45% 0px", threshold: [0, 0.15, 0.4] }
  );

  sections.forEach((sec) => navObserver.observe(sec));

  // Ultra-Smooth Zero-Delay Scroll Function
  const scrollToSection = (targetHash, originLink = null) => {
    const targetEl = document.querySelector(targetHash);
    if (!targetEl) return;

    // Instant optimistic dock update (0ms delay!)
    dockLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === targetHash);
    });

    if (window.audioFx) window.audioFx.playClickSound();

    isNavScrolling = true;
    clearTimeout(navScrollTimer);

    const topbar = document.querySelector(".topbar");
    const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 70;
    const targetTop = targetHash === "#home" 
      ? 0 
      : targetEl.getBoundingClientRect().top + window.pageYOffset - (topbarHeight + 12);

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });

    navScrollTimer = setTimeout(() => {
      isNavScrolling = false;
    }, 800);
  };
  window.scrollToSection = scrollToSection;

  // Intercept clicks on all internal links for instant response
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          scrollToSection(href, anchor);
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      }
    });
  });

  // Numeric Keyboard Navigation (1=Home, 2=About, 3=Skills, 4=Journey, 5=Projects, 6=Certificates, 7=Contact)
  const navShortcuts = {
    "1": "#home",
    "2": "#about",
    "3": "#skills",
    "4": "#journey",
    "5": "#projects",
    "6": "#certificates",
    "7": "#contact"
  };

  window.addEventListener("keydown", (e) => {
    // Ignore when typing inside input or textarea
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (navShortcuts[e.key]) {
      e.preventDefault();
      scrollToSection(navShortcuts[e.key]);
    }
  });

  // 9. Journey Category Tabs Switcher (Education vs Organizations)
  const journeyTabBtns = document.querySelectorAll(".journey-tab-btn");
  const timelinePanels = document.querySelectorAll(".timeline-panel");

  journeyTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      journeyTabBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", String(isActive));
      });

      timelinePanels.forEach((panel) => {
        const isMatch = panel.getAttribute("id") === targetId;
        panel.classList.toggle("is-hidden", !isMatch);
        if (isMatch) {
          panel.querySelectorAll(".reveal").forEach((item) => {
            item.classList.add("is-visible");
          });
          if (targetId === "timeline-organization") {
            window.dispatchEvent(new CustomEvent("refresh-org-carousel"));
          }
        }
      });
    });
  });

  // 10. Interactive Constellation & Planetary Particles Canvas
  const starfield = document.querySelector("#starfield");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (starfield && !prefersReducedMotion) {
    const ctx = starfield.getContext("2d");
    let width = 0;
    let height = 0;
    let stars = [];
    let planetParticles = [];
    let comets = [];
    let lastCometTime = 0;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const createStar = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.1 + 0.35,
      speed: Math.random() * 0.12 + 0.02,
      depth: Math.random() * 0.75 + 0.25,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() > 0.6 ? "103, 232, 249" : "248, 250, 252",
    });

    // Subtle Floating Celestial Embers (Minimal & Clean)
    const createPlanetParticle = () => {
      const colors = [
        "rgba(34, 211, 238,",   // Soft Cyan
        "rgba(168, 85, 247,",  // Soft Violet
        "rgba(52, 211, 153,",   // Soft Emerald
        "rgba(96, 165, 250,"    // Nebula Blue
      ];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.25 - 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.5 + 0.5
      };
    };

    const resizeStarfield = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      starfield.width = Math.floor(width * ratio);
      starfield.height = Math.floor(height * ratio);
      starfield.style.width = `${width}px`;
      starfield.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      // Clean, spaced-out stars (Crisp & High-Res)
      const targetCount = Math.min(50, Math.max(22, Math.floor((width * height) / 32000)));
      stars = Array.from({ length: targetCount }, createStar);

      // Minimal floating embers
      const particleCount = Math.min(8, Math.max(4, Math.floor((width * height) / 120000)));
      planetParticles = Array.from({ length: particleCount }, createPlanetParticle);
    };

    const spawnComet = () => {
      comets.push({
        x: width * (0.2 + Math.random() * 0.65),
        y: height * (0.01 + Math.random() * 0.25),
        progress: 0,
        speed: 0.009 + Math.random() * 0.005,
        length: 110 + Math.random() * 95,
      });
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Parallax shift with pointer
      const shiftX = (pointer.x / width - 0.5) * 16;
      const shiftY = (pointer.y / height - 0.5) * 10;

      // 1. Draw crisp twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y -= star.speed;
        if (star.y < -4) {
          star.y = height + 4;
          star.x = Math.random() * width;
        }

        const alpha = 0.2 + ((Math.sin(time * 0.002 + star.phase) + 1) / 2) * 0.65;
        const posX = star.x + shiftX * star.depth;
        const posY = star.y + shiftY * star.depth;

        ctx.beginPath();
        ctx.arc(posX, posY, star.radius * star.depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.tint}, ${alpha})`;
        ctx.fill();

        // Subtle constellation link only when pointer is very close
        const distToMouse = Math.hypot(posX - pointer.x, posY - pointer.y);
        if (distToMouse < 90) {
          const lineAlpha = (1 - distToMouse / 90) * 0.25;
          ctx.beginPath();
          ctx.moveTo(posX, posY);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(103, 232, 249, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // 2. Draw Floating Celestial Embers (Smooth & Soft)
      for (let p of planetParticles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Subtle interactive mouse deflection
        const dx = (p.x + shiftX * p.depth) - pointer.x;
        const dy = (p.y + shiftY * p.depth) - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const force = (1 - dist / 140) * 0.6;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * p.pulseSpeed + p.pulsePhase));
        const px = p.x + shiftX * p.depth;
        const py = p.y + shiftY * p.depth;

        // Radial glow on planet particles
        const particleGlow = ctx.createRadialGradient(px, py, 0, px, py, p.radius * 2.5);
        particleGlow.addColorStop(0, `${p.color} ${currentAlpha})`);
        particleGlow.addColorStop(0.4, `${p.color} ${currentAlpha * 0.6})`);
        particleGlow.addColorStop(1, `${p.color} 0)`);

        ctx.beginPath();
        ctx.arc(px, py, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = particleGlow;
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.min(1, currentAlpha * 1.5)})`;
        ctx.fill();
      }

      // 3. Render Comets (Shooting Stars)
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.progress += c.speed;
        const currentX = c.x - c.progress * width * 0.28;
        const currentY = c.y + c.progress * height * 0.36;

        const grad = ctx.createLinearGradient(
          currentX,
          currentY,
          currentX + c.length,
          currentY - c.length * 0.78
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        grad.addColorStop(0.25, "rgba(103, 232, 249, 0.75)");
        grad.addColorStop(0.7, "rgba(99, 102, 241, 0.35)");
        grad.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.beginPath();
        ctx.moveTo(currentX + c.length, currentY - c.length * 0.78);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.9;
        ctx.stroke();

        if (c.progress > 1.3) {
          comets.splice(i, 1);
        }
      }

      if (comets.length === 0 && time - lastCometTime > 4500 + Math.random() * 3500) {
        spawnComet();
        lastCometTime = time;
      }

      requestAnimationFrame(render);
    };

    window.addEventListener("resize", resizeStarfield, { passive: true });
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });

    resizeStarfield();
    requestAnimationFrame(render);
  }

  // --- Foreground Meteor Shower Canvas Overlay ---
  const clickCanvas = document.querySelector("#click-canvas");
  if (clickCanvas) {
    const cCtx = clickCanvas.getContext("2d");
    let cWidth = window.innerWidth;
    let cHeight = window.innerHeight;
    let sparks = [];
    let meteors = [];
    let isCanvasLooping = false;

    const resizeClickCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cWidth = window.innerWidth;
      cHeight = window.innerHeight;
      clickCanvas.width = Math.floor(cWidth * dpr);
      clickCanvas.height = Math.floor(cHeight * dpr);
      clickCanvas.style.width = `${cWidth}px`;
      clickCanvas.style.height = `${cHeight}px`;
      cCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeClickCanvas();
    window.addEventListener("resize", resizeClickCanvas, { passive: true });

    // Draw 4-pointed diamond star
    const drawDiamondStar = (ctx, cx, cy, radius, innerRadius, color, alpha, angle) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      let rot = (Math.PI / 2) * 3 + angle;
      const step = Math.PI / 4;

      ctx.moveTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
      for (let i = 0; i < 4; i++) {
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animateForegroundCanvas = () => {
      if (sparks.length === 0 && meteors.length === 0) {
        cCtx.clearRect(0, 0, cWidth, cHeight);
        isCanvasLooping = false;
        return;
      }

      cCtx.clearRect(0, 0, cWidth, cHeight);

      // 1. Draw stardust particles from meteor trails
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.vy += 0.05; // Gentle cosmic gravity
        s.rotation += s.rotSpeed;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        if (s.isStar) {
          drawDiamondStar(cCtx, s.x, s.y, s.size * 2.2, s.size * 0.6, s.color, s.alpha, s.rotation);
        } else {
          cCtx.save();
          cCtx.globalAlpha = s.alpha;
          cCtx.beginPath();
          cCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          cCtx.fillStyle = s.color;
          cCtx.shadowColor = s.color;
          cCtx.shadowBlur = 12;
          cCtx.fill();
          cCtx.restore();
        }
      }

      // 2. Draw Foreground Shooting Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;

        // Emit sparkling stardust trail
        if (Math.random() > 0.25) {
          sparks.push({
            x: m.x + (Math.random() - 0.5) * 6,
            y: m.y + (Math.random() - 0.5) * 6,
            vx: -m.vx * 0.06 + (Math.random() - 0.5) * 2,
            vy: -m.vy * 0.06 + (Math.random() - 0.5) * 2,
            size: Math.random() * 2.5 + 1,
            color: m.glowColor,
            alpha: 0.9,
            decay: 0.04,
            isStar: Math.random() > 0.4,
            rotation: Math.random() * Math.PI,
            rotSpeed: 0.15
          });
        }

        const hyp = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / hyp) * m.length;
        const tailY = m.y - (m.vy / hyp) * m.length;

        const grad = cCtx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        grad.addColorStop(0.18, `${m.trailColor} 0.9)`);
        grad.addColorStop(0.6, `${m.trailColor} 0.3)`);
        grad.addColorStop(1, `${m.trailColor} 0)`);

        cCtx.save();
        cCtx.beginPath();
        cCtx.moveTo(m.x, m.y);
        cCtx.lineTo(tailX, tailY);
        cCtx.strokeStyle = grad;
        cCtx.lineWidth = m.thickness;
        cCtx.lineCap = "round";
        cCtx.shadowColor = m.glowColor;
        cCtx.shadowBlur = 18;
        cCtx.stroke();

        // Glowing meteor head
        cCtx.beginPath();
        cCtx.arc(m.x, m.y, m.headRadius, 0, Math.PI * 2);
        cCtx.fillStyle = "#ffffff";
        cCtx.shadowColor = m.glowColor;
        cCtx.shadowBlur = 24;
        cCtx.fill();
        cCtx.restore();

        // Out of viewport check
        if (m.x < -300 || m.y > cHeight + 300) {
          meteors.splice(i, 1);
        }
      }

      requestAnimationFrame(animateForegroundCanvas);
    };

    const spawnMeteor = (customX = null, customY = null, customSpeed = null) => {
      const angle = (140 + (Math.random() - 0.5) * 24) * (Math.PI / 180);
      const speed = customSpeed || (Math.random() * 8 + 18);
      const palettes = [
        { glow: "#22d3ee", trail: "rgba(34, 211, 238," },
        { glow: "#fbbf24", trail: "rgba(251, 191, 36," },
        { glow: "#a855f7", trail: "rgba(168, 85, 247," },
        { glow: "#34d399", trail: "rgba(52, 211, 153," },
        { glow: "#f43f5e", trail: "rgba(244, 63, 94," }
      ];
      const p = palettes[Math.floor(Math.random() * palettes.length)];

      meteors.push({
        x: customX !== null ? customX : (cWidth * (0.3 + Math.random() * 0.8)),
        y: customY !== null ? customY : (-40 - Math.random() * 80),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 160 + 140,
        thickness: Math.random() * 2 + 2.5,
        headRadius: Math.random() * 2 + 3,
        glowColor: p.glow,
        trailColor: p.trail
      });

      if (!isCanvasLooping) {
        isCanvasLooping = true;
        requestAnimationFrame(animateForegroundCanvas);
      }
    };

    const triggerMeteorShower = () => {
      const total = 14;
      for (let i = 0; i < total; i++) {
        setTimeout(() => {
          const startX = cWidth * (0.2 + (i / total) * 0.9 + (Math.random() - 0.5) * 0.25);
          const startY = -40 - Math.random() * 100;
          spawnMeteor(startX, startY, 18 + Math.random() * 10);

          if (window.audioFx && i % 3 === 0) {
            window.audioFx.playClickSound();
          }
        }, i * 190);
      }
      if (window.audioFx) window.audioFx.playSuccessSound();
    };
    window.triggerMeteorShower = triggerMeteorShower;

    // Optional audio feedback on click (no particles)
    window.addEventListener("pointerdown", () => {
      if (window.audioFx) window.audioFx.playClickSound();
    }, { passive: true });
  }

  // 11. Organization Moments Carousel Slider
  const orgCarousel = document.querySelector("#org-carousel");
  const orgTrack = document.querySelector("#org-carousel-track");
  const orgSlides = document.querySelectorAll(".org-carousel-slide");
  const orgDots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector("#gallery-prev");
  const nextBtn = document.querySelector("#gallery-next");
  const currentIndexEl = document.querySelector("#gallery-current");
  const totalCountEl = document.querySelector("#gallery-total");

  if (orgTrack && orgSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = orgSlides.length;
    let autoSlideInterval = null;

    if (totalCountEl) {
      totalCountEl.textContent = String(totalSlides).padStart(2, "0");
    }

    const updateCarousel = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;
      orgTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      orgSlides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === currentSlide);
      });

      orgDots.forEach((dot, i) => {
        const isActive = i === currentSlide;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });

      if (currentIndexEl) {
        currentIndexEl.textContent = String(currentSlide + 1).padStart(2, "0");
      }
    };

    const startAutoSlide = () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        updateCarousel(currentSlide + 1);
      }, 5500);
    };

    const pauseAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    const resetAutoSlide = () => {
      pauseAutoSlide();
      startAutoSlide();
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        updateCarousel(currentSlide - 1);
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        updateCarousel(currentSlide + 1);
        resetAutoSlide();
      });
    }

    orgDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.getAttribute("data-index"), 10);
        if (!isNaN(idx)) {
          updateCarousel(idx);
          resetAutoSlide();
        }
      });
    });

    // Touch & Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    if (orgCarousel) {
      orgCarousel.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoSlide();
      }, { passive: true });

      orgCarousel.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            updateCarousel(currentSlide + 1); // Swipe left -> Next
          } else {
            updateCarousel(currentSlide - 1); // Swipe right -> Prev
          }
        }
        startAutoSlide();
      }, { passive: true });

      orgCarousel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          updateCarousel(currentSlide - 1);
          resetAutoSlide();
        } else if (e.key === "ArrowRight") {
          updateCarousel(currentSlide + 1);
          resetAutoSlide();
        }
      });

      orgCarousel.addEventListener("mouseenter", pauseAutoSlide);
      orgCarousel.addEventListener("mouseleave", startAutoSlide);
    }

    // Refresh carousel when switching into the organization tab
    window.addEventListener("refresh-org-carousel", () => {
      updateCarousel(currentSlide);
      resetAutoSlide();
    });

    // Check image loading states
    document.querySelectorAll(".slide-real-img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) {
        const frame = img.closest(".slide-photo-frame");
        if (frame) frame.classList.add("has-error");
      }
      img.addEventListener("error", () => {
        const frame = img.closest(".slide-photo-frame");
        if (frame) frame.classList.add("has-error");
      });
      img.addEventListener("load", () => {
        const frame = img.closest(".slide-photo-frame");
        if (frame) frame.classList.remove("has-error");
      });
    });

    startAutoSlide();
  }

  // 12. Certificates Filter Tabs
  const certFilterBtns = document.querySelectorAll(".cert-filter-btn");
  const certCards = document.querySelectorAll(".cert-card");

  certFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      certFilterBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", String(isActive));
      });

      certCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        const shouldShow = filter === "all" || cat === filter;
        card.classList.toggle("is-filtered-out", !shouldShow);
        if (shouldShow) {
          card.classList.add("is-visible");
        }
      });
    });
  });

  // 13. Certificate Lightbox Modal
  const certModal = document.querySelector("#cert-modal");
  const certModalClose = document.querySelector("#cert-modal-close");
  const certModalBackdrop = document.querySelector("#cert-modal-backdrop");
  const modalImg = document.querySelector("#modal-cert-img");
  const modalPlaceholder = document.querySelector("#modal-cert-placeholder");
  const modalTitle = document.querySelector("#modal-cert-title");
  const modalIssuer = document.querySelector("#modal-cert-issuer");
  const modalDate = document.querySelector("#modal-cert-date");
  const modalCategory = document.querySelector("#modal-cert-category");
  const modalDesc = document.querySelector("#modal-cert-desc");
  const modalSkills = document.querySelector("#modal-cert-skills");
  const modalId = document.querySelector("#modal-cert-id");
  const modalPdfLink = document.querySelector("#modal-cert-pdf-link");
  const placeholderTitle = document.querySelector("#placeholder-title");
  const placeholderIssuer = document.querySelector("#placeholder-issuer");

  const openCertModal = (data) => {
    if (!certModal) return;

    if (modalTitle) modalTitle.textContent = data.title || "Certificate";
    if (modalIssuer) modalIssuer.textContent = `Issued by ${data.issuer || "Organization"}`;
    if (modalDate) modalDate.textContent = data.date || "2025";
    if (modalCategory) modalCategory.textContent = data.category || "Verified";
    if (modalDesc) modalDesc.textContent = data.desc || "";
    if (modalId) modalId.textContent = data.id || "VERIFIED-CREDENTIAL";

    if (placeholderTitle) placeholderTitle.textContent = data.title || "Certificate";
    if (placeholderIssuer) placeholderIssuer.textContent = data.issuer || "Organization";

    // Skills tags
    if (modalSkills) {
      modalSkills.innerHTML = "";
      if (data.skills) {
        const tags = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
        tags.forEach((tag) => {
          const span = document.createElement("span");
          span.textContent = tag;
          modalSkills.appendChild(span);
        });
      }
    }

    // Image handling
    if (modalImg && modalPlaceholder) {
      if (data.img) {
        modalImg.src = data.img;
        modalImg.style.display = "block";
        modalPlaceholder.style.display = "none";
      } else {
        modalImg.style.display = "none";
        modalPlaceholder.style.display = "flex";
      }
    }

    // PDF button handling
    if (modalPdfLink) {
      if (data.pdf) {
        modalPdfLink.href = data.pdf;
        modalPdfLink.style.display = "inline-flex";
      } else {
        modalPdfLink.style.display = "none";
      }
    }

    certModal.classList.add("is-open");
    certModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeCertModal = () => {
    if (!certModal) return;
    certModal.classList.remove("is-open");
    certModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const certTriggers = document.querySelectorAll(".cert-preview-trigger");
  certTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openCertModal({
        title: trigger.dataset.certTitle,
        issuer: trigger.dataset.certIssuer,
        date: trigger.dataset.certDate,
        id: trigger.dataset.certId,
        category: trigger.dataset.certCategory,
        desc: trigger.dataset.certDesc,
        skills: trigger.dataset.certSkills,
        img: trigger.dataset.certImg,
        pdf: trigger.dataset.certPdf,
      });
    });
  });

  if (certModalClose) certModalClose.addEventListener("click", closeCertModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener("click", closeCertModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal && certModal.classList.contains("is-open")) {
      closeCertModal();
    }
  });

  // 14. Magnetic Button Physics
  const magneticEls = document.querySelectorAll(
    ".button, .header-cv-btn, .topbar-tool-btn, .dock-link, .journey-tab-btn, .cert-filter-btn, .cmd-item"
  );

  if (!isTouchDevice) {
    magneticEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const pullFactor = 0.2;
        const pullX = (e.clientX - centerX) * pullFactor;
        const pullY = (e.clientY - centerY) * pullFactor;

        el.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
      }, { passive: true });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
        el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      });

      el.addEventListener("mouseenter", () => {
        el.style.transition = "transform 0.1s ease-out";
        if (window.audioFx) window.audioFx.playHoverSound();
      });
    });
  }

  // 15. Real-Time Local Clock (WIB / GMT+7)
  const localClockEl = document.querySelector("#local-clock");
  if (localClockEl) {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const timeString = new Intl.DateTimeFormat("en-GB", options).format(now);
      localClockEl.textContent = `🕒 ${timeString} WIB`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 16. Cosmic Command Center / Quick Navigator HUD (Ctrl+K)
  const cmdPalette = document.querySelector("#cmd-palette");
  const cmdTrigger = document.querySelector("#cmd-palette-trigger");
  const cmdBackdrop = document.querySelector("#cmd-palette-backdrop");
  const cmdCloseBtn = document.querySelector("#cmd-close-btn");
  const cmdInput = document.querySelector("#cmd-search-input");
  const cmdItems = document.querySelectorAll(".cmd-item");
  let focusedIndex = 0;

  const openCmdPalette = () => {
    if (!cmdPalette) return;
    cmdPalette.classList.add("is-open");
    cmdPalette.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (cmdInput) {
      cmdInput.value = "";
      cmdInput.focus();
    }
    filterCmdItems("");
    if (window.audioFx) window.audioFx.playClickSound();
  };

  const closeCmdPalette = () => {
    if (!cmdPalette) return;
    cmdPalette.classList.remove("is-open");
    cmdPalette.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const filterCmdItems = (query) => {
    const q = query.toLowerCase().trim();
    let visibleItems = [];
    cmdItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const match = !q || text.includes(q);
      item.style.display = match ? "flex" : "none";
      if (match) visibleItems.push(item);
    });

    cmdItems.forEach((it) => it.classList.remove("is-focused"));
    if (visibleItems.length > 0) {
      focusedIndex = 0;
      visibleItems[0].classList.add("is-focused");
    }
  };

  if (cmdTrigger) cmdTrigger.addEventListener("click", openCmdPalette);
  if (cmdBackdrop) cmdBackdrop.addEventListener("click", closeCmdPalette);
  if (cmdCloseBtn) cmdCloseBtn.addEventListener("click", closeCmdPalette);

  if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
      filterCmdItems(e.target.value);
    });
  }

  // Handle Command Item Execution
  const executeCmdItem = (item) => {
    if (!item) return;
    const action = item.dataset.action;
    const target = item.dataset.target;

    closeCmdPalette();

    if (action === "navigate" && target) {
      scrollToSection(target);
    } else if (action === "copy-email") {
      const email = "syahididham7@gmail.com";
      if (navigator.clipboard) navigator.clipboard.writeText(email);
      showToast(`Email (${email}) copied! 📋✨`);
      if (window.audioFx) window.audioFx.playSuccessSound();
    } else if (action === "download-cv") {
      const link = document.createElement("a");
      link.href = "assets/Syahiid-Idham-CV.pdf";
      link.download = "Syahiid-Idham-CV.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("Downloading Curriculum Vitae... 📄");
      if (window.audioFx) window.audioFx.playSuccessSound();
    } else if (action === "toggle-sound") {
      if (window.audioFx) window.audioFx.toggle();
    } else if (action === "meteor-shower") {
      if (typeof window.triggerMeteorShower === "function") {
        window.triggerMeteorShower();
        showToast("Cosmic meteor shower unleashed! 🌠✨");
      }
    }
  };

  cmdItems.forEach((item) => {
    item.addEventListener("click", () => {
      executeCmdItem(item);
    });
  });

  // Global Keydown (Ctrl+K or Cmd+K & Escape)
  window.addEventListener("keydown", (e) => {
    // Open Command Palette with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains("is-open")) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
      return;
    }

    // Escape closes modals
    if (e.key === "Escape") {
      if (cmdPalette && cmdPalette.classList.contains("is-open")) {
        closeCmdPalette();
        return;
      }
    }

    // Navigation inside Command Palette
    if (cmdPalette && cmdPalette.classList.contains("is-open")) {
      const visibleItems = Array.from(cmdItems).filter((it) => it.style.display !== "none");
      if (visibleItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        visibleItems[focusedIndex].classList.remove("is-focused");
        focusedIndex = (focusedIndex + 1) % visibleItems.length;
        visibleItems[focusedIndex].classList.add("is-focused");
        visibleItems[focusedIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        visibleItems[focusedIndex].classList.remove("is-focused");
        focusedIndex = (focusedIndex - 1 + visibleItems.length) % visibleItems.length;
        visibleItems[focusedIndex].classList.add("is-focused");
        visibleItems[focusedIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeCmdItem(visibleItems[focusedIndex]);
      }
    }
  });
});
