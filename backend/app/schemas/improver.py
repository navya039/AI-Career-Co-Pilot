from pydantic import BaseModel

class ImproverRequest(BaseModel):
    bullet_point: str
    improvement_type: str | None = None

class ImproverResponse(BaseModel):
    improved_text: str