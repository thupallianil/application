import Table from "../../components/Table";

export default function SalesReport() {

  const columns = [
    "Invoice",
    "Client",
    "Amount",
    "Date",
  ];

  const data = [
    {
      invoice: "INV-1001",
      client: "John",
      amount: "₹25,000",
      date: "22 Jul 2026",
    },
    {
      invoice: "INV-1002",
      client: "David",
      amount: "₹18,500",
      date: "20 Jul 2026",
    },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Sales Report
      </h1>

      <Table
        columns={columns}
        data={data}
      />

    </div>
  );
}