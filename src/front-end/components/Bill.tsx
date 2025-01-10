import {Grid2, styled, Typography} from "@mui/material";
import {type FC} from "react";
import {determineStatus, humanReadableDate} from "../../utils";
import {TreasurySecurityType} from "../../types";

export const BillContainer = styled(Grid2)``;

const Bill: FC<{securityDetails: TreasurySecurityType}> = ({
  securityDetails,
}) => {
  return (
    <>
      <Grid2 size={4} className={securityDetails.invalid ? "unavailable" : ""}>
        <Typography>
          {securityDetails.securityTerm} {securityDetails?.cusip || ""}
        </Typography>
      </Grid2>
      <Grid2 size={4}>
        <Typography
          className={
            determineStatus(securityDetails.auctionDate).IsClose
              ? "isClose"
              : ""
          }
        >
          {humanReadableDate(securityDetails.auctionDate)}
        </Typography>
      </Grid2>
      <Grid2 size={4}>
        <Typography>
          {humanReadableDate(securityDetails.maturityDate)}
        </Typography>
      </Grid2>
    </>
  );
};

export default Bill;
