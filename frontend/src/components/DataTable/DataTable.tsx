import React from 'react';

interface Column {
  header: string;
  accessorKey: string;
  cell?: (info: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 font-medium">No hay registros para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className="px-6 py-4 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr 
                key={row.id || rowIdx} 
                className="bg-white border-b hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
