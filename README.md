# RoadGuard AI
Detect Faster. Respond Smarter. Save Lives.

## Installation

### Backend
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
4. pip install -r requirements.txt
5. python train_models.py  # Generates the synthetic models
6. uvicorn main:app --reload

### Frontend
1. cd frontend
2. npm install
3. npm run dev
