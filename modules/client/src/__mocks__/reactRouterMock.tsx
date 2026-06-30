import React from 'react';

const passthrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export const BrowserRouter = passthrough;
export const MemoryRouter = passthrough;
export const Routes = passthrough;
export const Route = passthrough;
export const Outlet = passthrough;
export const Link = ({ children, ...props }: React.ComponentProps<'a'>) => (
  <a {...props}>{children}</a>
);
export const Navigate = () => null;

export const useNavigate = () => jest.fn();
export const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'test',
});
export const useParams = () => ({});
export const redirect = jest.fn();
