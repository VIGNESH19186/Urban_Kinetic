import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier
import xgboost as xgb
import joblib
import os

# Generate synthetic dataset
def create_synthetic_data():
    np.random.seed(42)
    n_samples = 1000
    
    # Normal driving (0), Harsh braking (1), Suspicious (2), Accident (3)
    labels = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.7, 0.15, 0.1, 0.05])
    
    acc_x = np.random.normal(0, 1, n_samples)
    acc_y = np.random.normal(9.8, 1, n_samples)
    acc_z = np.random.normal(0, 1, n_samples)
    gyro = np.random.normal(0, 0.1, (n_samples, 3))
    
    # Inject anomalies for accidents
    accidents = labels == 3
    acc_x[accidents] += np.random.normal(20, 5, sum(accidents))
    acc_y[accidents] += np.random.normal(20, 5, sum(accidents))
    
    data = pd.DataFrame({
        'acc_x': acc_x, 'acc_y': acc_y, 'acc_z': acc_z,
        'gyro_x': gyro[:,0], 'gyro_y': gyro[:,1], 'gyro_z': gyro[:,2]
    })
    return data, labels

if __name__ == "__main__":
    print("Generating synthetic data...")
    X, y = create_synthetic_data()
    
    print("Training Isolation Forest...")
    iso_forest = IsolationForest(contamination=0.05, random_state=42)
    iso_forest.fit(X.values)
    joblib.dump(iso_forest, 'iso_forest.joblib')
    
    print("Training Random Forest...")
    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_clf.fit(X.values, y)
    joblib.dump(rf_clf, 'rf_model.joblib')
    
    print("Training XGBoost (Severity)...")
    # Simulate severity: 0=Low, 1=Medium, 2=High
    severity_labels = np.where(y == 3, np.random.choice([0, 1, 2], size=len(y)), 0)
    xgb_model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')
    xgb_model.fit(X.values, severity_labels)
    joblib.dump(xgb_model, 'xgb_severity.joblib')
    
    print("Models trained and saved successfully.")
