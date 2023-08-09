import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {

  const connectWallet = async () => {
    try {
      const account = await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      // const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
      console.log('account', account);
    } catch (error) {
      console.log('error', error);
    }
  }

  const disconnectWallet = async () => {
    try {
      setAccount('');
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>AmazonDapp</h1>
      </div>
      <input type='text' className='nav__search' />

      {account ? (
        <button className='nav__connect' onClick={disconnectWallet}>Connected</button>
      ) : (
        <button className='nav__connect' onClick={connectWallet}>Connect Wallet</button>
      )}

      <ul className='nav__links'>
        <li><a href='#Clothing & Jewelry'>Clothing & Jewelry</a></li>
        <li><a href='#Electronics & Gadgets'>Electronics & Gadgets</a></li>
        <li><a href='#Toys & Gaming'>Toys & Gaming</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;