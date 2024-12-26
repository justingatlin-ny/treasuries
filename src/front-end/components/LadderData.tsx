import React from "react";
import {Grid2, styled} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

import {RealBillsCollectionType} from "../types";
import {humanReadableDate} from "../utils";
import dayjs from "dayjs";
const cols = [
  {field: "securityTerm", headerName: "Duration", flex: 1},
  {field: "cusip", headerName: "Cusip", flex: 1},
  {
    field: "closingTimeNoncompetitive",
    headerName: "Where to Purchase",
    flex: 1,
    valueGetter: (value: string) => {
      return value;
    },
  },
  {
    field: "auctionDate",
    headerName: "Purchase",
    flex: 1,
    valueGetter: (value: string) => humanReadableDate(value),
  },
  {
    field: "maturityDate",
    headerName: "Maturity",
    flex: 1,
    valueGetter: (value: string) => humanReadableDate(value),
  },
];

const StyledDataGrid = styled(DataGrid)`
  & .MuiDataGrid-row.isClose {
    background-color: yellow;
    pointer-events: none;
  }
  & .MuiDataGrid-row.isToday {
    background-color: green;
    pointer-events: none;
  }

  & .MuiDataGrid-row.unavailable {
    background-color: red;
    text-decoration: line-through;
    pointer-events: none;
  }
`;
const LadderData: React.FC<{billArray: RealBillsCollectionType[]}> = ({
  billArray,
}) => {
  const bills = billArray.map((bill) => {
    const [id, data] = Object.entries(bill)[0];
    const {
      cusip,
      unavailable,
      announcementDate,
      maturityDate,
      auctionDate,
      securityTerm,
    } = data;
    const auc = dayjs(auctionDate);
    const isClose = auc.isBefore(dayjs().add(5, "days"));
    const isToday = auc.isSame(dayjs());
    return {
      id,
      unavailable,
      isClose,
      isToday,
      securityTerm,
      announcementDate,
      cusip,
      maturityDate,
      auctionDate,
    };
  });

  return (
    <Grid2 container spacing={2}>
      <StyledDataGrid
        sx={{borderRadius: 0}}
        hideFooter={true}
        rows={bills}
        columns={cols}
        getRowClassName={(params) => {
          const {isClose, isToday, unavailable, announcementDate} = params.row;
          const classList = [];
          if (unavailable) {
            classList.push("unavailable");
          } else if (isToday) {
            classList.push("isToday");
          } else if (isClose) {
            classList.push("isClose");
          }
          if (!announcementDate) {
            classList.push("unannounced");
          }
          return classList.length ? classList.join(" ").trim() : "";
        }}
      />
    </Grid2>
  );
};

export default LadderData;
