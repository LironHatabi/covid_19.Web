import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Other from './otherCondition';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Register = ()=>{
    // States definition
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [BirthDay, setDayOfBirth] = useState('');
    const [Address, setAddress] = useState('');
    const [City, setCity ] = useState('');
    const [ZipCode, setZipCode] = useState('');
    const [LandLine, setLandLine] = useState('');
    const [Phone, setPhone] = useState('');
    const [isInfected, setCheckBox] = useState(false);
    const [other, setOther] = useState('');
    const [otherInput, setOtherInput] = useState(false);
    const [conditionInput, setConditionInput] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Befor send to back end fix all informarion
    // to one object for sending
    const inputData =async e =>{
        e.preventDefault();
        let conditiondata = [...conditionInput];
        if (otherInput) {
            conditiondata.splice(conditionInput.indexOf('Other'), 1);
            if(other)
            conditiondata.push(other);
        }
        var Conditions = " ";

        // Get the conditions ass string and not array
        conditiondata.forEach(condition => Conditions += `${condition} `);

        const sendData = {
            FirstName, LastName, BirthDay, Address, City, ZipCode,LandLine, Phone, isInfected, Conditions
        }
        // Send the data to the back end
        try{
            console.log(sendData);
            // await axios.post('http://localhost:8080/savedata', sendData);
            await axios.post('http://localhost:8080/savedata', sendData);
            navigate('/summary')
        }catch(e){
            setError(e.response.data.message);
        }  
    }

    // Fixing the date that was types by the user
    const dateFix = date =>{
        if (date){
            var Month = date.getMonth();
            var dateStr = date.getDate();

            if ((Number(date.getMonth()) + 1) < 10)
                Month = "0" + String((Number(date.getMonth()) + 1))
                // console.log((Number(date.getMonth()) + 1)> 10, date.getMonth());

            if (Number(date.getDate()) < 10)
                dateStr = "0" + String(date.getDate())

            // const dateOfBirth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const dateOfBirth = `${date.getFullYear()}-${Month}-${dateStr}`;


            // const dateOfBirth = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            setDayOfBirth(dateOfBirth);
        }  
    }

    // the html of the website register
    return (
        <div className="bg-light">
            <div className="d-flex justify-content-center mt-5">
            <h1>Covid19 - Registration Form</h1>
            </div>

            <div className="d-flex justify-content-center mt-5">
                <div>
                    <form onSubmit={inputData}>
                        <div>
                            <TextField className="mx-2"
                                required
                                id="outlined-required"
                                label="First Name"
                                defaultValue=""
                                onChange={e => setFirstName(e.target.value)}
                            />

                            <TextField className="mx-2"
                                required
                                id="outlined-required"
                                label="Last Name"
                                defaultValue=""
                                onChange={e => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="mt-5 mx-2">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={BirthDay || 'Date Of Birth'}
                                    inputFormat="dd/MM/yyyy"
                                    onChange={(newValue) => {
                                        dateFix(newValue);
                                    }}
                                    renderInput={(params) => <TextField className="mx-2 mt-3" {...params} />}
                                />
                            </LocalizationProvider>
                        </div>

                        <div className="mt-5">
                            <TextField className="mx-2"
                                required
                                id="outlined-required"
                                label="Address"
                                defaultValue=""
                                onChange={e => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="mt-5">
                            <TextField className="mx-2"
                                required
                                id="outlined-required"
                                label="City"
                                defaultValue=""
                                onChange={e => setCity(e.target.value)}
                            />

                            <TextField className="mx-2"
                                id="outlined-required"
                                label="Zip Code"
                                defaultValue=""
                                onChange={e => setZipCode(e.target.value)}
                            />
                        </div>

                        <div className="mt-5">
                            <TextField className="mx-2"
                                required
                                id="outlined-required"
                                label="Land Line"
                                defaultValue=""
                                onChange={e => setLandLine(e.target.value)}
                            />

                            <TextField className="mx-2"
                                required
                                id="outlined-required"
                                label="Cellular"
                                defaultValue=""
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="mt-5">
                            <FormControlLabel control={<Checkbox onChange={()=>setCheckBox(!isInfected)}
                            />} label="Have been infected by COVID-19 before"/>
                        </div >  
    
                        <div>
                            <Other setter={setConditionInput} setOther={setOtherInput}/>
                        </div>
                        <div>
                            <TextField hidden={!otherInput} className="mx-2 mt-3" id="filled-error"
                                       label="Add conditions" variant="filled" onChange={e => setOther(e.target.value)} />
                        </div>

                            
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="outlined">Send form</Button> 
                        </div>
 
                    </form>

                    <div>
                        <p className="text-center mx-auto w-75 mt-4" style={{color: "red"}}>{error}</p>
                    </div>
                    <div className='d-flex justify-content-center mb-5'>
                        <Button variant="contained"
                        onClick={() => navigate('/summary')}>Summary Page</Button>
                    </div>
                </div>
            </div>
        </div>
    );   
};

export default Register;