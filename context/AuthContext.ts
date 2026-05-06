import { createContext } from 'react';

export const AuthContext = createContext({
  firstName: '',
  lastName: '',
  email: '',
  setFirstName: (firstName: string) => {},
  setLastName: (lastName: string) => {},
  setEmail: (email: string) => {},
});
