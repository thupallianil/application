import re
import os

add_inv_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\invoices\AddInvoice.jsx"
add_client_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\clients\AddClient.jsx"

with open(add_inv_path, "r", encoding="utf-8") as f:
    add_invoice_content = f.read()

styles_match = re.search(r"const styles = `([\s\S]*?)`;", add_invoice_content)
styles = styles_match.group(1)

components_match = re.search(r"(function applyFormat[\s\S]*?)(?:function PreviewModal|export default function AddInvoice)", add_invoice_content)
components = components_match.group(1)

new_content = """import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  User, Mail, Phone, MapPin, Building2, Save, X, 
  HelpCircle, Globe, Hash, Bold, Italic, Underline,
  List, ListOrdered, Link, Image, Code
} from "lucide-react";

/* ─────────────────────────────── styles ─────────────────────────────── */
const styles = `""" + styles + """`;

""" + components + """

export default function AddClient() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("existing");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    existingUser: "",
    client: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    address: "",
    extraInfo: "",
    firstName: "",
    lastName: "",
    website: "",
    status: "Active"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client.trim()) { toast.error("Client name is required"); return; }
    
    setLoading(true);
    try {
      await api.post("/clients/", formData);
      toast.success("Client Added Successfully");
      navigate("/clients");
    } catch (err) {
      toast.error("Unable to Add Client");
    }
    setLoading(false);
  };

  const showHelp = () =>
    toast.info("Create a new client by filling out their details. Choose whether they exist in the system or are completely new.", { autoClose: 6000 });

  return (
    <>
      <style>{styles}</style>

      <div className="ai-page">
        <form onSubmit={handleSubmit}>
          <div className="ai-topbar">
            <h1>
              <User size={20} style={{ display: "inline", marginRight: 8, color: "#2271b1" }} />
              Add New Client
            </h1>
            <div className="ai-topbar-actions">
              <button type="button" onClick={() => navigate("/clients")} className="ai-btn ai-btn-outline">
                <X size={14} /> Cancel
              </button>
              <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                <Save size={14} /> {loading ? "Saving…" : "Add Client"}
              </button>
            </div>
          </div>

          <div className="ai-layout">
            <div className="ai-main">
              <div className="ai-page-title-wrap">
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Enter Business / Client Name"
                  className="ai-title-input"
                  required
                />
              </div>

              <div className="ai-panel">
                <div style={{ padding: "16px", background: "#f6f7f7", borderBottom: "1px solid #c3c4c7" }}>
                  <p style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px" }}>Add new client from:</p>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <label className="ai-check-row">
                      <input
                        type="radio"
                        value="existing"
                        checked={userType === "existing"}
                        onChange={() => setUserType("existing")}
                      />
                      Existing User
                    </label>
                    <label className="ai-check-row">
                      <input
                        type="radio"
                        value="new"
                        checked={userType === "new"}
                        onChange={() => setUserType("new")}
                      />
                      Create New User
                    </label>
                  </div>
                </div>
              </div>

              {userType === "existing" && (
                <>
                  <Panel title="Select Existing User">
                    <div className="ai-field">
                      <label className="ai-label">Select User *</label>
                      <select
                        name="existingUser"
                        value={formData.existingUser}
                        onChange={handleChange}
                        className="ai-select"
                        required
                      >
                        <option value="">— Choose Client —</option>
                        <option value="1">Client One</option>
                        <option value="2">Client Two</option>
                        <option value="3">Client Three</option>
                      </select>
                    </div>
                  </Panel>
                </>
              )}

              {userType === "new" && (
                <>
                  <Panel title="User Account Details">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label className="ai-label"><Mail size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="ai-label"><Phone size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Phone Number *</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="ai-label">Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="ai-label">Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                    </div>
                  </Panel>
                </>
              )}

              <Panel title="Contact Information">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="ai-label"><User size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      className="ai-input" 
                    />
                  </div>
                  <div>
                    <label className="ai-label"><User size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      className="ai-input" 
                    />
                  </div>
                  <div style={{gridColumn: "1 / -1"}}>
                    <label className="ai-label"><Globe size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Website</label>
                    <input 
                      type="text" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder="https://..."
                      className="ai-input" 
                    />
                  </div>
                </div>
              </Panel>
              
              <Panel title="Physical Address & Extra Info">
                <div style={{ padding: "0 0 10px 0", marginBottom: 12 }}>
                   <label className="ai-label"><MapPin size={13} style={{ marginRight: 6, verticalAlign: "middle" }}/>Address Details</label>
                   <textarea
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     rows={3}
                     placeholder="Enter full address..."
                     className="ai-input"
                     style={{ minHeight: "80px", resize: "y" }}
                   />
                </div>
                <div>
                  <label className="ai-label">Extra Info / Notes</label>
                  <RichEditor
                     name="extraInfo"
                     value={formData.extraInfo}
                     onChange={handleChange}
                     rows={4}
                     placeholder="Additional information..."
                   />
                </div>
              </Panel>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => navigate("/clients")} className="ai-btn ai-btn-outline">
                  <X size={14} /> Cancel
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                    <Save size={14} /> {loading ? "Saving…" : "Add Client"}
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
                  <span className={`ai-status-badge status-draft`}>Draft</span>
                </div>
                <div className="ai-pub-actions">
                  <button type="button" className="ai-btn ai-btn-draft">
                    Save Draft
                  </button>
                  <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                    <Save size={13} /> {loading ? "…" : "Publish"}
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

with open(add_client_path, "w", encoding="utf-8") as f:
    f.write(new_content)
