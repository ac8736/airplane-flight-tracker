export const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  flightsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    height: "50vh",
    overflow: "auto",
  },
  flight: {
    border: "1px solid #000",
    p: 0.5,
  },
};
