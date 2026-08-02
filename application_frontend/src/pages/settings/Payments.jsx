import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Save } from "lucide-react";
import api from '../../services/api';
import { invalidateSettingsCache } from '../../services/settingsService';

const API_ENDPOINT = '/settings/payments/';

const FieldRow = ({ label, hint, children }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start w-full py-3 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 pt-1.5">{typeof label === 'string' ? label : label}</label>
    <div className="flex flex-col max-w-xl">
      {children}
      {hint && <p className="text-xs text-gray-400 italic mt-1.5" dangerouslySetInnerHTML={{ __html: hint }} />}
    </div>
  </div>
);

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full";

export default function Payments() {
  const [form, setForm] = useState({
    currencySymbol: "₹",
    currencyPosition: "left",
    thousandSeparator: ",",
    decimalSeparator: ".",
    numberOfDecimals: "2",
    paymentPage: "Payment",
    paymentPageFooter: `Thanks for choosing <a href="https://ultrakeyit.com" target="_blank">Ultrakey IT Solutions Private Limited</a> | <a href="mailto:support@ultrakeyit.com">support@ultrakeyit.com</a>`,
    bankDetails: "",
    genericPayment: `Pay Invoice amount via one of the options mentioned in the below\n<a href="https://pages.razorpay.com/ultrakeyitinvoices" target="_blank">1. Click here for Online Payment through Razorpay</a>`,
    paypalGateway: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINT);
      const fetched = {};
      for (const key in res.data) {
        if (res.data[key] !== null && res.data[key] !== "") fetched[key] = res.data[key];
      }
      setForm(prev => ({ ...prev, ...fetched }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINT, form);
      invalidateSettingsCache('payments');
      toast.success("Payment settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save payment settings!");
    } finally { setIsSaving(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Payment Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Here you will find all of the Payment related settings.</span>
      </div>

      <form onSubmit={handleSave}>
        {/* Currency Settings */}
        <FieldRow label="Currency Symbol" hint="The symbol used for your currency (e.g. ₹, $, €).">
          <input type="text" name="currencySymbol" value={form.currencySymbol} onChange={handleChange} className={inputCls} style={{ width: "120px" }} />
        </FieldRow>

        <FieldRow label="Currency Position" hint="Where to display the currency symbol relative to the amount.">
          <select name="currencyPosition" value={form.currencyPosition} onChange={handleChange} className={inputCls} style={{ width: "250px" }}>
            <option value="left">Left ($100.00)</option>
            <option value="right">Right (100.00$)</option>
            <option value="left_space">Left with Space ($ 100.00)</option>
            <option value="right_space">Right with Space (100.00 $)</option>
          </select>
        </FieldRow>

        <FieldRow label="Thousand Separator" hint="Character used as thousands separator. Leave blank for none.">
          <input type="text" name="thousandSeparator" value={form.thousandSeparator} onChange={handleChange} className={inputCls} style={{ width: "120px" }} maxLength={1} />
        </FieldRow>

        <FieldRow label="Decimal Separator" hint="Character used as decimal separator.">
          <input type="text" name="decimalSeparator" value={form.decimalSeparator} onChange={handleChange} className={inputCls} style={{ width: "120px" }} maxLength={1} />
        </FieldRow>

        <FieldRow label="Number of Decimals" hint="Number of decimal places to display on amounts.">
          <input type="number" name="numberOfDecimals" value={form.numberOfDecimals} onChange={handleChange} className={inputCls} style={{ width: "120px" }} min="0" max="4" />
        </FieldRow>

        <FieldRow label="Payment Page" hint='Choose a page to use for PayPal and other payment gateway messages and confirmations.'>
          <select name="paymentPage" value={form.paymentPage} onChange={handleChange} className={inputCls} style={{ width: "250px" }}>
            <option value="Payment">Payment</option>
          </select>
        </FieldRow>

        <FieldRow label="Payment Page Footer" hint="The footer will be displayed at the bottom of the payment page. Basic HTML is allowed.">
          <textarea name="paymentPageFooter" rows="3" value={form.paymentPageFooter} onChange={handleChange} className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        {/* Payment Methods Section */}
        <div className="border-t border-gray-200 pt-6 mt-4 mb-2">
          <h3 className="text-base font-bold text-gray-800 mb-4">Payment Methods</h3>

          <FieldRow label="Bank Details" hint="Add your bank account details if you wish to allow direct bank deposits. HTML is allowed.">
            <textarea name="bankDetails" rows="4" value={form.bankDetails} onChange={handleChange} className={`${inputCls} font-mono text-xs`} placeholder={"e.g. Bank Name: SBI\nAccount: 1234567890\nIFSC: SBIN0001234"} />
          </FieldRow>

          <FieldRow label="Generic Payment" hint="Set a generic message or include further instructions for the user on how to pay. HTML is allowed.">
            <textarea name="genericPayment" rows="4" value={form.genericPayment} onChange={handleChange} className={`${inputCls} font-mono text-xs`} />
          </FieldRow>
        </div>

        {/* PayPal Gateway */}
        <div className="border-t border-gray-200 pt-6 mt-4 mb-2">
          <h3 className="text-base font-bold text-gray-800 mb-4">PayPal Gateway</h3>
          <FieldRow label="PayPal Email" hint="Enter your PayPal email to enable PayPal payments on invoices.">
            <input type="email" name="paypalGateway" value={form.paypalGateway} onChange={handleChange} className={inputCls} placeholder="e.g. payments@yourbusiness.com" />
          </FieldRow>
        </div>

        <div className="flex justify-start pt-6 pb-2">
          <button type="submit" disabled={isSaving} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
            <Save size={16} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}