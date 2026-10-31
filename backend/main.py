from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, database
import joblib
import numpy as np
import datetime
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="RoadGuard AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SensorData(BaseModel):
    vehicle_id: int
    acc_x: float
    acc_y: float
    acc_z: float
    gyro_x: float
    gyro_y: float
    gyro_z: float

class GPSData(BaseModel):
    vehicle_id: int
    latitude: float
    longitude: float
    speed: float

# Load models safely
try:
    iso_forest = joblib.load('iso_forest.joblib')
    rf_clf = joblib.load('rf_model.joblib')
    xgb_sev = joblib.load('xgb_severity.joblib')
except:
    iso_forest = rf_clf = xgb_sev = None

@app.get("/api/health")
def health_check():
    return {"status": "ok", "models_loaded": iso_forest is not None}

@app.post("/api/sensors/data")
def receive_sensor_data(data: SensorData, db: Session = Depends(get_db)):
    if rf_clf:
        features = np.array([[data.acc_x, data.acc_y, data.acc_z, data.gyro_x, data.gyro_y, data.gyro_z]])
        is_anomaly = iso_forest.predict(features)[0] == -1
        classification = rf_clf.predict(features)[0]
        
        if classification == 3 or is_anomaly:
            severity = xgb_sev.predict(features)[0]
            sev_map = {0: "Low", 1: "Medium", 2: "High"}
            
            new_accident = models.Accident(
                latitude=0.0, # Would link with latest GPS
                longitude=0.0,
                detection_confidence=0.95,
                severity=sev_map.get(severity, "Unknown"),
                detection_method="AI Sensor Analysis"
            )
            db.add(new_accident)
            db.commit()
            return {"status": "Accident detected", "severity": sev_map.get(severity)}
            
    return {"status": "Normal"}

@app.get("/api/accidents")
def get_accidents(db: Session = Depends(get_db)):
    return db.query(models.Accident).order_by(models.Accident.timestamp.desc()).all()
