import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";

export default function PaymentList() {

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    "Payment ID",
    "Invoice",
    "Client",
    "Amount",
    "Method",
    "Status",
  ];

  const data = [
    {
      id: 1,
      payment: "PAY-1001",
      invoice: "INV-1001",
      client: "John",
      amount: "₹20,000",
      method: "UPI",
      status: "Completed",
    },
    {
      id: 2,
      payment: "PAY-1002",
      invoice: "INV-1002",
      client: "David",
      amount: "₹12,500",
      method: "Bank",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Payments
        </h1>

        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <Table
        columns={columns}
        data={data}
      />

      <Pagination
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
      />

    </div>
  );
}