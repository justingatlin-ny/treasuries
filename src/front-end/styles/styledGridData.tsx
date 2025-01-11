import {styled} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

export const StyledDataGrid = styled(DataGrid)`
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
