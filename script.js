
// ===================================
// WEBSITE KENANGAN 5 TAHUN
// VERSI HOSTING ONLINE
// ===================================

// BUKA KENANGAN + ANIMASI KEDIP 1 KALI + MUSIK OTOMATIS
const openBtn = document.getElementById("openBtn");
const content = document.getElementById("content");

openBtn.addEventListener("click", () => {
  // Efek kedip satu kali
  document.body.classList.remove("blink-once");
  void document.body.offsetWidth;
  document.body.classList.add("blink-once");

  // Tampilkan semua kenangan bersamaan
  content.classList.remove("hidden");

  openBtn.textContent = "Kenangan Kita Terbuka ❤️";
  openBtn.disabled = true;

  // Putar musik otomatis setelah tombol diklik
  musicPlayer.play().catch((error) => {
    console.log("Musik belum bisa diputar:", error);
  });

  content.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  // Bersihkan class setelah animasi selesai
  setTimeout(() => {
    document.body.classList.remove("blink-once");
  }, 500);
});


// ===================================
// GALERI 5 FOTO ONLINE
// ===================================

const sliderTrack = document.getElementById("sliderTrack");
const sliderWindow = document.getElementById("sliderWindow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("dots");
const photoCounter = document.getElementById("photoCounter");

const totalPhotos = 5;
let currentIndex = 0;

const photoFiles = [
  "foto1.jpg",
  "foto2.jpg",
  "foto3.jpg",
  "foto4.jpg",
  "foto5.jpg"
];

// Hilangkan tombol upload foto
const photoInput = document.getElementById("photoInput");

if (photoInput) {
  photoInput.style.display = "none";

  const photoLabel = document.querySelector('label[for="photoInput"]');
  if (photoLabel) photoLabel.style.display = "none";
}


// TAMPILKAN FOTO DARI GITHUB
function displayPhotos() {
  const slides = sliderTrack.querySelectorAll(".slide");

  slides.forEach((slide, index) => {
    const img = document.createElement("img");

    img.src = photoFiles[index];
    img.alt = `Foto kenangan ${index + 1}`;

    img.onerror = () => {
      console.error("Foto gagal dimuat:", photoFiles[index]);
    };

    slide.innerHTML = "";
    slide.appendChild(img);
  });

  currentIndex = 0;
  updateSlider();
}


// BUAT TITIK NAVIGASI
for (let i = 0; i < totalPhotos; i++) {
  const dot = document.createElement("button");

  dot.className = "dot";
  dot.setAttribute("aria-label", `Foto ${i + 1}`);

  dot.addEventListener("click", () => {
    currentIndex = i;
    updateSlider();
  });

  dotsContainer.appendChild(dot);
}


// UPDATE SLIDER
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


// TOMBOL KIRI
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});


// TOMBOL KANAN
nextBtn.addEventListener("click", () => {
  if (currentIndex < totalPhotos - 1) {
    currentIndex++;
    updateSlider();
  }
});


// GESER FOTO PAKAI JARI
let touchStartX = 0;

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


// ===================================
// CATATAN OTOMATIS
// ===================================

const note = document.getElementById("note");
const saveStatus = document.getElementById("saveStatus");

try {
  note.value = localStorage.getItem("catatanKita") || "";

  note.addEventListener("input", () => {
    try {
      localStorage.setItem("catatanKita", note.value);
      saveStatus.textContent =
        "✓ Catatan berhasil disimpan";
    } catch (error) {
      saveStatus.textContent = "Gagal menyimpan catatan.";
    }
  });

} catch (error) {
  saveStatus.textContent =
    "Penyimpanan browser tidak tersedia.";
}


// ===================================
// MUSIK ONLINE
// ===================================

const musicInput = document.getElementById("musicInput");
const musicPlayer = document.getElementById("musicPlayer");
const musicName = document.getElementById("musicName");

// Hilangkan tombol upload musik
if (musicInput) {
  musicInput.style.display = "none";

  const musicLabel = document.querySelector('label[for="musicInput"]');
  if (musicLabel) musicLabel.style.display = "none";
}

// Hubungkan musik dari GitHub
musicPlayer.src = "music.mp3";
musicPlayer.preload = "auto";

musicName.textContent = "♫ Lagu Kenangan Kita";


// ===================================
// JALANKAN WEBSITE
// ===================================

displayPhotos();

console.log("Website Kenangan 5 Tahun siap ❤️");
