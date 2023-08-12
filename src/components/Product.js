import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, AmazonDapp, togglePop }) => {

  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchOrder = async () => {
    const events = await AmazonDapp.queryFilter("ProductPurchased");
    const orders = events.filter(
      (event) => event.args.buyer === account && event.args.productId.toString() === item.id.toString()
    )

    if (orders.length === 0) return

    const order = await AmazonDapp.orders(account, orders[0].args.orderId)
    setOrder(order)
  }

  const handlePurchase = async () => {
    const signer = await provider.getSigner();
    const transaction = await AmazonDapp.connect(signer).purchaseProduct(item.id, { value: item.price });
    await transaction.wait();
    setHasBought(true);
  }

  useEffect(() => {
    fetchOrder();
  }, [hasBought]);

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="product__overview">
          <h2>{item.name}</h2>
          <Rating value={item.rating} />
          <hr />
          <p>{ethers.utils.formatUnits(item.price.toString(), 'ether')} ETH</p>
          <hr />
          <h2>Overview</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, voluptate, quibusdam, quia voluptas quod quos
            voluptatibus quae doloribus quidem voluptatem. Quisquam voluptatum,
            voluptate, quibusdam, quia voluptas quod quos voluptatibus quae
            doloribus quidem voluptatem.
          </p>
        </div>
        <div className='product__order'>
          <h2>{ethers.utils.formatUnits(item.price.toString(), 'ether')} ETH</h2>
          <p>
            FREE Delivery by Amazon <br />
              Arrives:
               {' '}
              <strong>
                {new Date(Date.now() + (5 * 24 * 60 * 60 * 1000)).toLocaleDateString(undefined, { weekday: 'short' , year: 'numeric', month: 'long', day: 'numeric'})}
              </strong>
          </p>
          {item.quantity > 0 ? (
            <p>
              In stock
            </p>
          ): (
            <p>
              Currently unavailable
            </p>
          )}
          <hr />
          <button className='product__buy' disabled={item.quantity === 0} onClick={handlePurchase}>Buy Now</button>

          {order && (
            <div className='product__bought'>
              {item.name} bought for {ethers.utils.formatUnits(item.price.toString(), 'ether')} ETH at {new Date(Number(order.time.toString() + '000')).toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
              })}
            </div>
          )}
        </div>
        <button onClick={togglePop} className='product__close'>
          <img src={close} alt='Close' />
        </button>
      </div>
    </div>
  );
}

export default Product;