// ============================================
// Medical PPE Detection - Frontend Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initImageUpload();
    initVideoUpload();
    initCamera();
});

// === Tab Navigation ===
function initTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            btns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// === Toast Notification ===
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// === Format File Size ===
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// ============================================
// IMAGE UPLOAD & DETECTION
// ============================================
function initImageUpload() {
    const zone = document.getElementById('imageUploadZone');
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImage');
    const fileInfo = document.getElementById('imageFileInfo');
    const detectBtn = document.getElementById('detectImageBtn');
    const resultSection = document.getElementById('imageResultSection');
    const resultImg = document.getElementById('resultImage');
    const statsGrid = document.getElementById('imageStats');
    const detectionTable = document.getElementById('imageDetectionTable');

    let selectedFile = null;

    // Click to upload
    zone.addEventListener('click', () => input.click());

    // Drag & drop
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });

    // File input change
    input.addEventListener('change', () => {
        if (input.files[0]) handleImageFile(input.files[0]);
    });

    function handleImageFile(file) {
        selectedFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);

        // Show file info
        fileInfo.innerHTML = `
            <span class="file-icon">🖼️</span>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeImageFile()">✕</button>
        `;
        fileInfo.style.display = 'flex';

        detectBtn.disabled = false;
        resultSection.classList.remove('show');
    }

    // Detect button
    detectBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        detectBtn.disabled = true;
        detectBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Memproses...';

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('/detect/image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Show result image
                resultImg.src = data.result_image + '?t=' + Date.now();
                resultSection.classList.add('show');

                // Update stats
                renderStats(statsGrid, data.class_counts);

                // Update detection table
                renderDetectionTable(detectionTable, data.detections);

                showToast(`Terdeteksi ${data.total_detections} objek APD!`);
            } else {
                showToast(data.error || 'Gagal memproses gambar', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }

        detectBtn.disabled = false;
        detectBtn.innerHTML = '🔍 Deteksi APD';
    });

    // Expose remove function
    window.removeImageFile = () => {
        selectedFile = null;
        input.value = '';
        preview.classList.remove('show');
        fileInfo.style.display = 'none';
        detectBtn.disabled = true;
        resultSection.classList.remove('show');
    };
}

// ============================================
// VIDEO UPLOAD & DETECTION
// ============================================
function initVideoUpload() {
    const zone = document.getElementById('videoUploadZone');
    const input = document.getElementById('videoInput');
    const preview = document.getElementById('videoPreview');
    const previewVid = document.getElementById('previewVideo');
    const fileInfo = document.getElementById('videoFileInfo');
    const detectBtn = document.getElementById('detectVideoBtn');
    const resultSection = document.getElementById('videoResultSection');
    const resultVid = document.getElementById('resultVideo');
    const progressContainer = document.getElementById('videoProgress');
    const progressBar = document.getElementById('videoProgressBar');
    const statsGrid = document.getElementById('videoStats');

    let selectedFile = null;

    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            handleVideoFile(file);
        }
    });

    input.addEventListener('change', () => {
        if (input.files[0]) handleVideoFile(input.files[0]);
    });

    function handleVideoFile(file) {
        selectedFile = file;

        const url = URL.createObjectURL(file);
        previewVid.src = url;
        preview.classList.add('show');

        fileInfo.innerHTML = `
            <span class="file-icon">🎬</span>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeVideoFile()">✕</button>
        `;
        fileInfo.style.display = 'flex';

        detectBtn.disabled = false;
        resultSection.classList.remove('show');
    }

    detectBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        detectBtn.disabled = true;
        detectBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Memproses Video...';
        progressContainer.classList.add('show');
        progressBar.style.width = '0%';

        const formData = new FormData();
        formData.append('video', selectedFile);

        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 8;
            if (progress > 90) progress = 90;
            progressBar.style.width = progress + '%';
        }, 500);

        try {
            const response = await fetch('/detect/video', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);
            progressBar.style.width = '100%';

            const data = await response.json();

            if (data.success) {
                resultVid.src = data.result_video + '?t=' + Date.now();
                resultSection.classList.add('show');

                renderStats(statsGrid, data.class_counts);

                showToast(`Video diproses! ${data.total_detections} deteksi total.`);
            } else {
                showToast(data.error || 'Gagal memproses video', 'error');
            }
        } catch (err) {
            clearInterval(progressInterval);
            showToast('Error: ' + err.message, 'error');
        }

        setTimeout(() => {
            progressContainer.classList.remove('show');
        }, 1000);

        detectBtn.disabled = false;
        detectBtn.innerHTML = '🎬 Deteksi Video';
    });

    window.removeVideoFile = () => {
        selectedFile = null;
        input.value = '';
        preview.classList.remove('show');
        fileInfo.style.display = 'none';
        detectBtn.disabled = true;
        resultSection.classList.remove('show');
        progressContainer.classList.remove('show');
    };
}

// ============================================
// CAMERA REALTIME
// ============================================
function initCamera() {
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const feed = document.getElementById('cameraFeed');
    const placeholder = document.getElementById('cameraPlaceholder');
    const statusDot = document.getElementById('cameraStatusDot');
    const statusText = document.getElementById('cameraStatusText');

    let isRunning = false;

    startBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/start_camera', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                feed.src = '/video_feed';
                feed.style.display = 'block';
                placeholder.style.display = 'none';
                startBtn.style.display = 'none';
                stopBtn.style.display = 'inline-flex';
                statusDot.classList.add('live');
                statusText.textContent = 'LIVE — Kamera Aktif';
                isRunning = true;
                showToast('Kamera realtime aktif!');
            } else {
                showToast(data.error || 'Gagal memulai kamera', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    });

    stopBtn.addEventListener('click', async () => {
        try {
            await fetch('/stop_camera', { method: 'POST' });
        } catch (e) {}

        feed.src = '';
        feed.style.display = 'none';
        placeholder.style.display = 'block';
        startBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'none';
        statusDot.classList.remove('live');
        statusText.textContent = 'Kamera Tidak Aktif';
        isRunning = false;
        showToast('Kamera dihentikan.');
    });
}

// ============================================
// SHARED HELPERS
// ============================================
function renderStats(container, classCounts) {
    const icons = {
        'Coverall': '🥼',
        'Gloves': '🧤',
        'Goggles': '🥽',
        'Mask': '😷'
    };

    let html = '';
    for (const [cls, count] of Object.entries(classCounts)) {
        html += `
            <div class="stat-card">
                <span class="stat-icon">${icons[cls] || '📦'}</span>
                <div class="stat-value">${count}</div>
                <div class="stat-label">${cls}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function renderDetectionTable(container, detections) {
    if (!detections || detections.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="empty-icon">📭</span><p>Tidak ada deteksi ditemukan</p></div>';
        return;
    }

    let html = `
        <table class="detection-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kelas</th>
                    <th>Confidence</th>
                </tr>
            </thead>
            <tbody>
    `;

    detections.forEach((det, i) => {
        const conf = (det.confidence * 100).toFixed(1);
        let badgeClass = 'confidence-high';
        if (conf < 50) badgeClass = 'confidence-low';
        else if (conf < 75) badgeClass = 'confidence-mid';

        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${det.class}</td>
                <td><span class="confidence-badge ${badgeClass}">${conf}%</span></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}
