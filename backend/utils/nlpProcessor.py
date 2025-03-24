import sys
import json
import spacy
import re

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

def clean_text(text):
    # Clean special characters and excessive whitespace
    return re.sub(r'\s+', ' ', text.replace('\n', ' ')).strip()

def extract_entities(text):
    doc = nlp(text)
    skills = set()
    organizations = set()
    locations = set()
    names = set()
    dates = set()

    for ent in doc.ents:
        if ent.label_ == "ORG":
            organizations.add(ent.text.strip())
        elif ent.label_ == "GPE":
            locations.add(ent.text.strip())
        elif ent.label_ == "PERSON":
            names.add(ent.text.strip())
        elif ent.label_ == "DATE":
            dates.add(ent.text.strip())

    # Also use regex to find keywords that suggest experience:
    experience_keywords = ["experience", "worked at", "responsibilities", "role", "projects", "employment", "position"]
    lines = text.split('.')
    experience_lines = [line.strip() for line in lines if any(keyword in line.lower() for keyword in experience_keywords)]

    # Join cleaned experience section
    experience_section = " | ".join(experience_lines)

    # Attempt skill extraction using keywords (basic fallback if JS doesn't catch all)
    skill_patterns = re.compile(r"(JavaScript|TypeScript|React|Vue\.js|Angular|Node\.js|Express|Python|Django|Flask|MongoDB|Firebase|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes|GraphQL|HTML|CSS|Tailwind|Jest|Mocha|Next\.js|Git|GitHub|Figma)", re.IGNORECASE)
    skill_matches = skill_patterns.findall(text)
    for skill in skill_matches:
        skills.add(skill)

    result = {
        "skills": list(skills),
        "organizations": list(organizations),
        "locations": list(locations),
        "names": list(names),
        "dates": list(dates),
        "experienceSection": clean_text(experience_section)
    }

    return result

if __name__ == "__main__":
    input_text = sys.stdin.read()
    cleaned_input = clean_text(input_text)
    extracted_data = extract_entities(cleaned_input)
    print(json.dumps(extracted_data))
