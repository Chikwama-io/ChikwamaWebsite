import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import currencies from '../resources/currencies.json';


export default function AddCashPoint({open, close, update, add}) {

 
  const [feeAmount, setFee] = useState('');
  const [currency, setCurrency] = useState('');
  const [duration, setDuration] = useState('');
  const [cashPointName, setCashPointName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buyRate, setBuyRate] = useState('');
  const [sellRate, setSellRate] = useState('');

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);

  const handleClose = () => {
    close();
  };

  const handleAdd = () => {
    add(cashPointName,phoneNumber,currency, buyRate, sellRate, duration, feeAmount);
  }


  const getCostHandler = async (Duration) => {

    const fee = await cashPointsContract.CASHPOINT_FEE();
    let cost = ((parseInt(fee.toString())) * Duration).toString();
   
    setFee(ethers.utils.formatEther(cost));

  }


  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 365,
      label: '365',
    },
  ];



  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>{update?'Update a Cashpoint':'Add a Cashpoint'}</DialogTitle>
        <DialogContent>
        <DialogContentText>
        {update?'You are about to update your cash point details(The cash points location will be your current location).':'You are about to create a cash point at this location.'}</DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            value={cashPointName}
            id="name"
            label="Cash point name"
            type="text"
            fullWidth
            variant="filled"
            onChange={(e) => {
              setCashPointName(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            value={phoneNumber}
            id="phone"
            label="Phone Number"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {  
              setPhoneNumber(e.target.value);
            }}
          />
          <InputLabel id="demo-simple-select-standard-label">Currency:</InputLabel>
           <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          variant="filled"
          value={currency}
          label="Currency"
          onChange={async(e) => {
            setCurrency(e.target.value);
          }}
        >
            {currencies.map(({cc,symbol, name}, index) => (
            <MenuItem key={index} value={name}>
              {cc} - {name}
            </MenuItem>
          ))}
    </Select>
          <TextField
            autoFocus
            margin="dense"
            value={buyRate}
            id="buyRate"
            label="Buy rate"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              setBuyRate(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            value={sellRate}
            id="sellRate"
            label="Sell rate"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              setSellRate(e.target.value);
            }}
          />
          <InputLabel>Duration(Days):</InputLabel>
         <Slider 
         sx={{ width: 260 }} 
         defaultValue={30} 
         step={1} 
         marks={marks} 
         min={0} 
         max={365} 
         valueLabelDisplay="auto"
         value={duration} onChange={async(e) => {
          const Duration = e.target.value;
          setDuration(Duration);
          await getCostHandler(Duration);
        }}
         />
          <DialogContentText>
           Fee: ${feeAmount}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>{update?'Update':'Add'}</Button>
        </DialogActions>
    </Dialog>
  );
}