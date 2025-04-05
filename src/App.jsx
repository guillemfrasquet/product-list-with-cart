import { useState } from 'react';
import './App.css';
import productsData from './data.json';

function App() {
  const [cart, setCart] = useState({});

  function handleChangeCount(product, count) {
    setCart(prev => {
      const newCart = { ...prev }; // Create a copy of the cart
  
      if(count <= 0) {
        delete newCart[product.name];
      } else {
        newCart[product.name] = count;  // add product
      }
  
      return newCart; // return modified copy
    });
  }
  return (
    <div className="App">
      <ProductsGrid onChangeCount={handleChangeCount}/>
      <Cart cart={cart}/>
    </div>
  );
}


function ProductsGrid({onChangeCount}) {
  return (
    <>
      <div className="products-container">
        <h1>Desserts</h1>
        <div className="products-grid">
          {
            productsData.map((dessert, index) => (
              <Product key={index} product={dessert} onChangeCount={onChangeCount}/>
            ))
          } 
        </div>
      </div>
      
    </>
    
  );
}

function Product({product, onChangeCount}) {
  const [count, setCount] = useState(0);

  function handleClickAdd() {
    setCount(count + 1);
    onChangeCount(product, count + 1);  //el valor de count no actualiza hasta después del renderizado
  }

  function handleClickRemove() {
    if(count > 0) {
      setCount(count - 1);
      onChangeCount(product, count - 1);
    }
  }


  let buttonContent = "";

  if(count === 0) {
    buttonContent = <div className="add-first-button" onClick={handleClickAdd}>Add to cart</div>;
  } else {
    buttonContent = <div className='edit-count-button'>
        <button className='add-product-button' onClick={handleClickRemove}>-</button>
        <div>{count}</div>
        <button className='remove-product-button' onClick={handleClickAdd}>+</button>
        </div>;
  }

  

  return (
    <div className='product'>
      <div className='product-image'>
        <img src={product.image.desktop}/>
      </div>
      <div className="product-button">
        {buttonContent}
      </div>
      <span className='product-category'>{product.category}</span>
      <p className='product-name'>{product.name}</p>
      <span className='product-price'>€{product.price}</span>
    </div>
  )
}


function Cart({cart}) {
  let total = 0;
  return (
    <div className="cart">
      <h2>Cart</h2>
      {Object.keys(cart).map((productName) => {
        const quantity = cart[productName];
        const product = productsData.find(product => product.name == productName);
        const subtotal = quantity*product.price;
        total = total + subtotal;
      return (
        
        <div key={productName}>
          <CartElement product={product} quantity={quantity} />
        </div>
      );
    })}
    Total: €{total}
    </div>
  )
}


function CartElement({product, quantity}) {
return (
  <div key={product.name} className='cart-element'>
    <div className='details'>
      <p>{product.name}</p>
      <div>
        {quantity}x  @ €{product.price}  €{quantity*product.price}
      </div>
    </div>
  </div>
)
}

export default App;
