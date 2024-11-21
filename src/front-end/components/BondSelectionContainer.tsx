import {
  styled,
  Grid2,
  Stack,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import {AssetDurationTypes, BondActionDatesType} from "../types";
import {humanReadableDate, sortByAuctionDate} from "../utils";
import {Remove} from "@mui/icons-material";

const Container = styled(Grid2)``;

const BondSelectionContainer: React.FC<{
  billLadders: Record<AssetDurationTypes, BondActionDatesType>[];
  removeBond: (bondToRemove: number) => void;
}> = ({billLadders, removeBond}) => {
  return (
    <Container size={8}>
      <Stack>
        {billLadders.map((ladder, idx) => {
          return (
            <Card key={idx.toString()}>
              <CardHeader
                title={`Ladder Option ${idx + 1}`}
                action={
                  <IconButton
                    title="Remove Ladder"
                    onClick={() => console.log("remove ladder")}
                  >
                    <Remove />
                  </IconButton>
                }
              />
              <CardContent>
                {sortByAuctionDate(ladder).map((bill) => {
                  return Object.entries(bill).map(([duration, dates], num) => {
                    return (
                      <Stack direction={"row"} spacing={2} key={num + duration}>
                        <Typography>{duration}</Typography>
                        <Stack direction={"row"} spacing={2}>
                          <div>
                            Purchase: {humanReadableDate(dates.auction)}
                          </div>
                          <div>Mature: {humanReadableDate(dates.maturity)}</div>
                        </Stack>
                      </Stack>
                    );
                  });
                })}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
};

export default BondSelectionContainer;
