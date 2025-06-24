# backend/app/services/analyzer.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

def calculate_match_score(resume_text: str, job_description_text: str) -> int:
    """
    Calculates a match score based on cosine similarity of TF-IDF vectors.
    This is a core NLP technique to demonstrate.
    """
    if not resume_text or not job_description_text:
        return 0

    texts = [resume_text, job_description_text]

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(texts)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = int(cosine_sim[0][0] * 100)
        return score
    except ValueError:
        return 0


def extract_skills(resume_text: str, job_description_text: str) -> tuple[list, list, list]:
    """
    Extracts skills to find what's on the resume, what's matching, and what's missing.
    """
    # This list is your "database". You can expand it with more relevant skills.
    SKILLS_DB = [
        'python', 'java', 'c++', 'javascript', 'react', 'node.js', 'fastapi',
        'django', 'flask', 'sql', 'mysql', 'postgresql', 'mongodb', 'git',
        'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins',
        'sonarqube', 'owasp', 'rest api', 'machine learning', 'nlp', 'pytest'
    ]

    resume_skills = set()
    for skill in SKILLS_DB:
        if re.search(r'\b' + re.escape(skill) + r'\b', resume_text, re.IGNORECASE):
            resume_skills.add(skill.capitalize())

    job_skills = set()
    for skill in SKILLS_DB:
        if re.search(r'\b' + re.escape(skill) + r'\b', job_description_text, re.IGNORECASE):
            job_skills.add(skill.capitalize())

    matching_skills = sorted(list(resume_skills.intersection(job_skills)))
    missing_skills = sorted(list(job_skills.difference(resume_skills)))

    return matching_skills, missing_skills