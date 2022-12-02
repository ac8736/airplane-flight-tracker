import { Modal, Box, Typography, Input, Button } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";

export default function EmailPhone({ open, close }) {
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getEmail() {
      try {
        const response = await fetch("http://127.0.0.1:5000/airline-email", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setEmails(data.emails);
      } catch (error) {
        console.log(error);
      }
    }
    async function getPhone() {
      try {
        const response = await fetch("http://127.0.0.1:5000/airline-phone", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setPhones(data.phones);
      } catch (error) {
        console.log(error);
      }
    }

    getEmail();
    getPhone();
  }, [refresh]);

  async function addEmail() {
    try {
      await fetch("http://127.0.0.1:5000/add-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });
      setEmail("");
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  }

  async function addPhone() {
    try {
      await fetch("http://127.0.0.1:5000/add-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ phone }),
      });
      setPhone("");
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Add Email/Phone
        </Typography>
        <Box sx={styles.container}>
          <Typography>Current Emails</Typography>
          <Box sx={styles.box}>
            {emails.map((email, index) => (
              <Typography key={index}>{email.email}</Typography>
            ))}
          </Box>
        </Box>
        <Box sx={styles.container}>
          <Typography>Current Phone Numbers</Typography>
          <Box sx={styles.box}>
            {phones.map((phone, index) => (
              <Typography key={index}>{phone.phone_number}</Typography>
            ))}
          </Box>
        </Box>
        <Box>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button variant="contained" sx={{ width: "30%", ml: "8px" }} onClick={addEmail}>
            Add Email
          </Button>
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button variant="contained" sx={{ width: "30%", ml: "8px" }} onClick={addPhone}>
            Add Phone
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
