import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import AmazonDapp from './abis/AmazonDapp.json'

// Config
import config from './config.json'

function App() {
  const [account, setAccount] = useState('');

  const logBlockchainData = async () => {


    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  }

  useEffect(() => {
    logBlockchainData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Welcome to AmazonDapp</h2>

    </div>
  );
}

export default App;
