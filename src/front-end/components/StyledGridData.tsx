import React from "react";
import {styled} from "@mui/material";
import {humanReadableDate} from "../../utils";
import {
  DataGrid,
  GridRowClassNameParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import {RealORPossibleBillsType} from "../../types";

const cols = [
  {field: "securityTerm", headerName: "Duration", flex: 0.5},
  {field: "cusip", headerName: "Cusip", flex: 0.5},
  {
    field: "closingTimeNoncompetitive",
    headerName: "Order Deadline",
    flex: 1,
    valueGetter: (value: string) => {
      return value;
    },
  },
  {
    field: "auctionDate",
    headerName: "Auction",
    flex: 1,
    valueGetter: humanReadableDate,
  },
  {
    field: "maturityDate",
    headerName: "Maturity",
    flex: 1,
    valueGetter: humanReadableDate,
  },
];

const StyledDataGrid = styled(DataGrid)`
  & .MuiDataGrid-row {
    pointer-events: none;
  }
  & .MuiDataGrid-row.is-close {
    background-color: yellow;
  }
  &
    .MuiDataGrid-row.passed-brokerage-deadline
    [data-field="closingTimeNoncompetitive"],
  .MuiDataGrid-row.passed-brokerage-deadline [data-field="auctionDate"] {
    font-weight: bold;
  }
  & .MuiDataGrid-row.passed-auction [data-field="closingTimeNoncompetitive"] {
    text-decoration: line-through;
  }
  & .MuiDataGrid-row.is-today {
    background-color: #adffad;
  }
  & .MuiDataGrid-row.unavailable {
    background-color: red;
    text-decoration: line-through;
  }
`;

const LadderData: React.FC<{billArray: RealORPossibleBillsType[]}> = ({
  billArray,
}) => {
  return (
    <StyledDataGrid
      disableColumnMenu
      disableColumnFilter
      disableColumnSorting
      disableColumnResize
      hideFooter
      rows={billArray}
      columns={cols}
      getRowClassName={(params: GridRowClassNameParams<GridValidRowModel>) => {
        return (params.row.classList || "")
          .concat(params.row.invalid ? " unavailable" : "")
          .trim();
      }}
    />
  );
};

export default LadderData;
