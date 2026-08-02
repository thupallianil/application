import re
import os

add_inv_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\invoices\AddInvoice.jsx"
edit_client_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\clients\EditClient.jsx"

with open(add_inv_path, "r", encoding="utf-8") as f:
    add_invoice_content = f.read()

styles_match = re.search(r"const styles = `([\s\S]*?)`;", add_invoice_content)
styles = styles_match.group(1)

components_match = re.search(r"(function applyFormat[\s\S]*?)(?:function PreviewModal|export default function AddInvoice)", add_invoice_content)
components = components_match.group(1)

new_content = """import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Building2, Save, X, Eye, 
  HelpCircle, FileCheck, Bold, Italic, Underline,
  List, ListOrdered, Link, Image, Code
} from "lucide-react";

/* ─────────────────────────────── styles ─────────────────────────────── */
const styles = `""" + styles + """`;

""" + components + """

export default function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [clientData, setClientData] = useState({
    client: "", 
    email: "", 
    phone: "", 
    address: "", 
    company: "", 
    notes: "",
    status: "Active"
  });

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const { data } = await api.get(`/clients/${id}/`);
      setClientData({
        client: data.client || data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        company: data.company || "",
        notes: data.notes || "",
        status: "Active"
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch client details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const submitClient = async (e) => {
    e.preventDefault();
    if (!clientData.client.trim()) { toast.error("Client name is required"); return; }
    
    setSaving(true);
    try {
      await api.put(`/clients/${id}/`, clientData);
      toast.success("Client Updated successfully!");
      navigate("/clients");
    } catch {
      toast.error("Unable to update client");
    }
    setSaving(false);
  };

  const showHelp = () =>
    toast.info("Update client details, contact info, and click 'Update Client'.", { autoClose: 6000 });

  const statusBadgeClass = clientData.status === "Active" ? "status-paid" : "status-draft";

  if (loading) {
    return (
      <div className="ai-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{color: '#646970'}}>Loading client details...</div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="ai-page">
        <form onSubmit={submitClient}>
          <div className="ai-topbar">
            <h1>
              <User size={20} style={{ display: "inline", marginRight: 8, color: "#2271b1" }} />
              Edit Client
              {clientData.client && <span style={{fontSize:16, color:"#646970", marginLeft: 8}}>— {clientData.client}</span>}
            </h1>
            <div className="ai-topbar-actions">
              <button type="button" onClick={() => navigate("/clients")} className="ai-btn ai-btn-outline">
                <X size={14} /> Cancel
              </button>
              <button type="button" onClick={() => navigate(`/clients/${id}`)} className="ai-btn ai-btn-outline">
                <Eye size={14} /> View
              </button>
              <button type="submit" disabled={saving} className="ai-btn ai-btn-primary">
                <Save size={14} /> {saving ? "Saving…" : "Update Client"}
              </button>
            </div>
          </div>

          <div className="ai-layout">
            <div className="ai-main">
              <div className="ai-page-title-wrap">
                <input
                  type="text"
                  name="client"
                  value={clientData.client}
                  onChange={handleChange}
                  placeholder="Enter Client Name"
                  className="ai-title-input"
                  required
                />
              </div>

              <Panel title="Notes / Description">
                <RichEditor
                  name="notes"
                  value={clientData.notes}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Client notes / special instructions..."
                />
              </Panel>

              <Panel title="Contact Information">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="ai-label"><Mail size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={clientData.email} 
                      onChange={handleChange} 
                      placeholder="client@example.com"
                      className="ai-input" 
                    />
                  </div>
                  <div>
                    <label className="ai-label"><Phone size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={clientData.phone} 
                      onChange={handleChange} 
                      placeholder="+91 00000 00000"
                      className="ai-input" 
                    />
                  </div>
                  <div style={{gridColumn: "1 / -1"}}>
                    <label className="ai-label"><Building2 size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Company Name</label>
                    <input 
                      type="text" 
                      name="company" 
                      value={clientData.company} 
                      onChange={handleChange} 
                      placeholder="Client's Company Name"
                      className="ai-input" 
                    />
                  </div>
                </div>
              </Panel>
              
              <Panel title="Physical Address">
                <div style={{ padding: "0 0 10px 0" }}>
                   <label className="ai-label"><MapPin size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Address Details</label>
                   <textarea
                     name="address"
                     value={clientData.address}
                     onChange={handleChange}
                     rows={3}
                     placeholder="Enter full address..."
                     className="ai-input"
                     style={{ minHeight: "80px", resize: "y" }}
                   />
                </div>
              </Panel>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => navigate("/clients")} className="ai-btn ai-btn-outline">
                  <X size={14} /> Cancel
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => navigate(`/clients/${id}`)} className="ai-btn ai-btn-outline">
                    <Eye size={14} /> View
                  </button>
                  <button type="submit" disabled={saving} className="ai-btn ai-btn-primary">
                    <Save size={14} /> {saving ? "Saving…" : "Update Client"}
                  </button>
                </div>
              </div>
            </div>

            <div className="ai-sidebar">
              <div className="ai-panel ai-sidebar-publish">
                <div className="ai-panel-header">
                  <h2>Publish</h2>
                  <button type="button" className="ai-help-link" onClick={showHelp} title="Help">
                    <HelpCircle size={14} /> Help
                  </button>
                </div>
                <div className="ai-pub-row">
                  <span className="ai-pub-label">Status</span>
                  <span className={`ai-status-badge ${statusBadgeClass}`}>{clientData.status}</span>
                </div>
                <div className="ai-pub-actions">
                  <button type="button" onClick={() => navigate(`/clients/${id}`)} className="ai-btn ai-btn-outline">
                    View
                  </button>
                  <button type="submit" disabled={saving} className="ai-btn ai-btn-primary">
                    <Save size={13} /> {saving ? "…" : "Update"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </>
  );
}
"""

with open(edit_client_path, "w", encoding="utf-8") as f:
    f.write(new_content)
