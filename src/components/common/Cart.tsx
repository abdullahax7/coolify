'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Cart.module.css';

export const CartIcon = () => {
  const router = useRouter();
  const { itemCount, items, removeItem, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.cartWrapper}>
      <button 
        className={styles.cartBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Cart"
      >
        <span className={styles.icon}>🛒</span>
        {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.drawer}>
            <div className={styles.header}>
              <h3>Your Cart</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <p>Your cart is empty</p>
                  <span className={styles.emptyIcon}>🛍️</span>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>{item.price}</span>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>£{total.toFixed(2)}</span>
                </div>
                <button 
                  className={styles.checkoutBtn}
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/checkout?cart=true');
                  }}
                >
                  Checkout Now
                </button>
                <button className={styles.clearBtn} onClick={clearCart}>Clear All</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
