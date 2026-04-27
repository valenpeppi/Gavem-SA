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
      <div className="datatable-loading">
        <div className="datatable-spinner"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="datatable-empty">
        <p className="datatable-empty-text">No hay registros para mostrar</p>
      </div>
    );
  }

  return (
    <div className="datatable-wrapper">
      <div className="datatable-scroll">
        <table className="datatable-table">
          <thead className="datatable-thead">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className="datatable-th">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr 
                key={row.id || rowIdx} 
                className="datatable-row"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="datatable-td">
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
