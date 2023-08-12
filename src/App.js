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
  const [amazonDapp, setAmazonDapp] = useState(null);
  const [account, setAccount] = useState('');

  const [electronics, setElectronics] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [toys, setToys] = useState([]);

  const togglePop = () => {
    console.log('togglePop');
  }

  const logBlockchainData = async () => {

    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    // console.log('network', network);

    // Connect to contract
    const amazonDapp = new ethers.Contract(config[31337].AmazonDapp.address, AmazonDapp, provider);
    setAmazonDapp(amazonDapp);

    // Load products
    const products = [];

    for (let i = 0; i < 9; i++) {
      const product = await amazonDapp.products(i + 1);
      products.push(product);
    }

    const electronics = products.filter(product => product.category === 'electronics');
    const clothing = products.filter(product => product.category === 'clothing');
    const toys = products.filter(product => product.category === 'toys');

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);

  }

  useEffect(() => {
    logBlockchainData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Welcome to AmazonDapp</h2>
      {electronics && clothing && toys && (
        <>
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}
    </div>
  );
}

export default App;
