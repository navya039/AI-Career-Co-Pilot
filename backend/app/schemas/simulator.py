from pydantic import BaseModel

class SimulatorRequest(BaseModel):
    resume_text: str
    job_description_text: str