import React from "react";
import {Box, styled} from "@mui/material";
import {
  RealORPossibleBillsType,
  PossibleBillType,
  TreasurySecurityType,
} from "../../types";
import {humanReadableDate} from "../../utils";

type ColumnsType = {
  field: keyof PossibleBillType | keyof TreasurySecurityType;
  headerName: string;
  flex: number;
  valueGetter?: (value: unknown) => string;
}[];

const cols: ColumnsType = [
  {field: "securityTerm", headerName: "Duration", flex: 0.5},
  {field: "cusip", headerName: "Cusip", flex: 0.5},
  {
    field: "closingTimeNoncompetitive",
    headerName: "Order Deadline",
    flex: 1,
    valueGetter: (value: string) => value,
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
interface ICustomDataGridProps {
  rows: RealORPossibleBillsType[];
  columns: ColumnsType;
  getRowClassName?: (params: {row: RealORPossibleBillsType}) => string;
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

const DataGridHeaders: React.FC<{columns: ColumnsType}> = ({columns}) => {
  return (
    <RowContainerHeader>
      {columns.map((col) => {
        return <StyledCell key={col.field}>{col.headerName}</StyledCell>;
      })}
    </RowContainerHeader>
  );
};

const DataGridRows: React.FC<ICustomDataGridProps> = ({
  rows,
  columns,
  getRowClassName,
}) => {
  return (
    <>
      {rows.map((row: TreasurySecurityType, idx) => {
        const className = getRowClassName ? getRowClassName({row}) : "";
        return (
          <RowContentStyles
            key={`${row.auctionDate}-${idx}`}
            className={className}
          >
            {columns.map(({field, valueGetter}) => {
              const content = row[field] ?? "";
              const value = (
                valueGetter ? valueGetter(content) : content
              ) as string;
              return (
                <StyledCell className={className} key={field}>
                  {value}
                </StyledCell>
              );
            })}
          </RowContentStyles>
        );
      })}
    </>
  );
};

const CustomDataGrid: React.FC<{
  rows: RealORPossibleBillsType[];
  columns: ColumnsType;
  getRowClassName?: (params: {
    row: PossibleBillType & TreasurySecurityType;
  }) => string;
}> = ({rows, columns, getRowClassName}) => {
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

const Ladder: React.FC<{
  billArray: RealORPossibleBillsType[];
}> = ({billArray}) => {
  return (
    <CustomDataGrid
      rows={billArray}
      columns={cols}
      getRowClassName={(params) => {
        return (params.row?.classList || "")
          .concat(params.row.invalid ? " unavailable" : "")
          .trim();
      }}
    />
  );
};

export default Ladder;
