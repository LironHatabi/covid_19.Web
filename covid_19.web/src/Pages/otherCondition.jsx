import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";


const MenuProps = {
    PaperProps: {
        style: {maxHeight: 130,width: 250, },
    },
};

const conditionNames = [
    'Diabetes',
    'Cardio-Vascular problems',
    'Allergies',
    'Other'
];

// The function to catch the consdition state and onother string
// that the user is typing
const Other = props => {
    const [condition, setCondition] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCondition(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        if (value.indexOf('Other') >= 0)
            props.setOther(true);
        else
            props.setOther(false);

        props.setter(typeof value === 'string' ? value.split(',') : value,);
    };


    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Conditions</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={condition}
                    onChange={handleChange}
                    input={<OutlinedInput label="Conditions" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {conditionNames.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={condition.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default Other;