import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string }>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map(col => (
              <TableHead key={col.key} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            data.map(item => (
              <TableRow
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map(col => (
                  <TableCell key={col.key} className="text-sm">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
