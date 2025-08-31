import React from 'react';

function EmptyCart({ cartItems }) {
    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <img src="/empty-cart.svg" alt="Empty Cart" />
                <h2>Your cart is empty!</h2>
                <p>Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
        );
    }

}

export default EmptyCart;