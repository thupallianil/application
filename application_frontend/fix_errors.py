import os, re, glob

# Fix api.js
filepath = "src/services/api.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

extractor = """
    // Extract DRF field errors
    if (data) {
      if (typeof data === "string") {
         error.message = data;
      } else if (data.detail) {
         error.message = String(data.detail);
      } else if (data.non_field_errors) {
         error.message = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors);
      } else {
         const firstKey = Object.keys(data)[0];
         if (firstKey && data[firstKey]) {
            const val = data[firstKey];
            error.message = Array.isArray(val) ? val[0] : String(val);
         }
      }
    }
"""

if "// Extract DRF field errors" not in content:
    content = content.replace('    console.error("API Error:", {', extractor + '    console.error("API Error:", {')
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched api.js")

# Fix all jsx files
count = 0
for root, dirs, files in os.walk("src/pages"):
    for file in files:
        if file.endswith(".jsx"):
            p = os.path.join(root, file)
            with open(p, "r", encoding="utf-8") as f:
                c = f.read()
            
            # replace catch { toast.error("something") } -> catch (err) { toast.error(err.message || "something") }
            def repl(m):
                # m.group(1) is the err var if present (e.g. `(err) `)
                # m.group(2) is the inner content
                err_var = m.group(1)
                inner = m.group(2)
                
                if err_var:
                    v = err_var.strip("() ")
                else:
                    v = "err"
                
                # find toast.error("something")
                # and replace the content
                new_inner = re.sub(r'toast\.error\((.*?)\)', lambda tm: f'toast.error({v}.message || {tm.group(1)})', inner)
                return f'catch ({v}) {{{new_inner}'

            new_c = re.sub(r'catch\s*(\([a-zA-Z0-9_]+\))?\s*\{([^}]*toast\.error[^}]*)', repl, c)
            
            if new_c != c:
                with open(p, "w", encoding="utf-8") as f:
                    f.write(new_c)
                count += 1
                
print(f"Patched {count} jsx files")
