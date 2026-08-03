import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Printer, Download, ArrowLeft, Edit } from "lucide-react";
import { useRole } from "../../utils/useRole";
import { downloadAsPDF } from "../../utils/downloadPDF";

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRole();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/quotes/${id}/`)
      .then((res) => {
        setQuote(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load quote details.");
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => downloadAsPDF('quote-print-area', `Quote-${id}.pdf`);

  if (loading) return <div className="p-10 flex justify-center text-gray-500">Loading quote details...</div>;
  if (!quote) return <div className="p-10 text-center text-red-600">Quote not found.</div>;

  const statusColor =
    quote.status === "Accepted"
      ? "bg-green-100 text-green-700"
      : quote.status === "Rejected"
        ? "bg-red-100 text-red-700"
        : quote.status === "Expired"
          ? "bg-orange-100 text-orange-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden mb-6">
          <button
            onClick={() => navigate("/quotes")}
            className="flex items-center gap-2 text-gray-600 hover:text-black font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Quotes
          </button>
          <div className="flex flex-wrap items-center gap-3">
            {role === "admin" && (
              <button
                onClick={() => navigate(`/quotes/edit/${id}`)}
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

        {/* Quote Paper Document */}
        <div id="quote-print-area" className="bg-white max-w-[850px] mx-auto border border-gray-200 shadow-xl print:shadow-none print:border-none print:m-0 print:p-0">

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 text-[#3b5d84]">
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
                  QUOTATION
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
                    <p className="font-bold text-[13px] text-gray-900">{quote?.client_name || quote?.client || "Client Name"}</p>
                    <p>{quote?.client_address || ""}</p>
                    <p>{quote?.client_email || ""}</p>
                    <p>{quote?.client_phone || ""}</p>
                    {quote?.client_gst && <p className="font-bold mt-2">GST No: {quote?.client_gst}</p>}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/2 flex flex-col justify-between">

                {/* Meta details */}
                <div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-2">
                    <div className="text-right font-bold text-gray-800">Quote Number</div>
                    <div className="text-right text-gray-600">{quote?.quotation_id || `AKEYQ-${id}`}</div>

                    <div className="text-right font-bold text-gray-800">Date</div>
                    <div className="text-right text-gray-600">{quote?.quoteDate || new Date().toISOString().split('T')[0]}</div>

                    <div className="text-right font-bold text-gray-800">Valid Until</div>
                    <div className="text-right text-gray-600">{quote?.validUntil || new Date().toISOString().split('T')[0]}</div>

                    <div className="text-right font-bold text-gray-800">Status</div>
                    <div className="text-right">
                      <span className={`px-2 py-[1px] rounded text-[10px] font-bold ${statusColor}`}>{quote?.status || "Draft"}</span>
                    </div>
                  </div>

                  <div className="flex w-full mt-2">
                    <div className="w-1/2 bg-[#486b8c] text-white py-1 px-4 font-bold text-right text-sm">TOTAL AMOUNT</div>
                    <div className="w-1/2 bg-[#486b8c] text-white py-1 px-4 font-bold text-right text-sm">
                      ₹{parseFloat(quote?.grandTotal || quote?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* General Quote info */}
                <div className="text-[11px] text-gray-700 leading-tight space-y-4 mt-6">
                  {quote?.description && (
                    <div>
                      <p className="text-[#486b8c] font-bold mb-1">Project Notes:</p>
                      <p className="italic text-gray-600">{quote.description}</p>
                    </div>
                  )}
                  {quote?.terms && (
                    <div>
                      <p className="text-[#486b8c] font-bold mb-1">Terms:</p>
                      <p className="italic text-gray-600">{quote.terms}</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Table */}
            <div className="mb-8">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#486b8c] text-white">
                    <th className="py-2.5 px-3 text-center w-20 font-semibold">QTY</th>
                    <th className="py-2.5 px-3 text-left font-semibold">SERVICE / PRODUCT</th>
                    <th className="py-2.5 px-3 text-right w-36 font-semibold">RATE</th>
                    <th className="py-2.5 px-3 text-right w-36 font-semibold">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {quote?.items && quote.items.length > 0 ? (
                    quote.items.map((item, idx) => (
                      <tr key={idx} className="border-b-2 border-gray-100">
                        <td className="py-3 px-3 text-center align-top font-semibold text-gray-700">{item.qty || 1}</td>
                        <td className="py-3 px-3 text-left align-top">
                          <p className="font-semibold text-gray-800 text-[13px]">{item.item || "Service/Item"}</p>
                          {item.description && <p className="text-gray-500 mt-1">{item.description}</p>}
                        </td>
                        <td className="py-3 px-3 text-right align-top font-medium">₹{parseFloat(item.rate || item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right align-top font-medium">₹{parseFloat(item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400 italic">No line items recorded for this quotation.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-16">
              <div className="w-64 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-700 px-3">
                  <span>Sub Total</span>
                  <span className="font-medium">₹{parseFloat(quote?.subtotal || quote?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {(quote?.tax > 0) && (
                  <div className="flex justify-between text-gray-700 px-3">
                    <span>Tax (18%)</span>
                    <span className="font-medium">₹{parseFloat(quote?.tax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {(quote?.discount > 0) && (
                  <div className="flex justify-between text-red-600 px-3">
                    <span>Discount</span>
                    <span className="font-medium">-₹{parseFloat(quote?.discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between bg-[#f0f4f8] text-[#486b8c] font-bold p-3 rounded-md mt-2">
                  <span>Grand Total</span>
                  <span>₹{parseFloat(quote?.grandTotal || quote?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end text-xs text-gray-500 pb-4 border-b-8 border-[#3b5d84]">
              <div>
                <p className="font-bold text-[#486b8c] mb-1">Bank Details:</p>
                <p>Account Name: Ultrakey IT Solutions Pvt Ltd</p>
                <p>Account Number: XXXXXX00032</p>
                <p>IFSC: HDFC0000123</p>
              </div>
              <div className="text-right">
                <p className="mb-8 hidden">Signature</p>
                <p className="font-bold text-gray-700 border-t border-gray-300 pt-2 w-48 text-center ml-auto">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide Print Interface Utility Classes */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
        }
      `}</style>
    </div>
  );
}