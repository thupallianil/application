import os
import re

frontend_dir = r"c:/Users/Gutha Gowthami/Desktop/anil/application/application_frontend/src/pages/settings"

jsx_files = [
    "Business.jsx",
    "Quotes.jsx",
    "Invoices.jsx",
    "Payments.jsx",
    "Tax.jsx",
    "Emails.jsx",
    "Pdf.jsx",
    "Translate.jsx",
    "Extras.jsx",
    "Licenses.jsx"
]

results = {}

for f in jsx_files:
    if f == "Settings.jsx" or f == "General.jsx":
        continue
    filepath = os.path.join(frontend_dir, f)
    with open(filepath, 'r') as file:
        content = file.read()
    
    # Extract useState default values
    match = re.search(r'const\s+\[formData,\s*setFormData\]\s*=\s*useState\(\{([\s\S]*?)\}\);', content)
    if match:
        fields = []
        inner = match.group(1).split(',\n')
        for line in inner:
            line = line.strip()
            if line and ':' in line:
                key = line.split(':')[0].strip()
                fields.append(key)
        results[f.replace('.jsx', '')] = fields
    else:
        results[f.replace('.jsx', '')] = "COULD NOT MATCH"

print(results)
