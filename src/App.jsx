import './App.css';
import productsData from './data.json';

function App() {
  return (
    <div className="App">
      <ProductsGrid/>
    </div>
  );
}


function ProductsGrid() {
  return (
    <>
      <h1>Desserts</h1>
      <div className="products-grid">
        {
          productsData.map((dessert, index) => (
            <Product key={index} product={dessert}/>
          ))
        }
        
      </div>
    </>
    
  );
}

function Product({product}) {
  return (
    <div className='product'>
      <div className='product-image'>
        <img src={product.image.desktop}/>
      </div>
      <div className="product-button">
        Add to cart
      </div>
      <span className='product-category'>{product.category}</span>
      <p className='product-name'>{product.name}</p>
      <span className='product-price'>€{product.price}</span>
    </div>
  )
}

export default App;
