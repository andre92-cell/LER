
const openBtn = document.getElementById("openBtn");
const content = document.getElementById("content");

openBtn.addEventListener("click", () => {
  content.classList.remove("hidden");
  openBtn.textContent = "Kenangan kita terbuka ❤️";
  openBtn.disabled = true;
  content.scrollIntoView({ behavior: "smooth" });
});

// Upload foto
const photoInput = document.getElementById("photoInput");
const gallery = document.getElementById("gallery");

photoInput.addEventListener("change", () => {
  gallery.innerHTML = "";

  Array.from(photoInput.files).forEach(file => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "Foto kenangan kita";
    gallery.appendChild(img);
  });
});

// Simpan catatan otomatis
const note = document.getElementById("note");

try {
  note.value = localStorage.getItem("catatanKita") || "";

  note.addEventListener("input", () => {
    localStorage.setItem("catatanKita", note.value);
  });
} catch (error) {
  console.log("Penyimpanan browser tidak tersedia");
}

// Upload musik
const musicInput = document.getElementById("musicInput");
const musicPlayer = document.getElementById("musicPlayer");

musicInput.addEventListener("change", () => {
  const file = musicInput.files[0];

  if (file) {
    musicPlayer.src = URL.createObjectURL(file);
    musicPlayer.play();
  }
});
