import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBigLeft,Trash2 } from 'lucide-react';
import empty from '../../../assets/empty/empty.png'; 
import { useCart } from '../CartContext/CartContext';


function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalPrice} = useCart();
 
  const handleCheckout = () => {
    alert('Proceeding to checkout...');
    // Clear cart after checkout would be handled here if needed
  };
  const handleIncrement = (cartItemId, currentQuantity) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const handleDecrement = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    } else {
      removeFromCart(cartItemId);
    }
  };
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };
  return (
 

<>
<div className='mb-4 mt-10 ml-10'>
  <button
    onClick={() => navigate('/productshome')}
    className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
  >
    <ArrowBigLeft className="w-6 h-6 mr-1" />
    <span>Back to Products</span>
  </button>
</div>

<div className="bg-white py-8 px-4 sm:px-8 w-full max-w-4xl mx-auto">
  <h1 className="text-2xl font-bold mb-8 text-main">Your Shopping Cart</h1>

  {cartItems.length === 0 ? (
    <div className="text-center mt-10">
      <img src={empty} alt="Empty cart" className="mx-auto w-100 h-auto" />
      <p className="text-gray-500 mt-4 text-lg">Your cart is empty.</p>
    </div>
  ) : (
    <>
      {/* Header Row */}
      <div className="grid grid-cols-5 gap-4 text-main font-medium border-b pb-3 mb-4">
        <div className="col-span-2">Product</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Total</div>
      </div>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <div
          key={item.cartItemId}
          className="grid grid-cols-5 gap-4 items-center border-b py-4"
        >
          {/* Product column */}
          <div className="col-span-2 flex items-center space-x-4">
            <img
              src={item.product_pictures?.[0]?.secure_url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h2 className="font-semibold text-main">{item.name}</h2>
              <button
                onClick={() => removeFromCart(item.cartItemId)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-main"> {formatPrice(item.price)} EGP</div>

          {/* Quantity */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDecrement(item.cartItemId, item.quantity)}
              className="w-8 h-8 border rounded hover:bg-gray-100 flex items-center justify-center"
            >
              -
            </button>
            <span className="w-10 text-center border-t border-b">
                          {item.quantity}
                        </span>
            <button
              onClick={() => handleIncrement(item.cartItemId, item.quantity)}
              className="w-8 h-8 border rounded hover:bg-gray-100 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Total */}
          <div className="font-semibold text-main">
          {formatPrice((item.price || 0) * (item.quantity || 1))} EGP
          </div>
        </div>
      ))}

      {/* Total & Checkout */}
      <div className="mt-8 pt-4 flex justify-between items-center ">
        <div className="text-lg font-semibold text-main">
        Total: {formatPrice(totalPrice)} EGP
        </div>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </>
  )}
</div>
</>
  );
}

export default Cart;
