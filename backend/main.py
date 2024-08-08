from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from src import models, schemas


# models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.post("/users/", response_model=schemas.Item)
def create_user(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return print()


@app.post("/roles")
def roles():
    return print()
