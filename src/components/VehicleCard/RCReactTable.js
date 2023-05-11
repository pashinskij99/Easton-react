import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
  Flex,
  Box,
  Button,
  Table,
  Tbody,
  Text,
  Thead,
  Td,
  Tr,
  Th,
  Input
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    useTable,
    usePagination,
    useSortBy,
    useFilters,
    useResizeColumns,
    useExpanded,
    useRowSelect,
    useGroupBy,
  } from "react-table";
  import { createSelector } from '@reduxjs/toolkit'

  function Filter({ column }) {
    return (
      <input
        value={column.filterValue || ""}
        onChange={(e) => column.setFilter(e.target.value)}
        placeholder={`Filter by ${column.Header}`}
      />
    );
  }



const ReactTable2 = ({ VehDBdata = [] }) => {
    const [filterConfig, setFilterConfig] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [columnWidths, setColumnWidths] = useState({});

    const tableRef = useRef();

    const defaultColumnFilter = (rows, id, filterValue) => {
      if (!Array.isArray(rows)) {
        return [];
      }

      return rows.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          : true;
      });
    };

    const columns = useMemo(
      () => [
        {
          Header: "Chassis",
          accessor: "chassis",
          Filter: TextFilter,
          filter: "text",
        },
        { Header: "Conv_Type", accessor: "conv_type" },
        {
          Header: "Price",
          accessor: "price",
          Cell: ({ value }) => `$${value?.toLocaleString() || 0}`,
        },
        {
          Header: "Mileage",
          accessor: "mileage",
          Cell: ({ value }) => value?.toLocaleString(),
        },
        { Header: "New", accessor: "chassis_newused" },
        {
          Header: "Conversion",
          columns: [
            { Header: "New", accessor: "conv_newused" },
            { Header: "Rear", accessor: "conv_rearside" },
            { Header: "Auto", accessor: "conv_auto" },
            { Header: "Model", accessor: "conv_model" },
            {
              Header: "Convprice_Est",
              accessor: "convprice_est",
              Cell: ({ value }) => `$${value?.toLocaleString() || 0}`,
            },
            { Header: "Convprice", accessor: "convprice" },
            { Header: "Manu", accessor: "conv_manu" },
          ],
        },
        { Header: "Year", accessor: "chassisyear" },
        { Header: "Vin", accessor: "vin" },
        { Header: "Dealer", accessor: "dealer" },
        {
          Header: "Valuation",
          columns: [
            { Header: "Chassis_Retail", accessor: "chassis_retail" },
            {
              Header: "Chassis_Privateparty",
              accessor: "chassis_privateparty",
            },
            { Header: "Chassis_Tradein", accessor: "chassis_tradein" },
            {
              Header: "Conv_Implied_Vs_Retail",
              accessor: "conv_implied_vs_retail",
            },
            {
              Header: "Conv_Implied_Vs_Privateparty",
              accessor: "conv_implied_vs_privateparty",
            },
            {
              Header: "Conv_Implied_Vs_Tradein",
              accessor: "conv_implied_vs_tradein",
            },
            { Header: "Valuation_Mileage", accessor: "valuation_mileage" },
            {
              Header: "Valuation_Mileage_Est_Diff",
              accessor: "valuation_mileage_est_diff",
            },
            {
              Header: "Valuation_Mileage_Adj",
              accessor: "valuation_mileage_adj",
            },
          ],
        },
        { Header: "Commercial", accessor: "commercial" },
        { Header: "Bothnew", accessor: "bothnew" },
        { Header: "Chassisprice_Est", accessor: "chassisprice_est" },
        { Header: "Fullprice_Est", accessor: "fullprice_est" },
        { Header: "Fullhalf_Cut", accessor: "fullhalf_cut" },
      ],
      []
    );

    const data = useMemo(
      () => (Array.isArray(VehDBdata) ? VehDBdata : []),
      [VehDBdata]
    );
    const handleColumnResize = (columnId, newWidth) => {
      setColumnWidths((oldWidths) => ({ ...oldWidths, [columnId]: newWidth }));
    };

    const defaultColumn = useMemo(
      () => ({
        minWidth: 30,
        width: 150,
        maxWidth: 400,
      }),
      []
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      headerGroup,
      state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 15 },
        defaultColumn: { Filter: defaultColumnFilter },
        filterTypes: {
          text: (rows, id, filterValue) => {
            return rows.filter((row) => {
              const rowValue = row.values[id];
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase())
                : true;
            });
          },
        },
      },
      useFilters,
      useSortBy,
      usePagination,
      useResizeColumns
    );

    function TextFilter({ column: { filterValue, setFilter } }) {
      return (
        <Input
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined);
          }}
          placeholder="Filter..."
          size="xs"
          width="100%"
        />
      );
    }

    return (
      <Box fontSize="xs" overflowX="auto" width="100vw" ref={tableRef}>
        <Table
          size="xs"
          variant="striped"
          colorScheme="gray"
          {...getTableProps()}
        >
          <Thead>
            {headerGroups &&
              headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      {...column.getResizerProps()}
                       style={{
                        fontSize: "10px", // Adjust the font size
                        padding: "4px", // Adjust the padding
                      }}
                      width={columnWidths[column.id] || column.width}
                    >
                      {column.render("Header")}
                      {column.canFilter ? column.render("Filter") : null}
                      <div
                        style={{
                          width: "3px",
                          height: "100%",
                          position: "absolute",
                          right: 0,
                          top: 0,
                          zIndex: 1,
                          cursor: "col-resize",
                        }}
                        onMouseDown={(e) => {
                          const initialX = e.clientX;
                          const initialWidth =
                            columnWidths[column.id] || column.width;

                          const handleMouseMove = (e) => {
                            const newWidth =
                              initialWidth + (e.clientX - initialX);
                            handleColumnResize(column.id, newWidth);
                          };

                          const handleMouseUp = () => {
                            document.removeEventListener(
                              "mousemove",
                              handleMouseMove
                            );
                            document.removeEventListener(
                              "mouseup",
                              handleMouseUp
                            );
                          };

                          document.addEventListener(
                            "mousemove",
                            handleMouseMove
                          );
                          document.addEventListener("mouseup", handleMouseUp);
                        }}
                      />
                    </Th>
                  ))}
                </Tr>
              ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const isSelected = selectedRowIds
                ? selectedRowIds[row.id]
                : false;
              return (
                <Tr
                  {...row.getRowProps()}
                  bg={isSelected ? "gray.200" : undefined}
                >
                  {row.cells.map((cell) => (
                    <Td
                      {...cell.getCellProps()}
                      style={{
                        fontSize: "10px", // Adjust the font size for table content
                        padding: "4px", // Adjust the padding for table content
                      }}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </Button>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </Button>
          <Text>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Text>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </Button>
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </Flex>
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          fontSize="xs"
        >
          {[15, 30, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </Select>
      </Box>
    );
  };

  export default ReactTable2;
