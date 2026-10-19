import type { LoginCredentials } from './credentials';

export const invalidLoginCredentials: LoginCredentials = {
  username: 'standard_user',
  password: 'wrong_password',
};

export const invalidLoginErrorMessage =
  'Epic sadface: Username and password do not match any user in this service';
