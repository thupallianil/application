import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { useState } from "react";

export default function ClientList() {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const columns = [
    "ID",
    "Client",
    "Email",
    "Phone",
  ];

  const data = [
    {
      id: 1,
      client: "John",
      email: "john@gmail.com",
      phone: "9876543210",
    },
    {
      id: 2,
      client: "David",
      email: "david@gmail.com",
      phone: "9876543200",
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex justify-between">

        <h1 className="text-3xl font-bold">
          Clients
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