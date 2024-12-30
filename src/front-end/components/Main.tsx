import {useEffect, useState} from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs, {Dayjs} from "dayjs";
import {
  SavedLadderPayload,
  RealBillsCollectionType,
  TreasurySecurityType,
} from "../types";
import {BondControls} from "./BondControls";
import {buildBillLadder} from "../utils";
import BillLadders from "./BillLadders";
import BillLadderDialog from "./BillLadderDialog";
import SavedLadders from "./SavedLadders";

const Main = () => {
  const [open, setOpen] = useState(false);
  const [maturityDate, setMaturityDate] = useState<Dayjs>(
    dayjs().add(4, "month").set("date", 1)
  );
  const [auctionDate, setAuctionDate] = useState<Dayjs>(dayjs());
  const [savedLadders, updateSavedLadders] = useState<SavedLadderPayload[]>([]);
  const [ladderList, updateBondList] = useState<RealBillsCollectionType[][]>(
    [] as RealBillsCollectionType[][]
  );

  const [selectedBills, updateSelectedBill] = useState<
    RealBillsCollectionType[]
  >([]);

  const updateStorage = (newValue: SavedLadderPayload[]) => {
    window.localStorage.setItem("savedLadders", JSON.stringify(newValue));
  };

  const addLadder = (bills: RealBillsCollectionType[]) => {
    setOpen(true);
    updateSelectedBill(bills);
  };

  const handleClose = (payload?: SavedLadderPayload) => {
    if (payload) {
      // this needs to update local storage then trigger event;
      updateSavedLadders((prev) => {
        const ladders = prev.concat([payload]);
        updateStorage(ladders);
        return ladders;
      });
    }
    setOpen(false);
  };

  const removeLadder = (id: number) => {
    // this needs to manipulate localstorage then trigger an event
    updateSavedLadders((prev) => {
      const ladders = prev.filter((ladder) => ladder.id !== id);
      updateStorage(ladders);
      return ladders;
    });
  };

  const handleChange = (eventData: Dayjs, type: "maturity" | "auction") => {
    if (type === "maturity") {
      setMaturityDate(eventData as Dayjs);
    } else {
      setAuctionDate(eventData as Dayjs);
    }
  };

  useEffect(() => {
    // onload
    const ladders = window.localStorage.getItem("savedLadders");
    if (ladders) {
      const parsedLadders = JSON.parse(ladders);
      updateSavedLadders(parsedLadders);
    }
  }, []);

  useEffect(() => {
    if (maturityDate) {
      if (window?.electronAPI?.getBills) {
        window.electronAPI.getBills().then((realBills) => {
          const ladders = buildBillLadder(maturityDate, auctionDate, realBills);
          updateBondList(ladders);
        });
      }
    }
  }, [maturityDate, auctionDate]);

  useEffect(() => {
    if (ladderList.length && savedLadders.length) {
      updateSavedLadders((prev) => {
        return prev.map((savedLadder) => {
          const [savedBillId, savedBillData] = Object.entries(
            savedLadder.selectedBills[0]
          )[0];
          const firstBillAuctionDate = dayjs(savedBillData.auctionDate);
          if (firstBillAuctionDate.isBefore(dayjs().add(12, "days"))) {
            const correspondingBill = ladderList.find((incomingBond) => {
              const [incomingId] = Object.entries(incomingBond[0])[0];
              return savedBillId === incomingId;
            });

            if (correspondingBill) {
              const data = correspondingBill[0][savedBillId];
              savedLadder.invalid = false;
              savedLadder.selectedBills[0] = {
                [savedBillId]: {...savedBillData, ...data, invalid: false},
              };
            } else {
              savedLadder.invalid = true;
              savedLadder.selectedBills[0] = {
                [savedBillId]: {...savedBillData, invalid: false},
              };
            }
          }
          return savedLadder;
        });
      });
    }
  }, [ladderList]);

  return (
    <Grid2 container spacing={2} sx={{p: 2}} direction={"column"}>
      <SavedLadders savedLadders={savedLadders} removeLadder={removeLadder} />
      <BondControls
        handleChange={handleChange}
        maturityDate={maturityDate}
        auctionDate={auctionDate}
      />
      <BillLadders addLadder={addLadder} ladderList={ladderList} />
      <BillLadderDialog
        selectedBills={selectedBills}
        onClose={handleClose}
        open={open}
      />
    </Grid2>
  );
};

export default Main;
