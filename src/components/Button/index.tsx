import { FC, ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  loading?: boolean;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ variant, children, loading, onClick }) => {
  const buttonVariant = variant === 'secondary' ? 'text-white' : 'bg-[#ac9eb8] text-black';

  return (
    <button
      className={`${buttonVariant} border-2 border-[#ac9eb8] px-8 py-2 rounded relative shadow-md shadow-[rgba(0,0,0,0.5)] active:shadow-none`}
      onClick={onClick}
      disabled={loading}
    >
      {!loading && children}
      {loading &&
        <>
          <div className="invisible">
            {children}
          </div>
          <div className="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0">
            <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
          </div>
        </>
      }
    </button>
  );
};
