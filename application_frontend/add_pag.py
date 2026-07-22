import os
DIR = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages"

files = ["quotations/QuoteList.jsx", "invoices/InvoiceList.jsx", "payments/PaymentList.jsx"]

for f in files:
    path = os.path.join(DIR, f)
    with open(path, "r", encoding="utf-8") as file:
        content = file.read()
    
    if "<Pagination" not in content:
        content = content.replace("/>\n\n    </div>", "/>\n\n      <Pagination\n        currentPage={page}\n        totalPages={5}\n        onPageChange={setPage}\n      />\n\n    </div>")
        
        with open(path, "w", encoding="utf-8") as file:
            file.write(content)

print("Done")
