import { FC, ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ variant, children, onClick }) => {
  const buttonVariant = variant === 'secondary' ? '' : 'bg-slate-300';

  return (
    <button
      className={`${buttonVariant} border-2 border-slate-300 px-8 py-2 rounded`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
