import { render } from '@testing-library/react';
import { App } from './App';

test('should render app component', () => {
  const app = render(<App />);
  expect(app).toBeDefined();
});
