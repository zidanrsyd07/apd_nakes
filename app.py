"""
Medical PPE Detection Web Application
Flask backend with YOLOv11 integration
"""

import os
import uuid
import time
import threading
from flask import Flask, render_template, request, jsonify, Response
from ultralytics import YOLO
import cv2
import numpy as np

# ============================================
# APP CONFIGURATION
# ============================================
app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESULTS_DIR = os.path.join(BASE_DIR, "static", "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

UPLOAD_EXTENSIONS_IMG = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
UPLOAD_EXTENSIONS_VID = {'.mp4', '.avi', '.mov', '.mkv', '.wmv'}

# ============================================
# LOAD YOLO MODEL
# ============================================
MODEL_PATH = os.path.join(BASE_DIR, "runs", "detect", "medical_ppe_yolo11-3", "weights", "best.pt")

if not os.path.exists(MODEL_PATH):
    print(f"[WARNING] Model not found at {MODEL_PATH}, falling back to yolo11n.pt")
    MODEL_PATH = os.path.join(BASE_DIR, "yolo11n.pt")

print(f"[INFO] Loading model from: {MODEL_PATH}")
model = YOLO(MODEL_PATH)
CLASS_NAMES = model.names
print(f"[INFO] Classes: {CLASS_NAMES}")

# ============================================
# CAMERA STATE
# ============================================
camera_lock = threading.Lock()
camera = None
camera_running = False


# ============================================
# ROUTES
# ============================================
@app.route("/")
def index():
    """Render main page."""
    return render_template("index.html")


@app.route("/detect/image", methods=["POST"])
def detect_image():
    """Handle image upload and detection."""
    if "image" not in request.files:
        return jsonify({"success": False, "error": "Tidak ada file gambar"})

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"success": False, "error": "Nama file kosong"})

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in UPLOAD_EXTENSIONS_IMG:
        return jsonify({"success": False, "error": f"Format {ext} tidak didukung"})

    try:
        # Read image
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"success": False, "error": "Gagal membaca gambar"})

        # Run detection
        results = model(img, conf=0.25)
        result = results[0]

        # Draw results on image
        annotated = result.plot()

        # Save result
        result_filename = f"result_{uuid.uuid4().hex[:8]}.jpg"
        result_path = os.path.join(RESULTS_DIR, result_filename)
        cv2.imwrite(result_path, annotated)

        # Extract detection info
        detections = []
        class_counts = {name: 0 for name in CLASS_NAMES.values()}

        for box in result.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            cls_name = CLASS_NAMES[cls_id]
            class_counts[cls_name] += 1
            detections.append({
                "class": cls_name,
                "confidence": conf
            })

        return jsonify({
            "success": True,
            "result_image": f"/static/results/{result_filename}",
            "detections": detections,
            "class_counts": class_counts,
            "total_detections": len(detections)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/detect/video", methods=["POST"])
def detect_video():
    """Handle video upload and detection."""
    if "video" not in request.files:
        return jsonify({"success": False, "error": "Tidak ada file video"})

    file = request.files["video"]
    if file.filename == "":
        return jsonify({"success": False, "error": "Nama file kosong"})

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in UPLOAD_EXTENSIONS_VID:
        return jsonify({"success": False, "error": f"Format {ext} tidak didukung"})

    try:
        # Save uploaded video temporarily
        temp_id = uuid.uuid4().hex[:8]
        temp_path = os.path.join(RESULTS_DIR, f"temp_{temp_id}{ext}")
        file.save(temp_path)

        # Open video
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            os.remove(temp_path)
            return jsonify({"success": False, "error": "Gagal membuka video"})

        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # Output video
        result_filename = f"result_{temp_id}.mp4"
        result_path = os.path.join(RESULTS_DIR, result_filename)
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(result_path, fourcc, fps, (w, h))

        class_counts = {name: 0 for name in CLASS_NAMES.values()}
        total_detections = 0
        frame_count = 0
        max_frames = 300  # Limit to ~10-12 seconds at 25fps

        while True:
            ret, frame = cap.read()
            if not ret or frame_count >= max_frames:
                break

            # Run detection every 2 frames for speed
            if frame_count % 2 == 0:
                results = model(frame, conf=0.25, verbose=False)
                result = results[0]
                annotated = result.plot()

                for box in result.boxes:
                    cls_id = int(box.cls[0])
                    cls_name = CLASS_NAMES[cls_id]
                    class_counts[cls_name] += 1
                    total_detections += 1
            else:
                annotated = frame

            writer.write(annotated)
            frame_count += 1

        cap.release()
        writer.release()
        os.remove(temp_path)

        return jsonify({
            "success": True,
            "result_video": f"/static/results/{result_filename}",
            "class_counts": class_counts,
            "total_detections": total_detections,
            "frames_processed": frame_count
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/start_camera", methods=["POST"])
def start_camera():
    """Start webcam capture."""
    global camera, camera_running

    with camera_lock:
        if camera_running and camera is not None:
            return jsonify({"success": True, "message": "Kamera sudah aktif"})

        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            camera = None
            return jsonify({"success": False, "error": "Gagal membuka kamera. Pastikan webcam terhubung."})

        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        camera_running = True

    return jsonify({"success": True, "message": "Kamera berhasil dimulai"})


@app.route("/stop_camera", methods=["POST"])
def stop_camera():
    """Stop webcam capture."""
    global camera, camera_running

    with camera_lock:
        camera_running = False
        if camera is not None:
            camera.release()
            camera = None

    return jsonify({"success": True, "message": "Kamera dihentikan"})


def generate_frames():
    """Generate MJPEG frames from webcam with YOLO detection."""
    global camera, camera_running

    while camera_running:
        with camera_lock:
            if camera is None or not camera_running:
                break
            ret, frame = camera.read()

        if not ret:
            break

        # Run YOLO detection
        try:
            results = model(frame, conf=0.25, verbose=False)
            annotated = results[0].plot()
        except Exception:
            annotated = frame

        # Encode to JPEG
        ret, buffer = cv2.imencode('.jpg', annotated, [cv2.IMWRITE_JPEG_QUALITY, 80])
        if not ret:
            continue

        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Small delay to control frame rate
        time.sleep(0.03)


@app.route("/video_feed")
def video_feed():
    """MJPEG streaming endpoint for realtime camera."""
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )


# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    print("=" * 50)
    print("  APD Nakes Detector — Medical PPE Detection")
    print("  http://localhost:5000")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
