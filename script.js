
// ===================================
// WEBSITE KENANGAN 5 TAHUN ❤️
// ===================================

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


// ===================================
// DATABASE FOTO PERMANEN DI BROWSER
// ===================================

let db;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AlbumKenangan", 1);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains("photos")) {
        database.createObjectStore("photos", {
          keyPath: "id"
        });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

function savePhotos(files) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("photos", "readwrite");
    const store = transaction.objectStore("photos");

    store.clear();

    files.slice(0, 5).forEach((file, index) => {
      store.put({
        id: index + 1,
        name: file.name,
        blob: file
      });
    });

    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

function getPhotos() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("photos", "readonly");
    const store = transaction.objectStore("photos");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


// ===================================
// GALERI 5 FOTO SLIDER
// ===================================

const photoInput = document.getElementById("photoInput");
const sliderTrack = document.getElementById("sliderTrack");
const sliderWindow = document.getElementById("sliderWindow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("dots");
const photoCounter = document.getElementById("photoCounter");

let currentIndex = 0;
const totalPhotos = 5;
let photoURLs = [];

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

// BUAT 5 TITIK NAVIGASI
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

// TOMBOL KIRI DAN KANAN
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
// TAMPILKAN FOTO
// ===================================

function displayPhotos(photos) {
  const slides = sliderTrack.querySelectorAll(".slide");

  // Hapus URL foto lama
  photoURLs.forEach(url => URL.revokeObjectURL(url));
  photoURLs = [];

  slides.forEach((slide, index) => {
    slide.innerHTML = "";

    const photo = photos[index];

    if (photo) {
      const img = document.createElement("img");

      const url = URL.createObjectURL(photo.blob);
      photoURLs.push(url);

      img.src = url;
      img.alt = photo.name || `Foto kenangan ${index + 1}`;

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
}


// ===================================
// UPLOAD DAN SIMPAN 5 FOTO
// ===================================

photoInput.addEventListener("change", async () => {
  const files = Array.from(photoInput.files)
    .filter(file => file.type.startsWith("image/"))
    .slice(0, 5);

  if (photoInput.files.length > 5) {
    alert("Maksimal hanya 5 foto ya!");
  }

  if (files.length === 0) return;

  try {
    await savePhotos(files);

    const savedPhotos = await getPhotos();
    displayPhotos(savedPhotos);

    alert("Yeay! Foto kenangan berhasil disimpan ❤️");

  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan foto. Coba lagi ya!");
  }

  photoInput.value = "";
});


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
      saveStatus.textContent = "✓ Catatan berhasil disimpan ❤️";
    } catch (error) {
      saveStatus.textContent = "Gagal menyimpan catatan.";
    }
  });

} catch (error) {
  saveStatus.textContent = "Penyimpanan browser tidak tersedia.";
}


// ===================================
// MUSIK
// ===================================

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
    musicName.textContent =
      "♫ " + file.name + " — tekan Play untuk memutar.";
  });
});


// ===================================
// SAAT WEBSITE DIBUKA KEMBALI
// ===================================

async function initializeWebsite() {
  try {
    await openDatabase();

    const savedPhotos = await getPhotos();

    displayPhotos(savedPhotos);

    console.log("Album kenangan berhasil dimuat ❤️");

  } catch (error) {
    console.error("Database error:", error);

    alert(
      "Penyimpanan foto tidak bisa dibuka. " +
      "Coba jalankan website menggunakan VS Code Live Server."
    );
  }
}

initializeWebsite();
