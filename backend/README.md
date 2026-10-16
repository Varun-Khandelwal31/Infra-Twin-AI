# 🔬 InfraTwin AI — Core AI Volumetric Inspection Pipeline (`backend/`)

This directory contains the Python AI service responsible for **pixel-precise instance segmentation** and **monocular depth estimation** to compute exact 3D pothole volume ($m^3$) and generate Bills of Quantities (BOQ).

---

## 🎯 Architecture & Pipeline Breakdown

Unlike legacy 2D object detection models (which only draw bounding boxes), InfraTwin AI uses a 2-stage depth estimation & segmentation pipeline:

```
┌────────────────────────┐
│  Input Drone Image     │  (Indian Urban/Highway Corridor)
└───────────┬────────────┘
            │
    ┌───────┴──────────────────────────┐
    │                                  │
    ▼                                  ▼
┌────────────────────────┐   ┌──────────────────────────┐
│ YOLOv8-Seg Instance    │   │ Depth Anything Monocular │
│ Segmentation           │   │ Depth Estimation         │
│ (RDD2022-India / D40)  │   │ (LiheYoung/depth-small)  │
└───────────┬────────────┘   └─────────┬────────────────┘
            │                          │
            │  Mask Pixel Matrix       │  Depth Map D(x,y)
            └───────────┬──────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Volumetric Engine     │
            │ (IRC:82 & MoRTH DBM)  │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Area (m²), Depth (cm) │
            │ Volume (m³), BOQ Json │
            └───────────────────────┘
```

### 🇮🇳 Indian Road Damage Dataset (RDD2022-India) Taxonomy
The pipeline supports the RDD2022 Indian benchmark classes:
- `D00`: Longitudinal Wheel-path & Non-wheelpath Cracks
- `D10`: Transverse Thermal Cracks
- `D20`: Alligator / Fatigue Web Cracking
- `D40`: Water-Bound Potholes & Structural Cavities
- `D43`: Pedestrian Crosswalk Wear
- `D44`: Thermoplastic Lane Marking Wear

---

## 📐 Mathematical Volume Calculation Formula

$$\text{Scale}_{\text{Area}} = \left( \frac{2 \cdot H \cdot \tan(\theta/2)}{W_{\text{img}}} \right)^2$$

$$\text{Area}_{\text{pixels}} = \sum \text{Segmentation\_Mask}(x,y)$$

$$\text{Depth}_{\text{avg}} = \frac{1}{N} \sum_{(x,y) \in \text{Mask}} D(x,y)$$

$$\text{Volume } (m^3) = \text{Scale}_{\text{Area}} \cdot \text{Area}_{\text{pixels}} \cdot \text{Scale}_{\text{Depth}} \cdot \text{Depth}_{\text{avg}}$$

Where:
- $H$: Drone flight altitude (e.g. $12.5\text{m}$)
- $\theta$: Camera FOV angle (e.g. $84^\circ$)
- $D(x,y)$: Monocular depth prediction from Depth Anything
- $\text{Scale}_{\text{Depth}}$: Depth conversion factor ($0.01\text{m/cm}$)

---

## 🚀 Running the Python Backend Server

### 1. Create Virtual Environment & Install Dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Launch FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```
Server runs at **[http://localhost:8000](http://localhost:8000)** (OpenAPI Swagger Docs at **[http://localhost:8000/docs](http://localhost:8000/docs)**).

---

## 📡 API Endpoints

- `GET /` — Service metadata and loaded PyTorch model information.
- `GET /health` — Service health check.
- `POST /api/v1/inspect` — Multipart upload endpoint for drone road scan processing.
- `POST /api/v1/compute-volume` — Raw metric verification endpoint.
