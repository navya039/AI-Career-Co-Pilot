# backend/app/services/analyzer.py

import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Curated skill list
SKILLS_DB = [
    "python", "java", "c++", "javascript", "react", "node.js", "fastapi",
    "django", "flask", "sql", "mysql", "postgresql", "mongodb", "git",
    "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins",
    "sonarqube", "owasp", "rest api", "machine learning", "nlp", "pytest",
]


def calculate_match_score(resume_text: str, job_description_text: str) -> int:
    """
    Simple TF-IDF + cosine similarity between resume and JD.
    """
    if not resume_text or not job_description_text:
        return 0

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description_text])
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(cosine_sim[0][0])
        return int(score * 100)
    except Exception:
        return 0


def _extract_matching_skills(text: str) -> set[str]:
    """
    Match skills from SKILLS_DB using word-boundary regex search (case-insensitive).
    """
    text_lower = text.lower()
    skills = set()
    for skill in SKILLS_DB:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            skills.add(skill)
    return skills


def extract_skills(resume_text: str, job_description_text: str) -> tuple[list[str], list[str]]:
    """
    Extract verified and missing skills using the curated SKILLS_DB list.
    """
    resume_skills = _extract_matching_skills(resume_text)
    jd_skills = _extract_matching_skills(job_description_text)

    verified = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)

    return verified, missing
