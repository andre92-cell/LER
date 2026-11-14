
const openBtn = document.getElementById("openBtn");
const content = document.getElementById("content");

// BUKA KENANGAN
openBtn.addEventListener("click", () => {
  content.classList.remove("hidden");
  openBtn.textContent = "Kenangan Kita Terbuka ❤️";
  openBtn.disabled = true;

  content.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// SLIDER 5 FOTO
const photoInput = document.getElementById("photoInput");
const sliderTrack = document.getElementById("sliderTrack");
const sliderWindow = document.getElementById("sliderWindow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("dots");
const photoCounter = document.getElementById("photoCounter");

let currentIndex = 0;
const totalPhotos = 5;
let touchStartX = 0;

function updateSlider() {
  sliderTrack.style.transform =
    `translateX(-${currentIndex * 100}%)`;

  photoCounter.textContent =
    `${currentIndex + 1} / ${totalPhotos}`;

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalPhotos - 1;

  prevBtn.style.opacity = prevBtn.disabled ? "0.4" : "1";
  nextBtn.style.opacity = nextBtn.disabled ? "0.4" : "1";
}

for (let i = 0; i < totalPhotos; i++) {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", `Buka foto ${i + 1}`);

  dot.addEventListener("click", () => {
    currentIndex = i;
    updateSlider();
  });

  dotsContainer.appendChild(dot);
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < totalPhotos - 1) {
    currentIndex++;
    updateSlider();
  }
});

// GESER FOTO DENGAN JARI DI HP
sliderWindow.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

sliderWindow.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].screenX;
  const distance = touchStartX - touchEndX;

  if (Math.abs(distance) < 40) return;

  if (distance > 0 && currentIndex < totalPhotos - 1) {
    currentIndex++;
  } else if (distance < 0 && currentIndex > 0) {
    currentIndex--;
  }

  updateSlider();
}, { passive: true });

updateSlider();

// UPLOAD MAKSIMAL 5 FOTO
photoInput.addEventListener("change", () => {
  const files = Array.from(photoInput.files).slice(0, 5);

  if (photoInput.files.length > 5) {
    alert("Maksimal hanya 5 foto ya!");
  }

  const slides = sliderTrack.querySelectorAll(".slide");

  slides.forEach((slide, index) => {
    slide.innerHTML = "";

    if (files[index]) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(files[index]);
      img.alt = `Kenangan ${index + 1}`;

      slide.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "photo-placeholder";
      placeholder.innerHTML = `
        <span>♡</span>
        <p>Foto Kenangan ${index + 1}</p>
        <small>Belum ada foto</small>
      `;

      slide.appendChild(placeholder);
    }
  });

  currentIndex = 0;
  updateSlider();
});

// SIMPAN CATATAN OTOMATIS
const note = document.getElementById("note");
const saveStatus = document.getElementById("saveStatus");

try {
  note.value = localStorage.getItem("catatanKita") || "";

  note.addEventListener("input", () => {
    try {
      localStorage.setItem("catatanKita", note.value);
      saveStatus.textContent = "✓ Catatan berhasil disimpan.";
    } catch (error) {
      saveStatus.textContent = "Gagal menyimpan. Silakan salin catatan.";
    }
  });
} catch (error) {
  saveStatus.textContent = "Penyimpanan browser tidak tersedia.";
}

// UPLOAD MUSIK
const musicInput = document.getElementById("musicInput");
const musicPlayer = document.getElementById("musicPlayer");
const musicName = document.getElementById("musicName");

let musicURL = null;

musicInput.addEventListener("change", () => {
  const file = musicInput.files[0];

  if (!file) return;

  if (musicURL) {
    URL.revokeObjectURL(musicURL);
  }

  musicURL = URL.createObjectURL(file);
  musicPlayer.src = musicURL;
  musicName.textContent = "♫ " + file.name;

  musicPlayer.play().catch(() => {
    musicName.textContent = "♫ " + file.name + " — tekan Play untuk memutar.";
  });
});
