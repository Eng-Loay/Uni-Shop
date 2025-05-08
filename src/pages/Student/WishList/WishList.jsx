import { ArrowBigLeft } from 'lucide-react';
import { ShoppingCart, Check, X } from 'lucide-react';
import { useWishlist } from '../WishListContext/WishListContext';
import ProductCard from '../ProductCard/ProductCard';
import empty from '../../../assets/empty/empty.png'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import { useState } from 'react';
function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const [addedItems, setAddedItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    // Check if item is already in cart
    const alreadyInCart = cartItems.some(item => item._id === product._id);
    
    if (alreadyInCart) {
      setPopupProduct({...product, message: 'Already in cart'});
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    // Add to cart
    addToCart({ ...product, quantity: 1 });
    setAddedItems(prev => [...prev, product._id]);
    setPopupProduct(product);
    setShowPopup(true);
    
    // Remove highlight and hide popup after 3 seconds
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== product._id));
      setShowPopup(false);
    }, 3000);
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
{showPopup && (
        <div className="fixed top-20 right-5 w-72 bg-white border border-green-400 shadow-lg rounded-lg p-4 z-50 animate-fade-in">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img
                src={popupProduct?.product_pictures?.[0]?.secure_url}
                alt={popupProduct?.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-green-600">
                  {popupProduct?.message || 'Added to Cart'}
                </h3>
                <p className="text-sm text-gray-600">{popupProduct?.name}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center mt-10">
           <img src={empty} alt="Empty cart" className="mx-auto w-100 h-auto" />
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      ) : (
        <>
      {/* Header Row - Matches cart but with different columns */}
      <div className="grid grid-cols-5 gap-4 text-main font-medium border-b pb-3 mb-4">
        <div className="col-span-3">Product</div>
        <div>Price</div>
        <div>Action</div>
      </div>

      {/* Wishlist Items */}
      {wishlist.map((product) => (
        <div
          key={product._id}
          className="grid grid-cols-5 gap-4 items-center border-b py-4"
        >
          {/* Product column - Wider since we have more space */}
          <div className="col-span-3 flex items-center space-x-4">
            <img
              src={product.product_pictures?.[0]?.secure_url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h2 className="font-semibold text-main">{product.name}</h2>
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-main">{product.price.toFixed(2)} EGP</div>

          {/* Action - Single Add to Cart button instead of quantity selector */}
         
          <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addedItems.includes(product._id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    addedItems.includes(product._id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-main text-white hover:bg-blue-700'
                  }`}
                >
                  {addedItems.includes(product._id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
        </div>
      ))}

      {/* No total section - Just a checkout button if you want */}
      <div className="mt-8 pt-4 flex justify-end">
        <button
          onClick={() => navigate('/productshome')}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
        >
          Continue Shopping
        </button>
      </div>
    </>
  )}
    </div>
    </>
  );
}
export default Wishlist;