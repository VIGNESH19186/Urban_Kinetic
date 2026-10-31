from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Vehicle(Base):
    __tablename__ = "vehicles"
    vehicle_id = Column(Integer, primary_key=True, index=True)
    vehicle_type = Column(String)
    registration_identifier = Column(String)

class GPSRecord(Base):
    __tablename__ = "gps_records"
    record_id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    speed = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SensorRecord(Base):
    __tablename__ = "sensor_records"
    sensor_id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer)
    acc_x = Column(Float)
    acc_y = Column(Float)
    acc_z = Column(Float)
    gyro_x = Column(Float)
    gyro_y = Column(Float)
    gyro_z = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Accident(Base):
    __tablename__ = "accidents"
    incident_id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    detection_confidence = Column(Float)
    severity = Column(String)
    detection_method = Column(String)
    verification_status = Column(String, default="pending")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
