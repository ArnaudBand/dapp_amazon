import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {

  return (
    <nav>
      <div className='nav__brand'>
        <h1>AmazonDapp</h1>
      </div>
      <input type='text' className='nav__search' />
      <button type='button' className='nav__connect'>
        {account.slice(0, 6)}...{account.slice(-4)}
      </button>

      <ul className='nav__links'>
        <li><a href='#Clothing & Jewelry'>Clothing & Jewelry</a></li>
        <li><a href='#Electronics & Gadgets'>Electronics & Gadgets</a></li>
        <li><a href='#Toys & Gaming'>Toys & Gaming</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;