import React from "react";
import {Box, styled} from "@mui/material";
import {RealBillsCollectionType, TreasurySecurityType} from "../types";
import {humanReadableDate} from "../utils";
import {GridRowClassNameParams, GridValidRowModel} from "@mui/x-data-grid";

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

const StyledCell = styled("div")`
  flex: 1;
  padding: 5px;
  border-right: 1px solid hsl(0deg 0% 89% / 40%);
  &:last-child {
    border-right: none;
  }
`;

const getUsableBillDetails = (bill: RealBillsCollectionType) => {
  const [id, data] = Object.entries(bill)[0];
  return {
    id,
    ...data,
  };
};

interface ICustomDataGridProps {
  rows: TreasurySecurityType[];
  columns: Record<any, any>[];
  getRowClassName?: (
    params: GridRowClassNameParams<GridValidRowModel>
  ) => string;
}

const RowStyles = styled(Box)`
  width: 100%;
  display: grid;
  padding: 5px 15px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
`;

const RowContentStyles = styled(RowStyles)`
  border-top: 1px solid #ccc;
  &.is-close {
    background-color: yellow;
  }
  .passed-brokerage-deadline {
    font-weight: bold;
  }
  &.is-today {
    background-color: #adffad;
  }
  &.unavailable,
  &.auction-passed {
    text-decoration: line-through;
    background-color: #ff0000c7;
    * {
      font-weight: normal;
    }
  }
`;

const RowContainerHeader = styled(RowStyles)`
  border: none;
  background-color: #f6f6f6;
`;

const DataGridHeaders: React.FC<{columns: Record<any, any>[]}> = ({
  columns,
}) => {
  return (
    <RowContainerHeader>
      {columns.map((col) => {
        return <StyledCell key={col.field}>{col.headerName}</StyledCell>;
      })}
    </RowContainerHeader>
  );
};

const DataGridRows: React.FC<{
  rows: TreasurySecurityType[];
  columns: Record<any, any>[];
  getRowClassName: (
    params: GridRowClassNameParams<GridValidRowModel>
  ) => string;
}> = ({rows, columns, getRowClassName}) => {
  return rows.map((row) => {
    const className = getRowClassName ? getRowClassName({row}) : "";
    return (
      <RowContentStyles key={row.auctionDate} className={className}>
        {columns.map((col) => {
          const field = col.field as keyof TreasurySecurityType;
          const content = row[field] || "";
          const valueGetter = col["valueGetter"];
          const value = valueGetter ? valueGetter(content) : content;
          return (
            <StyledCell className={className} key={field}>
              {value}
            </StyledCell>
          );
        })}
      </RowContentStyles>
    );
  });
};

const CustomDataGrid: React.FC<ICustomDataGridProps> = ({
  rows,
  columns,
  getRowClassName,
}) => {
  return (
    <>
      <DataGridHeaders columns={columns} />
      <DataGridRows
        rows={rows}
        columns={columns}
        getRowClassName={getRowClassName}
      />
    </>
  );
};

const Ladder: React.FC<{billArray: RealBillsCollectionType[]}> = ({
  billArray,
}) => {
  const bills = billArray.map(getUsableBillDetails);

  return (
    <CustomDataGrid
      rows={bills}
      columns={cols}
      getRowClassName={(params: GridRowClassNameParams<GridValidRowModel>) => {
        return (params.row.classList || "")
          .concat(params.row.invalid ? " unavailable" : "")
          .trim();
      }}
    />
  );
};

export default Ladder;
