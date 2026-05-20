<div align="center">

# 🩺 APD Nakes Detector

### *Sistem Deteksi Alat Pelindung Diri Tenaga Medis Berbasis Kecerdasan Buatan*

<br/>

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv11](https://img.shields.io/badge/YOLO-v11-FF6B35?style=for-the-badge&logo=pytorch&logoColor=white)](https://github.com/ultralytics/ultralytics)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.8%2B-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org/)
[![CUDA](https://img.shields.io/badge/CUDA-GPU%20Ready-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://developer.nvidia.com/cuda-toolkit)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> **Deteksi otomatis penggunaan APD medis secara real‑time melalui gambar, video, dan webcam langsung di browser — didukung model YOLOv11 yang dilatih khusus.**

<br/>

![Demo Banner](https://img.shields.io/badge/STATUS-PRODUCTION%20READY-brightgreen?style=for-the-badge)
&nbsp;
![Classes](https://img.shields.io/badge/DETEKSI-4%20Kelas%20APD-blue?style=for-the-badge)
&nbsp;
![Platform](https://img.shields.io/badge/PLATFORM-Windows%2010%2F11-0078D6?style=for-the-badge&logo=windows&logoColor=white)

</div>

---

## 📌 Tentang Proyek

**APD Nakes Detector** adalah aplikasi web cerdas yang memanfaatkan model **YOLOv11** (Ultralytics) untuk mendeteksi kelengkapan **Alat Pelindung Diri (APD)** pada tenaga medis secara otomatis dan akurat.

Sistem ini dirancang untuk mendukung **pengawasan kepatuhan APD** di fasilitas kesehatan — mulai dari rumah sakit, klinik, hingga laboratorium — demi meminimalkan risiko kontaminasi dan melindungi para pejuang garis depan dunia medis.

```
📤 Upload Gambar/Video  →  🤖 Deteksi YOLOv11  →  📊 Hasil & Statistik
📷 Kamera Real-Time     →  🤖 Deteksi YOLOv11  →  🔴 Live Stream Annotated
```

---

## 🎯 APD yang Dideteksi

<div align="center">

| # | Ikon | Kelas | Deskripsi |
|:---:|:---:|:---|:---|
| 1 | 🥼 | **Coverall** | Baju hazmat / pakaian pelindung tubuh penuh |
| 2 | 🧤 | **Gloves** | Sarung tangan medis steril |
| 3 | 🥽 | **Goggles** | Kacamata pelindung / face shield |
| 4 | 😷 | **Mask** | Masker medis / respirator N95 |

</div>

---

## ✨ Fitur Unggulan

<table>
<tr>
<td width="50%">

### 🖼️ Deteksi Gambar
- Upload gambar (JPG, PNG, WEBP, BMP)
- Bounding box + label + confidence score
- Ringkasan statistik per kelas APD
- Pratinjau hasil langsung di browser

</td>
<td width="50%">

### 🎬 Deteksi Video
- Upload video (MP4, AVI, MOV, MKV)
- Proses frame-by-frame secara otomatis
- Video hasil anotasi dapat diunduh
- Statistik total deteksi per frame

</td>
</tr>
<tr>
<td width="50%">

### 📷 Live Webcam Real-Time
- Deteksi APD langsung dari webcam
- Streaming MJPEG real-time di browser
- Tombol Start / Stop kamera yang intuitif
- Latensi rendah (~30 FPS)

</td>
<td width="50%">

### 🎨 Antarmuka Premium
- Desain futuristik **Dark Mode**
- Efek **Glassmorphism** transparan
- Responsif di mobile & desktop
- Micro-animation & smooth transition

</td>
</tr>
</table>

### ⚡ Akselerasi GPU NVIDIA CUDA
- Deteksi otomatis ketersediaan GPU CUDA
- Fallback otomatis ke CPU jika GPU tidak tersedia
- Performa training dan inference yang jauh lebih cepat dengan GPU

---

## 🛠️ Tech Stack

<div align="center">

| Komponen | Teknologi | Versi |
|:---|:---:|:---:|
| Backend Web | ![Flask](https://img.shields.io/badge/-Flask-000?logo=flask) | ≥ 3.0 |
| Model AI | ![Ultralytics](https://img.shields.io/badge/-Ultralytics-FF6B35?logo=pytorch&logoColor=white) | ≥ 8.0 |
| Computer Vision | ![OpenCV](https://img.shields.io/badge/-OpenCV-5C3EE8?logo=opencv&logoColor=white) | ≥ 4.8 |
| Numerik | ![NumPy](https://img.shields.io/badge/-NumPy-013243?logo=numpy&logoColor=white) | ≥ 1.24 |
| Image Processing | ![Pillow](https://img.shields.io/badge/-Pillow-FFD43B?logo=python&logoColor=black) | ≥ 10.0 |
| Deep Learning | ![PyTorch](https://img.shields.io/badge/-PyTorch-EE4C2C?logo=pytorch&logoColor=white) | Auto |

</div>

---

## 📂 Struktur Proyek

```
📦 apd-nakes-detector/
│
├── 📁 dataset/
│   └── data.yaml                        # Konfigurasi dataset (kelas & jalur data)
│
├── 📁 runs/
│   └── detect/
│       └── medical_ppe_yolo11/
│           └── weights/
│               └── best.pt              # ✅ Bobot model YOLOv11 terbaik (hasil training)
│
├── 📁 static/
│   ├── css/                             # Stylesheet antarmuka web
│   ├── js/                              # Logika frontend (upload, webcam, statistik)
│   └── results/                         # 📸 Output deteksi gambar & video (auto-generated)
│
├── 📁 templates/
│   └── index.html                       # Template halaman utama aplikasi
│
├── 📄 app.py                            # 🚀 Backend Flask utama & API deteksi
├── 📄 train.py                          # 🏋️ Script training model YOLOv11
├── 📄 requirements.txt                  # 📦 Daftar dependensi Python
├── 🤖 yolo11n.pt                        # Base model YOLOv11-nano (pretrained)
└── 📝 README.md
```

---

## ⚙️ Instalasi & Setup

### Prasyarat

Pastikan perangkat Anda memenuhi kebutuhan berikut sebelum memulai:

- ✅ **Python 3.10+** — [Download Python](https://www.python.org/downloads/)
- ✅ **Git** — [Download Git](https://git-scm.com/downloads)
- ⚡ **(Opsional) NVIDIA GPU + CUDA Toolkit** — untuk akselerasi hardware

---

### Langkah 1 — Clone Repositori

```bash
git clone https://github.com/username/apd-nakes-detector.git
cd apd-nakes-detector
```

### Langkah 2 — Buat Virtual Environment

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan (Windows PowerShell / CMD)
.\venv\Scripts\activate
```

### Langkah 3 — Install Dependensi

```bash
pip install -r requirements.txt
```

> [!TIP]
> **🚀 Ingin menggunakan GPU NVIDIA untuk performa lebih cepat?**
>
> Instal PyTorch versi CUDA sesuai versi driver GPU Anda:
> ```bash
> pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
> ```
> *(Ganti `cu121` sesuai versi CUDA Toolkit Anda — cek dengan perintah `nvidia-smi`)*

---

## 🚀 Menjalankan Aplikasi

```bash
python app.py
```

Setelah server berjalan, konsol akan menampilkan:

```
==================================================
  APD Nakes Detector — Medical PPE Detection
  http://localhost:5000
==================================================
```

🌐 Buka browser dan akses **[http://localhost:5000](http://localhost:5000)**

---

## 🏋️ Training Ulang Model

Jika Anda ingin melatih model dengan dataset kustom Anda sendiri:

**1.** Simpan dataset Anda (format YOLOv8/YOLOv11) di folder `dataset/`

**2.** Sesuaikan jalur dan nama kelas di `dataset/data.yaml`

**3.** Jalankan script training:

```bash
python train.py
```

Script akan secara otomatis:
- 🔍 Mendeteksi dan menggunakan GPU CUDA jika tersedia
- 🏋️ Melatih selama **100 epoch** dengan optimizer AdamW
- 🎨 Menerapkan augmentasi data canggih (Mosaic, MixUp, HSV Jitter, Rotasi)
- 📊 Melakukan validasi otomatis dan menampilkan metrik (mAP50, mAP50-95)
- 💾 Menyimpan model terbaik ke `runs/detect/medical_ppe_yolo11/weights/best.pt`

---

## 🛠️ Troubleshooting

<details>
<summary><b>📷 Webcam tidak terdeteksi atau gagal dibuka</b></summary>

- Pastikan webcam tidak sedang digunakan aplikasi lain (Zoom, Teams, dll.)
- Aktifkan izin akses kamera di **Settings → Privacy → Camera** di Windows
- Jika memakai webcam eksternal, ubah indeks di `app.py`:
  ```python
  # Coba indeks 1, 2, dst.
  camera = cv2.VideoCapture(1)
  ```

</details>

<details>
<summary><b>⚡ CUDA tidak terdeteksi (`CUDA Available: False`)</b></summary>

- Jalankan `nvidia-smi` di CMD untuk cek versi driver dan CUDA
- Pastikan PyTorch versi CUDA sudah diinstal (bukan versi CPU-only)
- Instal ulang PyTorch sesuai panduan: [pytorch.org/get-started](https://pytorch.org/get-started/locally/)

</details>

<details>
<summary><b>🎬 Video hasil tidak bisa diputar di browser</b></summary>

- Browser tertentu memiliki keterbatasan decoder codec `mp4v`
- Unduh file video hasilnya dan putar menggunakan **VLC Media Player**
- Atau konversi menggunakan `ffmpeg`:
  ```bash
  ffmpeg -i result_video.mp4 -vcodec libx264 output_h264.mp4
  ```

</details>

<details>
<summary><b>📦 Error saat install requirements</b></summary>

- Pastikan pip sudah versi terbaru: `python -m pip install --upgrade pip`
- Gunakan Virtual Environment yang bersih dan aktif
- Jika ada konflik dependensi, coba install satu per satu:
  ```bash
  pip install flask ultralytics opencv-python numpy Pillow
  ```

</details>

---

## 📡 API Endpoint

Aplikasi ini mengekspos beberapa endpoint REST API yang dapat digunakan secara programatik:

| Method | Endpoint | Deskripsi |
|:---:|:---|:---|
| `GET` | `/` | Halaman utama aplikasi |
| `POST` | `/detect/image` | Upload & deteksi gambar |
| `POST` | `/detect/video` | Upload & deteksi video |
| `POST` | `/start_camera` | Mulai streaming webcam |
| `POST` | `/stop_camera` | Hentikan streaming webcam |
| `GET` | `/video_feed` | MJPEG live stream endpoint |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Ikuti alur berikut:

1. **Fork** repositori ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "feat: tambahkan fitur X"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat **Pull Request** ke branch `main`

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan apapun.

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## 🙏 Ucapan Terima Kasih

- [**Ultralytics**](https://github.com/ultralytics/ultralytics) — atas framework YOLOv11 yang luar biasa
- [**Roboflow**](https://roboflow.com) — atas platform anotasi dan dataset `medical-ppe`
- [**OpenCV**](https://opencv.org) — atas library computer vision yang andal
- [**Flask**](https://flask.palletsprojects.com) — atas framework web Python yang ringan dan fleksibel

---

<div align="center">

**Dibuat dengan ❤️ untuk mendukung keselamatan dan kesehatan kerja tenaga medis Indonesia**

👩‍⚕️ *Jaga diri, lindungi sesama.* 👨‍⚕️

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/username)
[![Stars](https://img.shields.io/github/stars/username/apd-nakes-detector?style=for-the-badge&color=yellow)](https://github.com/username/apd-nakes-detector/stargazers)

</div>
