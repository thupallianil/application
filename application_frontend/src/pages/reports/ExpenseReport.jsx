import Table from "../../components/Table";

export default function ExpenseReport() {

  const columns = [
    "Expense",
    "Category",
    "Amount",
    "Date",
  ];

  const data = [
    {
      expense: "Office Rent",
      category: "Rent",
      amount: "₹40,000",
      date: "01 Jul 2026",
    },
    {
      expense: "Internet",
      category: "Utility",
      amount: "₹2,500",
      date: "05 Jul 2026",
    },
    {
      expense: "Electricity",
      category: "Utility",
      amount: "₹6,800",
      date: "10 Jul 2026",
    },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Expense Report
      </h1>

      <Table
        columns={columns}
        data={data}
      />

    </div>
  );
}