from ultralytics import YOLO
import torch
import os

def main():

    # CEK CUDA
    print("CUDA Available :", torch.cuda.is_available())

    if torch.cuda.is_available():
        print("GPU Used :", torch.cuda.get_device_name(0))
        device = 0
    else:
        device = "cpu"

    # BASE DIRECTORY
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    # LOAD MODEL YOLOv11
    model = YOLO("yolo11n.pt")

    # TRAINING
    model.train(

        # DATASET
        data=os.path.join(BASE_DIR, "dataset", "data.yaml"),

        # TRAINING
        epochs=100,
        imgsz=640,
        batch=16,

        # OPTIMIZER
        optimizer="AdamW",
        lr0=0.001,

        # DEVICE GPU
        device=device,

        # WINDOWS FIX
        workers=0,

        # MEMORY
        cache=False,

        # SAVE RESULT
        project=os.path.join(BASE_DIR, "runs", "detect"),
        name="medical_ppe_yolo11",

        # TRAINING FEATURE
        patience=20,
        save=True,
        verbose=True,

        # AUGMENTATION
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,

        degrees=10,
        translate=0.1,
        scale=0.5,
        fliplr=0.5,

        # MIXUP
        mosaic=1.0,
        mixup=0.1
    )

    # VALIDATION
    metrics = model.val()

    print(metrics)

if __name__ == "__main__":
    main()