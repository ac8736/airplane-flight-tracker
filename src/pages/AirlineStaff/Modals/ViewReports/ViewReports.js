import { styles } from "./styles";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ViewReports({ open, close }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const cleanData = [
    { time: `Jan`, ticketsSold: 0 },
    { time: `Feb`, ticketsSold: 0 },
    { time: `Mar`, ticketsSold: 0 },
    { time: `Apr`, ticketsSold: 0 },
    { time: `May`, ticketsSold: 0 },
    { time: `Jun`, ticketsSold: 0 },
    { time: `Jul`, ticketsSold: 0 },
    { time: `Aug`, ticketsSold: 0 },
    { time: `Sep`, ticketsSold: 0 },
    { time: `Oct`, ticketsSold: 0 },
    { time: `Nov`, ticketsSold: 0 },
    { time: `Dec`, ticketsSold: 0 },
  ];

  const [tickets, setTickets] = useState([]);

  const [rows, setRows] = useState(cleanData);

  useEffect(() => {
    async function getTickets() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-tickets-by-airline", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          setTickets(data.tickets);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTickets();
  }, []);

  function search() {
    const newRows = JSON.parse(JSON.stringify(cleanData));
    tickets.forEach((ticket) => {
      const ticketDate = new Date(ticket.purchase_date_and_time);
      if (ticketDate.getFullYear() === parseInt(year)) {
        newRows[ticketDate.getMonth()].ticketsSold += 1;
      }
    });
    setRows(newRows);
  }

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Reports
        </Typography>
        <Input placeholder="Type the Year to View" value={year} onChange={(e) => setYear(e.target.value)} type="number" />
        <Button onClick={search}>Search</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell align="right">Tickets Sold</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell align="right">{row.ticketsSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
}

/**
 * 
 * import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function DenseTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 */
