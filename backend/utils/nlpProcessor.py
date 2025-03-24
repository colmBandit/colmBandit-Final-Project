import sys
import json
import spacy
import re
from fuzzywuzzy import fuzz

nlp = spacy.load("en_core_web_lg")

with open("utils/skills_dataset.json", "r") as file:
    skills_dataset = json.load(file)["skills"]

company_blacklist = [
    "Node.js", "React.js", "Firebase", "Express.js", "MongoDB", "SQL",
    "Machine Learning", "AWS", "Docker", "Azure", "Python", "Linux",
    "Kubernetes", "Distributed Systems", "Bachelor", "Education",
    "University", "Certificate", "Degree", "Concentration", "Team", "Technology"
]

skip_words = [
    "ability", "effectively", "independent", "settings", "team-based"
]

def clean_text(text):
    return text.encode("utf-8", "ignore").decode("utf-8", "ignore")

def clean_skill_line(line):
    line = line.strip()
    if len(line) < 2 or re.search(r"\d{4}", line):
        return None
    if any(word in line.lower() for word in skip_words):
        return None
    return line

def extract_skills_section(text):
    match = re.search(
        r"(skills|technical skills|expertise)[\s\S]*?(?=(experience|work experience|education|projects|languages|$))",
        text, re.I
    )
    skills_found = []
    if match:
        block = match.group()
        lines = block.split('\n')
        for line in lines:
            cleaned = clean_skill_line(line)
            if cleaned:
                for skill in skills_dataset:
                    if fuzz.partial_ratio(skill.lower(), cleaned.lower()) > 85:
                        skills_found.append(skill)
    return list(set(skills_found))

def ai_detect_skills(text):
    detected = []
    for skill in skills_dataset:
        if fuzz.partial_ratio(skill.lower(), text.lower()) > 85:
            detected.append(skill)
    return list(set(detected))

def filter_company_name(name):
    name = name.strip()
    lower = name.lower()
    return (
        len(name) > 2
        and all(term.lower() not in lower for term in company_blacklist)
        and not re.search(r"\b(bachelor|university|education|certificate|degree|concentration)\b", lower)
        and not re.search(r"\d{4}", lower)
    )

def extract_experience(text):
    doc = nlp(text)
    companies = [ent.text.strip() for ent in doc.ents if ent.label_ == "ORG"]
    dates = [ent.text.strip() for ent in doc.ents if ent.label_ == "DATE"]
    locations = [ent.text.strip() for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]

    # Remove blacklisted & irrelevant names
    companies = [c for c in companies if filter_company_name(c)]

    exp_list = []
    for company in companies:
        entry = {"company": company, "dates": "", "location": ""}
        company_pos = text.find(company)

        # Find nearest date within 150 chars
        for date in dates:
            date_pos = text.find(date)
            if 0 < date_pos - company_pos < 150:
                entry["dates"] = date
                break

        # Find nearest location within 150 chars
        for loc in locations:
            loc_pos = text.find(loc)
            if 0 < loc_pos - company_pos < 150:
                entry["location"] = loc
                break

        exp_list.append(entry)
    return exp_list

if __name__ == "__main__":
    resume_text = sys.stdin.read()
    resume_text = clean_text(resume_text)

    skills_from_section = extract_skills_section(resume_text)
    skills_from_ai = ai_detect_skills(resume_text)
    all_skills = list(set(skills_from_section + skills_from_ai))

    experience = extract_experience(resume_text)

    result = {
        "skills": all_skills,
        "experience": experience
    }

    print(json.dumps(result, indent=2))
