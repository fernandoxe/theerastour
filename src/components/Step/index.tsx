import { FC, ReactNode } from 'react';

export interface StepProps {
  children: ReactNode,
}

export const Step: FC<StepProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
};
