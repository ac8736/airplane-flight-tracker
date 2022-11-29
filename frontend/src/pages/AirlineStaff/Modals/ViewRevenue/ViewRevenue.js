import { styles } from "./styles";
import { Modal, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function ViewRevenue({ open, close }) {
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  useEffect(() => {
    async function getRevenue() {
      try {
        const monthlyResponse = await fetch("http://127.0.0.1:5000/revenue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            time: "month",
          }),
        });
        const monthlyData = await monthlyResponse.json();
        setMonthlyRevenue(monthlyData.revenue);

        const yearlyResponse = await fetch("http://127.0.0.1:5000/revenue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            time: "year",
          }),
        });
        const yearlyData = await yearlyResponse.json();
        setYearlyRevenue(yearlyData.revenue);
      } catch (error) {
        console.log(error);
      }
    }

    getRevenue();
  }, []);

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Revenue
        </Typography>
        <Typography>
          Revenue in the Past Month: $
          {monthlyRevenue.revenue ? monthlyRevenue.revenue : 0}
        </Typography>
        <Typography>
          Revenue in the Past Year: $
          {yearlyRevenue.revenue ? yearlyRevenue.revenue : 0}
        </Typography>
      </Box>
    </Modal>
  );
}
