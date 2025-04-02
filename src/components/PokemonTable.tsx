"use client";
import { useEffect, useState, useMemo } from "react";
import { PokemonDetails, PokemonData } from "~app/actions/types";
import { getPokemons } from "~app/actions/pokemon";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  PaginationState,
  ColumnFiltersState,
  ColumnDef,
} from "@tanstack/react-table";
import Image from "next/image";
import { Filter } from "./Filter";
import { GeneralError } from "./GeneralError";
import { useRouter } from "next/navigation";

export const PokemonTable = () => {
  const router = useRouter();
  const [data, setData] = useState<PokemonData>();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns = useMemo<ColumnDef<PokemonDetails, any>[]>(
    () => [
      {
        accessorKey: "image",
        cell: (info) => {
          const src = info.getValue();
          return src ? (
            <Image
              width={50}
              height={50}
              src={src}
              alt="Pokemon image"
              priority
            />
          ) : (
            <div className="w-[50px] h-[50px]"></div>
          );
        },
      },
      { accessorKey: "id" },
      {
        accessorKey: "name",
        id: "name",
        meta: {
          filterVariant: "search",
        },
      },
      {
        accessorKey: "types",
        meta: {
          filterVariant: "select",
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    rowCount: data?.rowCount,
    state: {
      pagination,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  // TODO: consider using react-query
  const loadData = async (pagination: PaginationState) => {
    setLoading(true);
    setError("");

    const result = await getPokemons(pagination);
    if ("errorMessage" in result) {
      setError(result.errorMessage);
    } else {
      setData(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(pagination);
  }, [pagination]);

  const typeOptions: string[] = [];
  data?.rows.forEach(({ types }) => {
    types.split(",").forEach((value) => {
      if (typeOptions.indexOf(value) === -1) {
        typeOptions.push(value);
      }
    });
  });

  if (error) {
    return <GeneralError />;
  }

  return (
    <div className="p-2 flex flex-col items-center">
      <div className="flex flex-col items-center w-full sm:w-4/5 xl:w-[1000px]">
        <table className="border border-(--border-color) w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-b-(--border-color) border-r border-r-(--border-color) py-0.5 px-1 sm:w-[200px]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanFilter() ? (
                      <div className="my-1">
                        <Filter options={typeOptions} column={header.column} />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="border border-(--border-color)">
            {table.getRowModel().rows.map((row) => {
              const path = row.getValue("name");
              return (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/${path}`)}
                  className="hover:bg-(--border-color) cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="sm:w-[200px]">
                      <div className="flex justify-center items-center text-center w-full ">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="h-2.5">{loading && "Loading..."}</div>
        <div className="h-4" />
        <div className="flex items-center gap-2">
          <button
            className="border rounded border-(--border-color) py-1 px-2 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-(--primary-color)"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            type="button"
          >
            {"<<"}
          </button>
          <button
            className="border rounded border-(--border-color) py-1 px-2 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-(--primary-color)"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            type="button"
          >
            {"<"}
          </button>
          <button
            className="border rounded border-(--border-color) py-1 px-2 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-(--primary-color)"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            type="button"
          >
            {">"}
          </button>
          <button
            className="border rounded border-(--border-color) py-1 px-2 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-(--primary-color)"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            type="button"
          >
            {">>"}
          </button>
        </div>
        <span className="flex items-center gap-1 mt-4">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
      </div>
    </div>
  );
};
