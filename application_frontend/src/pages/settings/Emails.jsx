import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/emails/';

const FieldRow = ({ label, hint, children }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start w-full py-3 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 pt-1.5">{label}</label>
    <div className="flex flex-col max-w-2xl">
      {children}
      {hint && <p className="text-xs text-gray-400 italic mt-1.5" dangerouslySetInnerHTML={{ __html: hint }} />}
    </div>
  </div>
);

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full";

const RichTextarea = ({ name, rows, value, onChange }) => (
  <div className="border border-gray-300 rounded overflow-hidden">
    <div className="bg-gray-50 border-b border-gray-200 px-2 py-1 flex items-center gap-1 text-gray-500 flex-wrap">
      {["B", "I", "U", "🔗", "≡", "≡", "≡"].map((c, i) => (
        <button key={i} type="button" className="text-xs w-6 h-6 hover:bg-gray-200 rounded flex items-center justify-center font-medium">{c}</button>
      ))}
      <div className="ml-auto flex gap-1 text-xs text-gray-500">
        <button type="button" className="border border-gray-300 px-2 py-0.5 rounded hover:bg-gray-100">Visual</button>
        <button type="button" className="border border-gray-300 px-2 py-0.5 rounded hover:bg-gray-100">Code</button>
      </div>
    </div>
    <textarea name={name} rows={rows || 5} value={value} onChange={onChange} className="p-2 text-sm outline-none w-full" />
  </div>
);

const EmailTemplateSection = ({ title, subtitle, subjectName, subjectVal, contentName, contentVal, buttonName, buttonVal, onChange }) => (
  <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-white">
    <h3 className="text-sm font-bold text-gray-800 mb-0.5">{title}</h3>
    <p className="text-xs text-gray-400 mb-4">{subtitle}</p>
    <div className="space-y-3">
      <FieldRow label="Subject" hint="The subject of the email (wildcards are allowed).">
        <input type="text" name={subjectName} value={subjectVal} onChange={onChange} className={inputCls} />
      </FieldRow>
      <FieldRow label="Content" hint="The content of the email (wildcards and HTML are allowed).">
        <RichTextarea name={contentName} value={contentVal} onChange={onChange} />
      </FieldRow>
      {buttonName && (
        <FieldRow label="Button text" hint={`The "${buttonVal || 'View'}" button.`}>
          <input type="text" name={buttonName} value={buttonVal} onChange={onChange} className={inputCls} />
        </FieldRow>
      )}
    </div>
  </div>
);

const PAYMENT_REMINDER_DAYS = [
  "7 days before Due Date",
  "1 day before Due Date",
  "On the Due Date",
  "1 day after Due Date",
  "7 days after Due Date",
  "14 days after Due Date",
  "21 days after Due Date",
  "30 days after Due Date",
];

export default function Emails() {
  const [form, setForm] = useState({
    emailAddress: "support@ultrakeyit.com",
    emailName: "Ultrakey IT Solutions Private Limited",
    bccOnClientEmails: true,
    quoteSubject: "New quote %number% available",
    quoteContent: "Hi %client_first_name%,\n\nYou have a new quote available ( %number% ) which can be\nviewed at %link%.",
    quoteButtonText: "View this quote online",
    invoiceSubject: "New invoice %number% available",
    invoiceContent: "Hi %client_first_name%,\n\nYou have a new invoice available ( %number% ) which can be\nviewed at %link%.",
    invoiceButtonText: "View this invoice online",
    paymentSubject: "Thanks for your payment!",
    paymentContent: "Thanks for your payment, %client_first_name%.\n\nYour recent payment for %last_payment% on invoice\n%number% has been successful.",
    reminderDays: ["7 days before Due Date", "1 day before Due Date", "On the Due Date", "7 days after Due Date", "14 days after Due Date", "21 days after Due Date"],
    reminderSubject: "A friendly reminder",
    reminderContent: "Hi %client_first_name%,\n\nJust a friendly reminder that your invoice %number% for\n%total% is due on %due_date%.",
    footerContent: "© 2010-2024 Ultrakey IT Solutions Private Limited. All rights reserved.",
    smtpHost: "",
    smtpPort: "587",
    username: "",
    password: "",
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
      setForm(prev => ({ ...prev, ...fetched }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINT, form);
      toast.success("Email settings saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save email settings!");
    } finally { setIsSaving(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleReminderDay = (day) => {
    setForm(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day],
    }));
  };

  const toggleAllReminders = () => {
    setForm(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.length === PAYMENT_REMINDER_DAYS.length ? [] : [...PAYMENT_REMINDER_DAYS],
    }));
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Email Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>
          Here you will find all of the Email related settings.{" "}
          (PRO) The <a href="#" className="underline">Easy Translate Extension</a> adds a few extra options here for customizing emails.
        </span>
      </div>

      <form onSubmit={handleSave}>
        {/* Base Email Config */}
        <FieldRow label="Email Address" hint="The email address to send and receive notifications (probably your business email).">
          <input type="email" name="emailAddress" value={form.emailAddress} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Email Name" hint="The name on emails to send and receive notifications (probably your Business name).">
          <input type="text" name="emailName" value={form.emailName} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Bcc on Client Emails" hint="This ensures you have a copy of the email on hand.">
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input type="checkbox" name="bccOnClientEmails" checked={form.bccOnClientEmails} onChange={handleChange} className="w-4 h-4 border-gray-300 rounded text-blue-600" />
            Yes, send myself a copy of all client emails (Bcc). Recommended.
          </label>
        </FieldRow>

        {/* Quote Available */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <EmailTemplateSection
            title="Quote Available"
            subtitle="Sent to the client manually, when you click the email button."
            subjectName="quoteSubject" subjectVal={form.quoteSubject}
            contentName="quoteContent" contentVal={form.quoteContent}
            buttonName="quoteButtonText" buttonVal={form.quoteButtonText}
            onChange={handleChange}
          />
        </div>

        {/* Invoice Available */}
        <EmailTemplateSection
          title="Invoice Available"
          subtitle="Sent to the client manually, when you click the email button."
          subjectName="invoiceSubject" subjectVal={form.invoiceSubject}
          contentName="invoiceContent" contentVal={form.invoiceContent}
          buttonName="invoiceButtonText" buttonVal={form.invoiceButtonText}
          onChange={handleChange}
        />

        {/* Payment Received */}
        <EmailTemplateSection
          title="Payment Received"
          subtitle="Sent to the client automatically, when they make a payment."
          subjectName="paymentSubject" subjectVal={form.paymentSubject}
          contentName="paymentContent" contentVal={form.paymentContent}
          onChange={handleChange}
        />

        {/* Payment Reminder */}
        <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-white">
          <h3 className="text-sm font-bold text-gray-800 mb-0.5">Payment Reminder</h3>
          <p className="text-xs text-gray-400 mb-4">Sent to the client automatically on the chosen days.</p>

          <FieldRow label="When to Send">
            <div className="flex flex-col gap-2">
              <div>
                <button type="button" onClick={toggleAllReminders} className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 text-gray-600 mb-2">
                  Select / Deselect All
                </button>
              </div>
              {PAYMENT_REMINDER_DAYS.map((day) => (
                <label key={day} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.reminderDays.includes(day)}
                    onChange={() => toggleReminderDay(day)}
                    className="w-4 h-4 border-gray-300 rounded text-blue-600"
                  />
                  {day}
                </label>
              ))}
            </div>
          </FieldRow>

          <div className="mt-4">
            <FieldRow label="Subject" hint="The subject of the email (wildcards are allowed).">
              <input type="text" name="reminderSubject" value={form.reminderSubject} onChange={handleChange} className={inputCls} />
            </FieldRow>
          </div>

          <FieldRow label="Content" hint="The content of the reminder email (wildcards and HTML are allowed).">
            <RichTextarea name="reminderContent" rows={4} value={form.reminderContent} onChange={handleChange} />
          </FieldRow>
        </div>

        {/* Wildcards reference */}
        <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Wildcards For Emails</h3>
          <p className="text-xs text-gray-500 mb-3">The following wildcards can be used in email subject and content above.</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-600 font-mono">
            {[
              ["%client_name%", "The client's business name"],
              ["%client_first_name%", "Client first name"],
              ["%number%", "Invoice/quote number"],
              ["%link%", "View invoice online"],
              ["%amount%", "Invoice total amount"],
              ["%last_payment%", "The amount of last payment"],
              ["%due_date%", "Invoice due date"],
              ["%total%", "Invoice total (ex payments)"],
            ].map(([code, desc]) => (
              <div key={code} className="flex gap-2">
                <span className="text-blue-600 shrink-0">{code}</span>
                <span className="text-gray-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border border-gray-200 rounded-lg p-5 mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Footer Text</h3>
          <RichTextarea name="footerContent" rows={3} value={form.footerContent} onChange={handleChange} />
        </div>

        {/* Mail Example Preview */}
        <div className="mt-6 mb-4">
          <h3 className="text-base font-bold mb-4 text-gray-800">
            Mail Example: Email Invoice / Quotation Mail Template
          </h3>
          <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm bg-white max-w-[550px]">
            <div className="bg-[#e9ecef] py-6 px-8 flex justify-center items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shrink-0">
                  <span className="text-sm">UK</span>
                </div>
                <div className="text-[#2271b1] font-bold text-xl leading-tight">
                  Ultrakey
                  <span className="text-gray-500 text-[11px] font-medium block text-right">IT Solutions</span>
                </div>
              </div>
            </div>
            <div className="p-8 text-gray-700 text-[14px] leading-relaxed space-y-4">
              <p>Hi Rajesh,</p>
              <p>
                You have a <span className="bg-yellow-100 font-medium px-1 rounded">new invoice</span> available ( AKEI-0125 ) which can be viewed at{" "}
                <a href="#" className="text-blue-600 hover:underline text-xs">
                  https://www.ultrakeyit.com/invoice/AKEI-0125
                </a>.
              </p>
              <button type="button" className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-2 px-4 rounded text-[13px] shadow-sm transition-colors">
                View this invoice online
              </button>
            </div>
            <div className="bg-[#f8f9fa] border-t border-gray-100 p-4 text-[11px] text-gray-500 text-center">
              © 2024 Ultrakey IT Solutions Private Limited. All rights reserved.
            </div>
          </div>
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