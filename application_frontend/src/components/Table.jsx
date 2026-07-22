import { Eye, Pencil, Trash2 } from "lucide-react";

const Table = ({ columns, data, onView, onEdit, onDelete }) => {
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
                {Object.values(item).map((value, index) => {
                  if (index === 0) return null; // Assuming item.id is the first value, or we skip outputting it if needed. Actually the previous code mapped all values. Let's just keep mapping all values except we need to be careful if id is displayed. Wait, in original it did `Object.values(item).map`. Let's just do that.
                  return (
                    <td
                      key={index}
                      className="px-6 py-4 text-sm"
                    >
                      {value}
                    </td>
                  )
                })}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => onView && onView(item.id)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit && onEdit(item.id)} className="text-green-600 hover:text-green-800">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => onDelete && onDelete(item.id)} className="text-red-600 hover:text-red-800">
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