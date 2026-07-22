import { Eye, Pencil, Trash2 } from "lucide-react";

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column}
              </th>
            ))}

            <th className="px-6 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >

                {Object.values(item).map((value, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-sm"
                  >
                    {value}
                  </td>
                ))}

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-3">

                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>

                    <button className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>

                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>
            ))
          ) : (
            <tr>

              <td
                colSpan={columns.length + 1}
                className="text-center py-10 text-gray-500"
              >
                No Data Found
              </td>

            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default Table;