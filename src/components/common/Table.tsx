import type { ComponentProps } from "react";

function Table({ className = "", ...props }: ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className = "", ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={`[&_tr]:border-b ${className}`}
      {...props}
    />
  );
}

function TableBody({ className = "", ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={`[&_tr:last-child]:border-0 ${className}`}
      {...props}
    />
  );
}

function TableFooter({ className = "", ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={`border-t bg-slate-50 font-medium [&>tr]:last:border-b-0 ${className}`}
      {...props}
    />
  );
}

function TableRow({ className = "", ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={`border-b border-slate-200 transition-colors hover:bg-slate-50 ${className}`}
      {...props}
    />
  );
}

function TableHead({ className = "", ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={`h-11 px-4 text-left align-middle font-semibold whitespace-nowrap text-slate-700 ${className}`}
      {...props}
    />
  );
}

function TableCell({ className = "", ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={`px-4 py-3 align-middle whitespace-nowrap text-slate-600 ${className}`}
      {...props}
    />
  );
}

function TableCaption({ className = "", ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={`mt-4 text-sm text-slate-500 ${className}`}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
