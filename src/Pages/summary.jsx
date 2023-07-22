import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx'

let counter = 0;

const Summary = () => {
    const [city, setCity] = useState();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rows, setrows] = useState([]);
    const [error, setError] = useState()
    const navigate = useNavigate();

    // Get the info of the tables one time at the start
    useEffect(async () => {
        try {
            // const res = await axios.get('http://localhost:8000/');
            const res = await axios.get('http://localhost:8080/getAll');

            setrows(res.data);
        } catch (e) {
            setError('Could not connect to the server')
        }
    }, [])

    // Function the get the full information of the sign in
    const fullTable = async () => {
        try {
            // const res = await axios.get('http://localhost:8000/');
            const res = await axios.get('http://localhost:8080/getAll');
            setrows(res.data);
        } catch (e) {
            setError('Could not connect to the server')
        }

    }

    // Function to filter by city to send to back end
    const cityInput = async e => {
        e.preventDefault();
        if (city) {
            try {
                const res = await axios.get(`http://localhost:8080/city/${city}`);
                setrows(res.data);
            } catch (e) {
                setError('Could not connect to the server')
            }


        }
    }

    // Function to filter by date to send to back end
    const dateInput = async e => {
        e.preventDefault();
        if (startDate && endDate) {
            try {
                const res = await axios.get(`http://localhost:8080/dob?first=${startDate}&second=${endDate}`);
                setrows(res.data);
            } catch (e) {
                setError('Could not connect to the server')
            }

        }
    }

    // Function to fix the date to send to back end
    const startDateFix = date => {
        if (date) {
            var Month = date.getMonth();
            var dateStr = date.getDate();

            if ((Number(date.getMonth()) + 1) < 10)
                Month = "0" + String((Number(date.getMonth()) + 1))
            // console.log((Number(date.getMonth()) + 1)> 10, date.getMonth());

            if (Number(date.getDate()) < 10)
                dateStr = "0" + String(date.getDate())

            // const dateOfBirth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const dateOfBirth = `${date.getFullYear()}-${Month}-${dateStr}`;
            setStartDate(dateOfBirth);
        }
    }

    // Function to fix the date to send to back end
    const endtDateFix = date => {
        if (date) {

            var Month = date.getMonth();
            var dateStr = date.getDate();

            if ((Number(date.getMonth()) + 1) < 10)
                Month = "0" + String((Number(date.getMonth()) + 1))

            if (Number(date.getDate()) < 10)
                dateStr = "0" + String(date.getDate())

            // const dateOfBirth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const dateOfBirth = `${date.getFullYear()}-${Month}-${dateStr}`;
            setEndDate(dateOfBirth);
        }
    }

    const checkExelDate = async (x) => {
        if (startDate && endDate) {
            try {
                const res = await axios.get(`http://localhost:8080/dob?first=${startDate}&second=${endDate}`);
                if (res.data.length > 0)
                    exportToExcel(res.data)
            } catch (e) {
                setError('Could not connect to the server')
            }
        }
    };

    const checkExelcity = async (x) => {

        if (city) {
            try {
                const res = await axios.get(`http://localhost:8080/city/${city}`);
                // setrows(res.data);
                if (res.data.length > 0)
                    exportToExcel(res.data)
            } catch (e) {
                setError('Could not connect to the server')
            }
        }
    };
    const checkExelAll = async (x) => {

        try {
            const res = await axios.get('http://localhost:8080/getAll');
            if (res.data.length > 0)
                exportToExcel(res.data)
        } catch (e) {
            setError('Could not connect to the server')
        }

    };

    const exportToExcel = (data) => {

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'date.xlsx');
        setrows(data);
    }

    // the HTML of the summary
    return (
        <div>
            <div className='d-flex justify-content-center mt-5'>
                <h5 >Choose filter by city:</h5>
            </div>
            <div className='d-flex justify-content-center mt-2'>
                <TextField id="outlined-basic" label="City"
                    variant="outlined"
                    onChange={e => setCity(e.target.value)}
                />
            </div>
            <div className='d-flex justify-content-center mt-2'>
                <Stack direction="row" spacing={2}>
                    <Button onClick={cityInput} variant="contained">
                        Send
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button onClick={checkExelcity}
                        className='mx-2' variant="contained" disabled={!city}>
                        Print to excel
                    </Button>
                </Stack>
            </div>

            <div className='d-flex justify-content-center mt-5'>
                <h5 >Choose filter by Date:</h5>
            </div>
            <div className='d-flex justify-content-center mt-2'>
                <div className='mx-2'>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Start Date"
                            value={startDate || 'Start Date'}
                            inputFormat="dd/MM/yyyy"
                            onChange={(newValue) => {
                                startDateFix(newValue);
                            }}
                            renderInput={(params) => <TextField className="mx-2 mt-3" {...params} />}
                        />
                    </LocalizationProvider>
                </div>

                <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="End Date"
                            value={endDate || 'End Date'}
                            inputFormat="dd/MM/yyyy"
                            onChange={(newValue) => {
                                endtDateFix(newValue);
                            }}
                            renderInput={(params) => <TextField className="mx-2 mt-3" {...params} />}
                        />
                    </LocalizationProvider>
                </div>


            </div>
            <div className='d-flex justify-content-center mt-2'>
                <Stack direction="row" spacing={2}>
                    <Button onClick={dateInput} variant="contained">
                        Send
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button onClick={checkExelDate}
                        className='mx-2' variant="contained" disabled={!startDate || !endDate}>
                        Print to excel
                    </Button>
                </Stack>
            </div>

            <div className='d-flex justify-content-center'>
                <p className='text-danger'>{error}</p>
            </div>

            <table className="table table-striped mt-5">
                <thead>
                    <tr>
                        <th scope="col">FirstName</th>
                        <th scope="col">LastName</th>
                        <th scope="col">BirthDay</th>
                        <th scope="col">Address</th>
                        <th scope="col">City</th>
                        <th scope="col">ZipCode</th>
                        <th scope="col">LandLine</th>
                        <th scope="col">Phone</th>
                        <th scope="col">isInfected</th>
                        <th scope="col">Conditions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={counter++}>
                            <td>{row.firstName}</td>
                            <td>{row.lastName}</td>
                            <td>{row.birthDay}</td>
                            <td>{row.address}</td>
                            <td>{row.city}</td>
                            <td>{row.zipCode}</td>
                            <td>{row.landLine}</td>
                            <td>{row.phone}</td>
                            <td>{row.isInfected ? "true" : "false"}</td>
                            <td>{row.conditions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='d-flex justify-content-center mb-5'>
                <Button variant="contained"
                    onClick={() => navigate('/')}>Register Page</Button>
            </div>

            <div className='d-flex justify-content-center mt-2'>
                <Stack direction="row" spacing={2}>
                    <Button onClick={fullTable} variant="contained">
                        Show full table
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                    {/* <Button href='http://localhost:8000/allexport' className='mx-2' variant="contained"> */}
                    <Button onClick={checkExelAll} className='mx-2' variant="contained">
                        Print full table to excel
                    </Button>
                </Stack>
            </div>
        </div>
    )
}

export default Summary;