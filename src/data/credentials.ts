export interface LoginCredentials {
  username: string;
  password: string;
}

function requiredVariable(name: 'LOGIN_USERNAME' | 'LOGIN_PASSWORD'): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`${name} must be set to a nonempty value in .env or the shell.`);
  }
  return value;
}

export function getValidLoginCredentials(): LoginCredentials {
  return {
    username: requiredVariable('LOGIN_USERNAME'),
    password: requiredVariable('LOGIN_PASSWORD'),
  };
}
