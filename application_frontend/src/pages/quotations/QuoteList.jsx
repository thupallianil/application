import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";

export default function QuoteList() {

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    "Quote No",
    "Client",
    "Amount",
    "Status",
  ];

  const data = [
    {
      id: 1,
      quote: "QT-1001",
      client: "John",
      amount: "₹15,000",
      status: "Pending",
    },
    {
      id: 2,
      quote: "QT-1002",
      client: "David",
      amount: "₹25,000",
      status: "Approved",
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Quotations
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