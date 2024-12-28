import React from "react";
import {styled} from "@mui/material";
import {RealBillsCollectionType} from "../types";
import {humanReadableDate} from "../utils";
import {
  DataGrid,
  GridRowClassNameParams,
  GridValidRowModel,
} from "@mui/x-data-grid";

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

// const getRowClassList = (params) => {
//   const {
//     isClose,
//     isToday,
//     unavailable,
//     announcementDate,
//     closingTimeNoncompetitive,
//     auctionDate,
//   } = params.row;
//   const classList = [];

//   if (unavailable) {
//     classList.push("unavailable");
//   } else if (isToday) {
//     classList.push("is-today");
//   } else if (isClose) {
//     classList.push("is-close");
//   }
//   if (!announcementDate) {
//     classList.push("unannounced");
//   }

//   if (closingTimeNoncompetitive) {
//     const [time, meridiem] = closingTimeNoncompetitive.split(/\s+/);
//     const now = dayjs();

//     const timeArray = time.split(":");
//     let hours = parseInt(timeArray[0]);
//     const minutes = parseInt(timeArray[1]);

//     if (/pm/i.test(meridiem) && hours > 12) {
//       hours = hours + 12;
//     }

//     const purchaseDeadline = dayjs(auctionDate)
//       .set("hours", hours)
//       .set("minutes", minutes)
//       .set("seconds", 0);

//     if (now.isAfter(purchaseDeadline)) {
//       classList.push("auction-passed");
//     }

//     const brokerageDeadline = dayjs(auctionDate)
//       .set("hours", 9)
//       .set("minutes", 30)
//       .set("seconds", 0);

//     if (now.isAfter(brokerageDeadline)) {
//       classList.push("passed-brokerage-deadline");
//     }
//   }
//   return classList.length ? classList.join(" ").trim() : "";
// };

const getUsableBillDetails = (bill: RealBillsCollectionType) => {
  const [id, data] = Object.entries(bill)[0];
  const {
    cusip,
    announcementDate,
    maturityDate,
    auctionDate,
    securityTerm,
    averageMedianDiscountRate,
    closingTimeNoncompetitive,
    highDiscountRate,
    classList,
    invalid,
  } = data;

  return {
    id,
    securityTerm,
    announcementDate,
    cusip,
    invalid,
    maturityDate,
    auctionDate,
    classList,
    averageMedianDiscountRate,
    closingTimeNoncompetitive,
    highDiscountRate,
  };
};

const LadderData: React.FC<{billArray: RealBillsCollectionType[]}> = ({
  billArray,
}) => {
  const bills = billArray.map(getUsableBillDetails);

  return (
    <StyledDataGrid
      disableColumnMenu
      disableColumnFilter
      disableColumnSorting
      disableColumnResize
      hideFooter
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

export default LadderData;
