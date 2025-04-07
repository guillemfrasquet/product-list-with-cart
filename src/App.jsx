import { useState } from 'react';
import './App.css';
import productsData from './data.json';

function App() {
  const [cart, setCart] = useState({});
  const [showModal, setShowModal] = useState(false);


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

  
  function handleDeleteProduct(product) {
    handleChangeCount(product, 0);
  }

  function handleConfirmOrder() {
    setShowModal(true);
  }

  function handleStartNewCart() {
    setCart({});
    setShowModal(false);
  }

  return (
    <div className="App">
      <ProductsGrid onChangeCount={handleChangeCount} cart={cart}/>
      <Cart cart={cart} onDeleteProduct={handleDeleteProduct} onConfirmOrder={handleConfirmOrder}/>
      <OrderConfirmedModal showModal={showModal} cart={cart} onStartNewCart={handleStartNewCart} />
    </div>
  );
}


function ProductsGrid({onChangeCount, cart}) {
  return (
    <>
      <div className="products-container">
        <h1>Desserts</h1>
        <div className="products-grid">
          {
            productsData.map((dessert, index) => (
              <Product key={index} product={dessert} cart={cart} onChangeCount={onChangeCount}/>
            ))
          } 
        </div>
      </div>
      
    </>
    
  );
}

function Product({product, cart, onChangeCount}) {
  //const [count, setCount] = useState(0);
  const count = cart[product.name] || 0; // obtiene el valor de la cantidad desde la cesta

  function handleClickAdd() {
    //setCount(count + 1);
    //count = count + 1;
    onChangeCount(product, count + 1);  //el valor de count no actualiza hasta después del renderizado
  }

  function handleClickRemove() {
    if(count > 0) {
      //setCount(count - 1);
      //count = count - 1;
      onChangeCount(product, count - 1);
    }
  }


  let buttonContent = "";

  

  return (
    <div className='product'>
      <div className='product-image'>
      <img 
        srcSet={`
          ${product.image.mobile} 600w,
          ${product.image.tablet} 1024w,
          ${product.image.desktop} 1920w
        `}
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 100vw, 1920px" 
        src={product.image.desktop} // Fallback for browsers that don't support srcSet
        alt={product.name} 
      />

      </div>
      {count === 0 ? (
        <div className="product-button add-first-button" onClick={handleClickAdd}>
          <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart" />
          Add to cart
        </div>
      ) : (
        <div className='product-button edit-count-button'>
          <button className='add-product-button' onClick={handleClickRemove}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
          </button>
          <div>{count}</div>
          <button className='remove-product-button' onClick={handleClickAdd}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
            </button>
        </div>
      )}
      <div className='product-info'>
        <span className='product-category'>{product.category}</span>
        <p className='product-name'>{product.name}</p>
        <span className='product-price'>€{product.price.toFixed(2)}</span>
      </div>
      
    </div>
  )
}


function Cart({cart, onDeleteProduct, onConfirmOrder}) {
  let total = 0;
  const totalQuantity = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  function handleConfirmOrder() {
    onConfirmOrder();
  }

  return (
    <div className="cart">
      <h2>Your Cart ({totalQuantity})</h2>
      {Object.keys(cart).length === 0 ? (
          <div class="empty-cart">
            <img src="assets/images/illustration-empty-cart.svg" />
            <p>
              Your added items will appear here
            </p>
          </div>
      ) : (
        <>
          {Object.keys(cart).map((productName) => {
            const quantity = cart[productName];
            const product = productsData.find(product => product.name == productName);
            const subtotal = quantity * product.price;
            total = total + subtotal;
            return (
              <div key={productName}>
                <CartElement product={product} quantity={quantity} onDeleteProduct={onDeleteProduct} />
              </div>
            );
          })}
          <div className='order-total'>
            <div className='order-total-label'>Order Total</div>
            <div className='order-total-value'>€{total.toFixed(2)}</div>
          </div>
          <div className='carbon-neutral-text'>
            <img src="assets/images/icon-carbon-neutral.svg" />
            <p>This is a <strong>carbon-neutral</strong> delivery</p>
          </div>
          <div className="confirm-order-button" onClick={handleConfirmOrder}>
            Confirm order
          </div>
        </>
      )}
    </div>
  )
}


function CartElement({product, quantity, onDeleteProduct}) {

  function handleDeleteProduct() {
    onDeleteProduct(product);
  }
return (
  <div key={product.name} className='cart-element'>
    <div className='details'>
      <p className='product-name'>{product.name}</p>
      <div>
        <span className='product-quantity'>{quantity}x</span>  <span class='product-individual-price'>@ €{product.price.toFixed(2)}</span>  <span className='product-subtotal'>€{(quantity*product.price).toFixed(2)}</span>
      </div>
    </div>
    <div className='delete-product' onClick={handleDeleteProduct}>
      <img src='assets/images/icon-remove-item.svg'/>
    </div>
  </div>
)
}


function OrderConfirmedModal({showModal, cart, onStartNewCart}){
  let total = 0;
  if (showModal) {
    return (
      <div class="modal-overlay">
      <div class="modal">
        <div className='title'>
          <img className='icon-order-confirmed' src="assets/images/icon-order-confirmed.svg" />
        <h2 >Order Confirmed</h2>
        </div>
        
        <p>We hope you enjoy your food!</p>
        <div className='summary-products'>
          {Object.keys(cart).map((productName) => {
            const quantity = cart[productName];
            const product = productsData.find(product => product.name == productName);
            const subtotal = quantity * product.price;
            total = total + subtotal;
            return (
              <div key={productName}>
                <SummaryItem product={product} quantity={quantity} />
              </div>
            );
          }
        )
        }
        <div className='order-total'>
              <div className='order-total-label'>Order Total</div>
              <div className='order-total-value'>€{total.toFixed(2)}</div>
        </div>

        <div className="confirm-order-button" onClick={onStartNewCart}>
            Start new order
        </div>
      </div>
      </div>
    </div>
  )
}
}

function SummaryItem({product, quantity}) {

return (
  <div key={product.name} className='summary-element'>
    <div className='product-image'>
      <img src={product.image.desktop}/>
    </div>
    <div className='details'>
      <p className='product-name'>{product.name}</p>
      <div>
        <span className='product-quantity'>{quantity}x</span>  <span class='product-individual-price'>@ €{product.price.toFixed(2)}</span>  
      </div>
    </div>
    <div>
    <span className='product-subtotal'>€{(quantity*product.price).toFixed(2)}</span>
    </div>
  </div>
)
}


export default App;
