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

  // 8. Navigation Dock Active Link Sync
  const sections = document.querySelectorAll("main section[id]");
  const dockLinks = document.querySelectorAll(".dock-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
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
    { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.15, 0.4] }
  );

  sections.forEach((sec) => navObserver.observe(sec));

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
        }
      });
    });
  });

  // 10. Interactive Constellation Canvas Starfield
  const starfield = document.querySelector("#starfield");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (starfield && !prefersReducedMotion) {
    const ctx = starfield.getContext("2d");
    let width = 0;
    let height = 0;
    let stars = [];
    let comet = null;
    let lastCometTime = 0;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const createStar = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.16 + 0.03,
      depth: Math.random() * 0.85 + 0.15,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() > 0.6 ? "103, 232, 249" : (Math.random() > 0.4 ? "165, 180, 252" : "248, 250, 252"),
    });

    const resizeStarfield = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      starfield.width = Math.floor(width * ratio);
      starfield.height = Math.floor(height * ratio);
      starfield.style.width = `${width}px`;
      starfield.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const targetCount = Math.min(190, Math.max(80, Math.floor((width * height) / 8800)));
      stars = Array.from({ length: targetCount }, createStar);
    };

    const spawnComet = () => {
      comet = {
        x: width * (0.25 + Math.random() * 0.55),
        y: height * (0.02 + Math.random() * 0.25),
        progress: 0,
        speed: 0.008 + Math.random() * 0.005,
        length: 100 + Math.random() * 90,
      };
    };

    const drawComet = () => {
      if (!comet) return;
      comet.progress += comet.speed;
      const currentX = comet.x - comet.progress * width * 0.28;
      const currentY = comet.y + comet.progress * height * 0.36;

      const grad = ctx.createLinearGradient(
        currentX,
        currentY,
        currentX + comet.length,
        currentY - comet.length * 0.78
      );
      grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      grad.addColorStop(0.2, "rgba(103, 232, 249, 0.75)");
      grad.addColorStop(0.7, "rgba(99, 102, 241, 0.3)");
      grad.addColorStop(1, "rgba(99, 102, 241, 0)");

      ctx.beginPath();
      ctx.moveTo(currentX + comet.length, currentY - comet.length * 0.78);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (comet.progress > 1.25) comet = null;
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Subtle parallax shift with pointer
      const shiftX = (pointer.x / width - 0.5) * 22;
      const shiftY = (pointer.y / height - 0.5) * 14;

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y -= star.speed;
        if (star.y < -4) {
          star.y = height + 4;
          star.x = Math.random() * width;
        }

        const alpha = 0.18 + ((Math.sin(time * 0.002 + star.phase) + 1) / 2) * 0.68;
        const posX = star.x + shiftX * star.depth;
        const posY = star.y + shiftY * star.depth;

        ctx.beginPath();
        ctx.arc(posX, posY, star.radius * star.depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.tint}, ${alpha})`;
        ctx.fill();

        // Constellation Lines: Connect stars when close to cursor
        const distToMouse = Math.hypot(posX - pointer.x, posY - pointer.y);
        if (distToMouse < 110) {
          const lineAlpha = (1 - distToMouse / 110) * 0.28;
          ctx.beginPath();
          ctx.moveTo(posX, posY);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(103, 232, 249, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Connect nearby stars with delicate constellation lines
        for (let j = i + 1; j < Math.min(i + 7, stars.length); j++) {
          const other = stars[j];
          const oX = other.x + shiftX * other.depth;
          const oY = other.y + shiftY * other.depth;
          const dist = Math.hypot(posX - oX, posY - oY);

          if (dist < 75) {
            const lineAlpha = (1 - dist / 75) * 0.14;
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(oX, oY);
            ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Spawn periodic comets
      if (!comet && time - lastCometTime > 4500 + Math.random() * 4000) {
        spawnComet();
        lastCometTime = time;
      }
      drawComet();

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
});
