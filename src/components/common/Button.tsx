import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps & { loading?: boolean }> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  loading, // Destructure loading to prevent it from being in ...props
  fullWidth,
  className,
  disabled,
  ...props
}) => {
  const isCurrentlyLoading = isLoading || loading;
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`;
  
  return (
    <button
      className={buttonClass}
      disabled={disabled || isCurrentlyLoading}
      {...props}
    >
      {isCurrentlyLoading ? <span className={styles.loader} /> : children}
    </button>
  );
};
