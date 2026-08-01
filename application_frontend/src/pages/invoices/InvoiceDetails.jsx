import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Printer, Download, ArrowLeft, Edit } from "lucide-react";
import { useRole } from "../../utils/useRole";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRole();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/invoices/${id}/`)
      .then((res) => {
        setInvoice(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load invoice details.");
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => window.print();

  if (loading) return <div className="p-10 flex justify-center text-gray-500">Loading invoice details...</div>;
  if (!invoice) return <div className="p-10 text-center text-red-600">Invoice not found.</div>;

  const statusColor =
    invoice.status === "Paid"
      ? "bg-green-100 text-green-700"
      : invoice.status === "Cancelled"
        ? "bg-gray-200 text-gray-800"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden mb-6">
          <button
            onClick={() => navigate("/invoices")}
            className="flex items-center gap-2 text-gray-600 hover:text-black font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Invoices
          </button>
          <div className="flex flex-wrap items-center gap-3">
            {role === "admin" && (
              <button
                onClick={() => navigate(`/invoices/edit/${id}`)}
                className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg font-medium shadow-sm transition"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Paper Document */}
        <div className="bg-white max-w-[850px] mx-auto border border-gray-200 shadow-xl print:shadow-none print:border-none print:m-0 print:p-0">

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 text-[#3b5d84]">
                {/* Simulated Logo */}
                <div className="border-[3px] border-[#3b5d84] rounded-full w-10 h-10 flex items-center justify-center font-black text-xl relative">
                  K
                  <div className="absolute -top-[6px] -left-[6px] w-[12px] h-[12px] bg-white border-[2px] border-[#3b5d84] rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black leading-none tracking-tighter">Ultrakey</span>
                  <span className="text-[7px] font-bold tracking-widest text-[#3b5d84] pl-1 opacity-80 mt-0.5">IT SOLUTIONS PRIVATE LIMITED</span>
                </div>
              </div>

              <div>
                <h1 className="bg-[#597897] text-white px-10 py-1.5 text-right font-bold tracking-widest text-xl print:text-black print:bg-gray-200 print:text-right">
                  INVOICE
                </h1>
              </div>
            </div>

            {/* Top Grid */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
              {/* Left Column */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* From Block */}
                <div>
                  <div className="bg-[#486b8c] text-white px-3 py-1 text-sm font-semibold mb-2">From:</div>
                  <div className="px-1 text-xs text-gray-800 space-y-0.5">
                    <p className="font-bold text-[13px] text-gray-900">Ultrakey IT Solutions Private Limited</p>
                    <p>Flat No. 204, 2nd Floor, Cyber Residency,</p>
                    <p>Indira Nagar, Gachibowli,</p>
                    <p>Hyderabad, Telangana, India-500032</p>
                    <p>support@ultrakeyit.com</p>
                    <p className="font-bold mt-2">GST No: 36AADCU5062A1ZO</p>
                  </div>
                </div>

                {/* To Block */}
                <div>
                  <div className="bg-[#486b8c] text-white px-3 py-1 text-sm font-semibold mb-2">To:</div>
                  <div className="px-1 text-xs text-gray-800 space-y-0.5">
                    <p className="font-bold text-[13px] text-gray-900">{invoice?.client_name || invoice?.client || "Client Name"}</p>
                    <p>{invoice?.client_address || ""}</p>
                    <p>{invoice?.client_email || ""}</p>
                    <p>{invoice?.client_phone || ""}</p>
                    {invoice?.client_gst && <p className="font-bold mt-2">GST No: {invoice?.client_gst}</p>}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/2 flex flex-col justify-between">

                {/* Meta details */}
                <div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-2">
                    <div className="text-right font-bold text-gray-800">Invoice Number</div>
                    <div className="text-right text-gray-600">{invoice?.invoice || `INV-${id}`}</div>

                    <div className="text-right font-bold text-gray-800">Invoice Date</div>
                    <div className="text-right text-gray-600">{invoice?.invoiceDate || new Date().toISOString().split('T')[0]}</div>

                    <div className="text-right font-bold text-gray-800">Due Date</div>
                    <div className="text-right text-gray-600">{invoice?.dueDate || new Date().toISOString().split('T')[0]}</div>
                  </div>

                  <div className="flex w-full mt-2">
                    <div className="w-1/2 bg-[#486b8c] text-white py-1 px-4 font-bold text-right text-sm">TOTAL DUE</div>
                    <div className="w-1/2 bg-[#486b8c] text-white py-1 px-4 font-bold text-right text-sm">
                      ₹{parseFloat(invoice?.grandTotal || invoice?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-[11px] text-gray-700 leading-tight space-y-4 mt-6">
                  <p>
                    Payment is due within 14 days from date of<br />
                    invoice. Late payment is subject to fees of<br />
                    5% per month.
                  </p>
                  <div>
                    <p className="text-[#486b8c] font-bold mb-1">Payment Methods:</p>
                    <p>1. 60% Advance Payment</p>
                    <p>2. Remaining 40% Final Settlement</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Table */}
            <div className="mb-8">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#486b8c] text-white">
                    <th className="py-2.5 px-3 text-center w-20 font-semibold">HRS/QTY</th>
                    <th className="py-2.5 px-3 text-left font-semibold">SERVICE DETAILS</th>
                    <th className="py-2.5 px-3 text-right w-36 font-semibold">RATE/PRICE</th>
                    <th className="py-2.5 px-3 text-right w-36 font-semibold">SUB TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b-2 border-gray-100">
                        <td className="py-3 px-3 text-center align-top font-semibold text-gray-700">{item.qty || 1}</td>
                        <td className="py-3 px-3 text-left align-top">
                          <p className="font-semibold text-gray-800 text-[13px]">{item.item || "Service/Item"}</p>
                          {item.description && <p className="text-gray-500 mt-1">{item.description}</p>}
                        </td>
                        <td className="py-3 px-3 text-right align-top font-medium">₹{parseFloat(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right align-top font-medium">₹{parseFloat(item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b-2 border-gray-100">
                      <td colSpan="4" className="py-8 text-center text-gray-500 italic">No line items specified.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Grid */}
            <div className="flex flex-col md:flex-row justify-between gap-8">

              {/* Payment Instructions Box */}
              <div className="w-full md:w-[55%] bg-[#f4f7f9] p-4 text-[11px] text-gray-800">
                <p className="font-bold text-[12px] mb-3">Pay invoice amount via one of the options<br />mentioned in the below</p>

                <div className="flex gap-2">
                  <span className="font-bold whitespace-nowrap">Option 1:</span>
                  <div>
                    <p className="text-gray-700">Gpay (or) Phonepe Number:</p>
                    <p className="text-gray-600">6300440316</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <span className="font-bold whitespace-nowrap">Option 2:</span>
                  <div>
                    <p className="text-gray-700">Direct To Organization Current A/C</p>
                    <p className="text-gray-600">Account Number: 50200092611852</p>
                    <p className="text-gray-600">Name: Ultrakey IT Solutions Pvt. Ltd.</p>
                    <p className="text-gray-600">IFSC: HDFC0000968</p>
                    <p className="text-gray-600">Branch: GACHIBOWLI</p>
                  </div>
                </div>
              </div>

              {/* Totals Table */}
              <div className="w-full md:w-[40%]">
                <table className="w-full text-[13px]">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-1.5 font-bold text-gray-800 text-right pr-4">Sub Total</td>
                      <td className="py-1.5 text-right font-medium">₹{parseFloat(invoice?.subtotal || invoice?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-1.5 font-bold text-[#6a9757] text-right pr-4">Discount</td>
                      <td className="py-1.5 text-right font-medium text-[#6a9757]">₹{parseFloat(invoice?.discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-1.5 font-bold text-gray-800 text-right pr-4">GST (18%)</td>
                      <td className="py-1.5 text-right font-medium">₹{parseFloat(invoice?.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="border-b border-white">
                      <td className="py-1.5 font-bold text-gray-800 text-right pr-4">Paid</td>
                      <td className="py-1.5 text-right font-medium">₹{parseFloat(invoice?.status === 'Paid' ? invoice.grandTotal : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="pt-2">
                        <div className="bg-[#486b8c] text-white flex justify-between py-1.5 px-4">
                          <span className="font-bold text-sm tracking-wide">TOTAL DUE</span>
                          <span className="font-bold text-sm">₹{parseFloat(invoice?.status === 'Paid' ? 0 : (invoice?.grandTotal || invoice?.amount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            {/* Very Bottom Footer */}
            <div className="mt-8 text-center text-[10px] text-gray-600 border-t border-[#d8a14b] pt-2 pb-2">
              <span className="font-bold text-gray-800">Thanks for choosing</span> Ultrakey IT Solutions Pvt. Ltd. <span className="mx-1 text-[#486b8c]">|</span> support@ultrakeyit.com <span className="mx-1 text-[#486b8c]">|</span> +91 63004 40316
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}