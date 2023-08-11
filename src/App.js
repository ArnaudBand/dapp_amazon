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

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');

  const logBlockchainData = async () => {

    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    // console.log('network', network);

    // Connect to contract
    const amazonDapp = new ethers.Contract(config[31337].AmazonDapp.address, AmazonDapp, provider);
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
