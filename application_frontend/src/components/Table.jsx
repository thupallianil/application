import { Eye, Pencil, Trash2, Download } from "lucide-react";

/**
 * Table component
 * Props:
 *  - columns: string[]
 *  - data: object[]
 *  - onView: fn(id)
 *  - onEdit: fn(id) | null        — Admin: edit button
 *  - onDelete: fn(id) | null      — Admin: delete button
 *  - onDownload: fn(id) | null    — Client: download button (separate handler)
 *  - clientMode: boolean          — hides Edit/Delete, shows View + Download
 *  - clientViewLabel: string      — label for client view button (default "View")
 */
const Table = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onDownload,
  clientMode = false,
  clientViewLabel = "View",
}) => {
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
            <th className="px-6 py-3 text-center">Actions</th>
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
                  if (index === 0) return null; // skip id
                  return (
                    <td key={index} className="px-6 py-4 text-sm">
                      {value}
                    </td>
                  );
                })}
                <td className="px-6 py-4">
                  {clientMode ? (
                    /* Client: View + Download (separate handlers) */
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onView && onView(item.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        title={clientViewLabel}
                      >
                        <Eye size={16} />
                        <span>{clientViewLabel}</span>
                      </button>
                      <button
                        onClick={() => onDownload ? onDownload(item.id) : onView && onView(item.id)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                        title="Download"
                      >
                        <Download size={16} />
                        <span className="text-xs">PDF</span>
                      </button>
                    </div>
                  ) : (
                    /* Admin: View + Edit + Delete */
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onView && onView(item.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  )}
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