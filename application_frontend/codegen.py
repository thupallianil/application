import os
import re

FRONTEND_DIR = r"c:/Users/Gutha Gowthami/Desktop/anil/application/application_frontend/src/pages/settings"
BACKEND_DIR = r"c:/Users/Gutha Gowthami/Desktop/anil/application2/backend/settings_app"

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

def extract_state(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'const\s+\[(.*?),\s*set.*?\]\s*=\s*useState\(\{([\s\S]*?)\}\);', content)
    if not match: return None, None
    state_var = match.group(1).strip()
    
    # We can rely on extracting fields based on `key:` in the state object
    inner = match.group(2)
    fields = []
    # match any word followed by a colon ignoring quotes, this is robust
    for m in re.finditer(r'([a-zA-Z0-9_]+)\s*:', inner):
        fields.append(m.group(1))
        
    return state_var, fields


models_code = ["from django.db import models\n\n"]
serializers_code = ["from rest_framework import serializers\nfrom .models import *\n"]
views_code = ["from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework import status\n"]
urls_code = ["from django.urls import path\n"]
urls_patterns = ["\nurlpatterns = [\n"]

for f in jsx_files:
    filepath = os.path.join(FRONTEND_DIR, f)
    name = f.replace('.jsx', '')
    state_var, fields = extract_state(filepath)
    if not fields:
        continue
    
    model_name = f"{name}Setting"
    
    # model
    models_code.append(f"class {model_name}(models.Model):\n")
    for field in fields:
        if field.lower() in ['watermark', 'darkmode', 'notifications', 'maintenance']:
            models_code.append(f"    {field} = models.BooleanField(default=False)\n")
        else:
            models_code.append(f"    {field} = models.TextField(blank=True, null=True, default='')\n")
    models_code.append(f"\n    def __str__(self):\n        return '{name} Settings'\n\n")
    
    # serializer
    serializers_code.append(f"\nclass {model_name}Serializer(serializers.ModelSerializer):\n")
    serializers_code.append(f"    class Meta:\n        model = {model_name}\n        fields = {fields}\n")
    
    # view
    views_code.append(f"\nclass {model_name}APIView(APIView):\n")
    views_code.append(f"    def get_object(self):\n")
    views_code.append(f"        obj, created = {model_name}.objects.get_or_create(id=1)\n        return obj\n")
    views_code.append(f"\n    def get(self, request, *args, **kwargs):\n")
    views_code.append(f"        settings = self.get_object()\n        serializer = {model_name}Serializer(settings)\n        return Response(serializer.data)\n")
    views_code.append(f"\n    def put(self, request, *args, **kwargs):\n")
    views_code.append(f"        settings = self.get_object()\n        serializer = {model_name}Serializer(settings, data=request.data, partial=True)\n")
    views_code.append(f"        if serializer.is_valid():\n            serializer.save()\n            return Response(serializer.data)\n")
    views_code.append(f"        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)\n")
    
    # url
    url_path = name.lower()
    urls_code.append(f"from .views import {model_name}APIView\n")
    urls_patterns.append(f"    path('{url_path}/', {model_name}APIView.as_view(), name='{url_path}-settings'),\n")
    
    # frontend update
    with open(filepath, 'r', encoding='utf-8') as file:
        react_content = file.read()
    
    if 'import axios' not in react_content:
        react_content = react_content.replace("import React, { useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport axios from 'axios';")
    
    api_url = f"http://127.0.0.1:8001/api/settings/{url_path}/"
    if 'const API_URL' not in react_content:
        react_content = react_content.replace(f"export default function {name}() {{", f"const API_URL = '{api_url}';\n\nexport default function {name}() {{")
    
    set_state_fn = re.search(r'set[a-zA-Z0-9_]+', react_content).group(0)

    use_effect_code = f"""
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    fetchSettings();
  }}, []);

  const fetchSettings = async () => {{
    try {{
      const res = await axios.get(API_URL);
      const fetched = {{}};
      for (const key in res.data) {{
        if (res.data[key] !== null) fetched[key] = res.data[key];
      }}
      {set_state_fn}(prev => ({{ ...prev, ...fetched }}));
    }} catch (err) {{
      console.error(err);
    }} finally {{
      setLoading(false);
    }}
  }};

  const handleSave = async (e) => {{
    if (e) e.preventDefault();
    try {{
      await axios.put(API_URL, {state_var});
      alert("Settings Saved");
    }} catch (err) {{
      console.error(err);
      alert("Failed to save settings");
    }}
  }};
"""
    if 'const fetchSettings' not in react_content:
        react_content = re.sub(r'(const \[' + state_var + r',.*?\] = useState\(\{[\s\S]*?\}\);)', r'\1\n' + use_effect_code, react_content)
    
    # To fix button safely: find button whose inner html ends with save or just is save explicitly!
    react_content = re.sub(r'<button\s+className="([^"]*(Save|blue-600)[^"]*)"\s*>\s*Save\s*</button>', r'<button onClick={handleSave} className="\1">Save</button>', react_content, flags=re.IGNORECASE)
    # alternatively, just replace all "Save</button>" if they don't have onClick
    react_content = react_content.replace('>\n          Save\n        </button>', ' onClick={handleSave}>\n          Save\n        </button>')
    
    # insert if (loading)
    if "const fetchSettings" in react_content and "if (loading)" not in react_content:
        react_content = react_content.replace('return (\n    <div className="w-full">', 'if (loading) return <p className="p-4">Loading...</p>;\n\n  return (\n    <div className="w-full">')
    
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(react_content)

urls_patterns.append("]\n")

general_model = """
class GeneralSetting(models.Model):
    yearStart = models.CharField(max_length=50, default="01 Apr")
    yearEnd = models.CharField(max_length=50, default="31 Mar")
    preDefinedLineItems = models.TextField(blank=True, default="")
    def __str__(self): return "General Settings"
"""
models_code.append(general_model)

general_serializer = """
class GeneralSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralSetting
        fields = ['yearStart', 'yearEnd', 'preDefinedLineItems']
"""
serializers_code.append(general_serializer)

general_view = """
class GeneralSettingAPIView(APIView):
    def get_object(self):
        obj, created = GeneralSetting.objects.get_or_create(id=1)
        return obj

    def get(self, request, *args, **kwargs):
        settings = self.get_object()
        serializer = GeneralSettingSerializer(settings)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        settings = self.get_object()
        serializer = GeneralSettingSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""
views_code.append(general_view)

urls_code.append("from .views import GeneralSettingAPIView\n")
urls_patterns.insert(1, "    path('general/', GeneralSettingAPIView.as_view(), name='general-settings'),\n")

with open(os.path.join(BACKEND_DIR, 'models.py'), 'w', encoding='utf-8') as f:
    f.write("".join(models_code))
with open(os.path.join(BACKEND_DIR, 'serializers.py'), 'w', encoding='utf-8') as f:
    f.write("".join(serializers_code))
with open(os.path.join(BACKEND_DIR, 'views.py'), 'w', encoding='utf-8') as f:
    f.write("".join(views_code))
with open(os.path.join(BACKEND_DIR, 'urls.py'), 'w', encoding='utf-8') as f:
    f.write("".join(urls_code) + "".join(urls_patterns))

print("DONE GENERATING")
