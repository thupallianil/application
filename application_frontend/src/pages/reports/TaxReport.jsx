import Table from "../../components/Table";

export default function TaxReport() {

  const columns = [
    "Invoice",
    "Client",
    "GST",
    "Amount",
    "Date",
  ];

  const data = [
    {
      invoice: "INV-1001",
      client: "John",
      gst: "18%",
      amount: "₹4,500",
      date: "22 Jul 2026",
    },
    {
      invoice: "INV-1002",
      client: "David",
      gst: "18%",
      amount: "₹3,240",
      date: "20 Jul 2026",
    },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Tax Report
      </h1>

      <Table
        columns={columns}
        data={data}
      />

    </div>
  );
}