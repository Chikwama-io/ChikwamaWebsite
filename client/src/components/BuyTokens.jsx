import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';


export default function FormDialog( {buyTokens, open, close} ) {
  
  const [tokensToBuy, setTokens] = React.useState('');
  const [value, setValue] = React.useState('');

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);

  const handleBuy = () => {
    buyTokens(tokensToBuy); 
  };

  const handleClose = () => {
    close();
  };

  const getPriceHandler = async () => {

    const tokenPrice = await cashPointsContract.PRICE_PER_TOKEN();
    const value = ethers.utils.formatEther(tokenPrice)*tokensToBuy;
    setValue(value);

  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can buy a stake in Chikwama. Chikwama(CHK) tokens entitle you to a stake in the DAO's revenues.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value = {tokensToBuy}
            id="name"
            label="Number of tokens"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
                const tokens =  e.target.value;
                setTokens(tokens);
                await getPriceHandler();
              }}
          />
          <DialogContentText>
            Value: $ {value}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBuy}>BUY</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
