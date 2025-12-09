# backend/app/services/analyzer.py

import re
from sentence_transformers import SentenceTransformer, util

# Load semantic model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Static curated skill list
SKILLS_DB = [
    "python", "java", "c++", "javascript", "react", "node.js", "fastapi",
    "django", "flask", "sql", "mysql", "postgresql", "mongodb", "git",
    "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins",
    "sonarqube", "owasp", "rest api", "machine learning", "nlp", "pytest"
]


def normalize(text: str) -> str:
    return text.lower().strip()


def extract_matching_skills(text: str) -> set[str]:
    """
    Matches skills from SKILLS_DB using word-boundary regex search.
    """
    skills = set()
    for skill in SKILLS_DB:
        if re.search(rf"\b{re.escape(skill)}\b", text, re.IGNORECASE):
            skills.add(skill)
    return skills


def extract_skills(resume_text: str, job_description_text: str) -> tuple[list[str], list[str]]:
    """
    Extracts verified and missing skills by matching known skills in both resume and JD text.
    Hybrid of static DB + regex search.
    """
    resume_text = resume_text.lower()
    jd_text = job_description_text.lower()

    resume_skills = extract_matching_skills(resume_text)
    jd_skills = extract_matching_skills(jd_text)

    verified = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)

    return verified, missing


def calculate_match_score(resume_text: str, job_description_text: str) -> int:
    """
    Calculates semantic similarity between resume and job description using Sentence-BERT.
    Returns a score from 0–100.
    """
    if not resume_text or not job_description_text:
        return 0

    try:
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        jd_embedding = model.encode(job_description_text, convert_to_tensor=True)
        score = util.pytorch_cos_sim(resume_embedding, jd_embedding).item()
        return int(score * 100)
    except Exception:
        return 0
