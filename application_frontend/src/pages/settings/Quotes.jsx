import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Settings, Handshake, Bell, FileText, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/quotes/';

const FieldRow = ({ label, hint, children }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start w-full py-3 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 pt-1.5">{label}</label>
    <div className="flex flex-col max-w-xl">
      {children}
      {hint && <p className="text-xs text-gray-400 italic mt-1.5" dangerouslySetInnerHTML={{ __html: hint }} />}
    </div>
  </div>
);

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full";

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="border-t border-gray-200 pt-6 mt-4 mb-2">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="text-blue-600" size={18} />
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
    </div>
  </div>
);

export default function Quotes() {
  const [quote, setQuote] = useState({
    prefix: "AKEYQ-",
    suffix: "",
    autoIncrement: true,
    nextNumber: "52",
    validity: "15",
    hideAdjustField: false,
    terms: "This is a fixed price quote. If accepted, we require a 60% deposit upfront before work commences.",
    footer: "Thanks for choosing <a href=\"https://ultrakeyit.com\" target=\"_blank\">Ultrakey IT Solutions Private Limited</a> | <a href=\"mailto:support@ultrakeyit.com\">support@ultrakeyit.com</a>",

    acceptQuoteButton: true,
    acceptedQuoteAction: "Convert Quote to Invoice and send to client",
    acceptQuoteText: "**Please Note: After accepting this Quote an Invoice will be automatically generated. This will then become a legally binding contract.",
    acceptedQuoteMessage: "You have accepted the Quote. <br>We will be in touch shortly.",
    declineReasonRequired: true,
    declinedQuoteMessage: "You have declined the Quote. <br>We will be in touch shortly.",

    noticeViewed: true,
    noticeAccepted: true,

    template: "Template 3",
    customCss: "body {}",
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
        if (res.data[key] !== null) fetched[key] = res.data[key];
      }
      setQuote(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINT, quote);
      toast.success("Quote settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save quote settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuote(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Quote Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Here you will find all of the Quote related settings. Configure how quotes are created, managed, and displayed.</span>
      </div>

      <form onSubmit={handleSave}>
        {/* Quote Settings Section */}
        <FieldRow label="Prefix" hint="Prefix before each Quote number. Can be left blank if you don't need a prefix.">
          <input type="text" name="prefix" value={quote.prefix} onChange={handleChange} className={inputCls} style={{ width: "200px" }} />
        </FieldRow>

        <FieldRow label="Suffix" hint="Suffix after each Quote number. Can be left blank if you don't need a suffix.">
          <input type="text" name="suffix" value={quote.suffix} onChange={handleChange} className={inputCls} style={{ width: "200px" }} />
        </FieldRow>

        <FieldRow label="Auto Increment">
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input type="checkbox" name="autoIncrement" checked={quote.autoIncrement} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            Yes, increment Quote numbers by one. Recommended.
          </label>
        </FieldRow>

        <FieldRow label="Next Number" hint="The next number to use for auto incrementing. Can use leading zeros.">
          <input type="text" name="nextNumber" value={quote.nextNumber} onChange={handleChange} className={inputCls} style={{ width: "200px" }} />
        </FieldRow>

        <FieldRow label="Quotes Valid For" hint="Number of days each Quote is valid for. This will automatically set the date in the 'Valid Until' field.<br>Can be overridden on individual Quotes.">
          <input type="number" name="validity" value={quote.validity} onChange={handleChange} className={inputCls} style={{ width: "120px" }} min="0" />
        </FieldRow>

        <FieldRow label="Hide Adjust Field">
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input type="checkbox" name="hideAdjustField" checked={quote.hideAdjustField} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            Yes, hide the Adjust field on line items. I won't need this field.
          </label>
        </FieldRow>

        <FieldRow label="Terms & Conditions" hint="Terms and conditions displayed on the Quote.<br>Can be overridden on individual Quotes.">
          <textarea rows="4" name="terms" value={quote.terms} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Footer" hint="The footer will be displayed at the bottom of each Quote. Basic HTML is allowed.">
          <textarea rows="3" name="footer" value={quote.footer} onChange={handleChange} className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        {/* Accepting Quotes Section */}
        <SectionHeader title="Accepting Quotes" icon={Handshake} />

        <FieldRow label="Accept Quote Button">
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input type="checkbox" name="acceptQuoteButton" checked={quote.acceptQuoteButton} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            Yes, show the "Accept Quote" button on Quotes.
          </label>
        </FieldRow>

        <FieldRow label="Accepted Quote Action" hint="Actions to perform automatically when client accepts a Quote.">
          <select name="acceptedQuoteAction" value={quote.acceptedQuoteAction} onChange={handleChange} className={inputCls}>
            <option value="Convert Quote to Invoice and send to client">Convert Quote to Invoice and send to client</option>
          </select>
        </FieldRow>

        <FieldRow label="Accept Quote Text" hint="Text to add on the 'Accept Quote' popup. Basic HTML is allowed.<br>This should provide some indication to your client of what happens after accepting the Quote.">
          <textarea rows="3" name="acceptQuoteText" value={quote.acceptQuoteText} onChange={handleChange} className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        <FieldRow label="Accepted Quote Message" hint="Message to display if client accepts the Quote. Basic HTML is allowed.<br>Leave blank for the default message.">
          <textarea rows="3" name="acceptedQuoteMessage" value={quote.acceptedQuoteMessage} onChange={handleChange} className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        <FieldRow label="Decline Reason Required">
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input type="checkbox" name="declineReasonRequired" checked={quote.declineReasonRequired} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            Yes, make the "Reason for declining" field required.
          </label>
        </FieldRow>

        <FieldRow label="Declined Quote Message" hint="Message to display if client declines the Quote. Basic HTML is allowed.<br>Leave blank for the default message.">
          <textarea rows="3" name="declinedQuoteMessage" value={quote.declinedQuoteMessage} onChange={handleChange} className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        {/* Admin Notices Section */}
        <SectionHeader title="Admin Notices" icon={Bell} />
        <p className="text-xs text-gray-500 mb-4">
          These settings allow you to choose which notices may be displayed in your Admin area.
          (Note: this is different from admin emails, which you can configure on the Email Settings tab.)
        </p>

        <FieldRow label="Show me notices when">
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="noticeViewed" checked={quote.noticeViewed} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              Quote Viewed
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="noticeAccepted" checked={quote.noticeAccepted} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              Quote Accepted
            </label>
          </div>
        </FieldRow>

        {/* Template Design Section */}
        <SectionHeader title="Template Design" icon={FileText} />
        <p className="text-xs text-gray-500 mb-4">
          For information on customizing your templates, please see our guide <a href="#" className="text-blue-500 hover:underline">here</a>.
        </p>

        <FieldRow label="Template">
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {[1, 2, 3].map((num) => (
              <label key={num} className={`border rounded p-2 cursor-pointer transition-all ${quote.template === `Template ${num}` ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="aspect-[4/3] bg-gray-50 mb-2 overflow-hidden rounded relative border border-gray-100">
                  <div className="absolute inset-x-2 top-2 h-3 bg-white shadow-sm flex items-center px-1 gap-1">
                    <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                    <div className="w-8 h-1 bg-gray-400 rounded"></div>
                    <div className="ml-auto w-6 h-1 bg-gray-300 rounded"></div>
                  </div>
                  <div className="absolute inset-x-2 top-7 space-y-1">
                    {[1, 2, 3].map(r => <div key={r} className="w-full h-1 bg-gray-200 rounded"></div>)}
                    {num === 2 && <div className="w-full h-2 bg-gray-800 rounded mt-1"></div>}
                    {num === 3 && <div className="absolute top-0 right-0 w-8 h-8 bg-blue-900 rounded"></div>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-0.5">
                  <input type="radio" name="template" value={`Template ${num}`} checked={quote.template === `Template ${num}`} onChange={handleChange} className="text-blue-600 w-3.5 h-3.5" />
                  <span className={`text-xs ${quote.template === `Template ${num}` ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>Template {num}</span>
                </div>
              </label>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="Custom CSS" hint="Add custom CSS to your Quote.">
          <textarea rows="4" name="customCss" value={quote.customCss} onChange={handleChange} className={`${inputCls} font-mono text-xs max-w-lg`} placeholder="body {}" />
        </FieldRow>

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