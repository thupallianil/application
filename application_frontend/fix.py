import os
import re

DIR = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\settings"

files_to_fix = ["Extras.jsx", "Licenses.jsx", "Payments.jsx", "Pdf.jsx", "Tax.jsx", "Translate.jsx", "Emails.jsx"]

for file in files_to_fix:
    path = os.path.join(DIR, file)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add imports
    if 'import axios' not in content:
        content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";\nimport axios from "axios";')

    # Fix settings(prev => ...
    # Find setX state variable
    state_match = re.search(r'const \[(\w+), (set\w+)\] = useState\(', content)
    if state_match:
        state_var, setter_var = state_match.groups()
        if 'settings(prev =>' in content:
            content = content.replace('settings(prev =>', f'{setter_var}(prev =>')

    # Fix form submit
    if 'handleSubmit' not in content:
        # Add handleSubmit before return
        handle_submit_func = f"""  const handleSubmit = (e) => {{
    e.preventDefault();
    handleSave(e);
  }};

  return ("""
        content = content.replace("  return (", handle_submit_func)
    
    # modify console.log(...) block
    if 'console.log(' in content:
         content = re.sub(r'const handleSubmit = \(e\) => \{\s*e\.preventDefault\(\);\s*console\.log\(.*?\);\s*\};', 
               f'const handleSubmit = (e) => {{\n    e.preventDefault();\n    handleSave(e);\n  }};\n', content)

    # ensure form has onSubmit
    if '<form' in content and 'onSubmit=' not in content:
         content = content.replace('<form', '<form onSubmit={handleSubmit}')
         
    # ensure button type=submit might be needed, but form handles it? yes.
         
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Done")
