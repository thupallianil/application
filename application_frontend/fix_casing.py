import os

frontend_dir = r"c:/Users/Gutha Gowthami/Desktop/anil/application/application_frontend/src/pages/settings"
for f in os.listdir(frontend_dir):
    if f.endswith('.jsx'):
        path = os.path.join(frontend_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            c = file.read()
        c = c.replace('setFormdata', 'setFormData')
        c = c.replace('setFormdataSettings', 'setFormData')
        
        # fix loading missing in return
        if "if (loading) return <p" not in c and "const fetchSettings =" in c:
            c = c.replace("return (", "if (loading) return <p className=\"p-4\">Loading settings...</p>;\n\n  return (", 1)

        with open(path, 'w', encoding='utf-8') as file:
            file.write(c)
print("Done")
