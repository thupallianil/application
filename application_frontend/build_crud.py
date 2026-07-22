import os
import re

FRONTEND_DIR = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages"

COMPONENTS = [
    ("quotations/QuoteList.jsx", "http://127.0.0.1:8001/api/quotations/", ["Quote No", "Client", "Amount", "Status"], "quotations", "Quote"),
    ("invoices/InvoiceList.jsx", "http://127.0.0.1:8001/api/invoices/", ["Invoice No", "Client", "Amount", "Status"], "invoices", "Invoice"),
    ("payments/PaymentList.jsx", "http://127.0.0.1:8001/api/payments/", ["Payment ID", "Client", "Amount", "Date"], "payments", "Payment"),
    ("clients/ClientList.jsx", "http://127.0.0.1:8001/api/clients/", ["Client Name", "Email", "Phone", "Date"], "clients", "Client"),
]

for file_rel, api_url, columns, route_name, entity_name in COMPONENTS:
    path = os.path.join(FRONTEND_DIR, file_rel)

    columns_str = "[\n" + "".join([f'    "{col}",\n' for col in columns]) + "  ]"

    if "Quote" in entity_name:
        mapper = 'id: item.id, quote: item.quoteNumber || `QT-${item.id}`, client: item.clientName || item.client, amount: item.total || item.amount || "₹0", status: item.status || "Pending"'
    elif "Invoice" in entity_name:
        mapper = 'id: item.id, invoice: item.invoiceNumber || `INV-${item.id}`, client: item.clientName || item.client, amount: item.total || item.amount || "₹0", status: item.status || "Pending"'
    elif "Payment" in entity_name:
        mapper = 'id: item.id, payment: item.paymentId || `PAY-${item.id}`, client: item.clientName || item.client, amount: item.amount || "₹0", date: item.date || item.created_at || "N/A"'
    elif "Client" in entity_name:
        mapper = 'id: item.id, name: item.name || item.client || "Unknown", email: item.email || "N/A", phone: item.phone || "N/A", date: item.created_at || item.created || "N/A"'

    new_content = f"""import React, {{ useState, useEffect }} from "react";
import {{ useNavigate, NavLink }} from "react-router-dom";
import axios from "axios";
import {{ toast }} from "react-toastify";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";

const API_URL = "{api_url}";

export default function {entity_name}List() {{
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = {columns_str};

  useEffect(() => {{
    fetchData();
  }}, []);

  const fetchData = async () => {{
    try {{
      const res = await axios.get(API_URL);
      setData(res.data);
    }} catch (error) {{
      toast.error("Failed to load {entity_name}s");
      console.error(error);
    }}
  }};

  const handleDelete = async (id) => {{
    if (!window.confirm("Are you sure you want to delete this {entity_name}?")) return;
    try {{
      await axios.delete(API_URL + id + "/");
      toast.success("{entity_name} deleted successfully!");
      fetchData(); // Refresh list
    }} catch (error) {{
      toast.error("Failed to delete {entity_name}");
      console.error(error);
    }}
  }};

  const handleEdit = (id) => {{
    navigate(`/{route_name}/edit/${{id}}`);
  }};

  const handleView = (id) => {{
    navigate(`/{route_name}/${{id}}`);
  }};

  // Format data for Table
  const formattedData = data.map(item => ({{
    {mapper}
  }})).filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 bg-[#f0f0f1] min-h-screen p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1d2327]">
          {entity_name}s
        </h1>
        <NavLink to="/{route_name}/add" className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 text-sm rounded cursor-pointer font-medium">
          Add New {entity_name}
        </NavLink>
      </div>

      <div className="flex justify-end bg-white p-4 items-center shadow-sm border border-[#c3c4c7] rounded-t">
        <SearchBar
          value={{search}}
          onChange={{(e) => setSearch(e.target.value)}}
        />
      </div>

      <Table
        columns={{columns}}
        data={{formattedData}}
        onView={{handleView}}
        onEdit={{handleEdit}}
        onDelete={{handleDelete}}
      />

    </div>
  );
}}
"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Done")
