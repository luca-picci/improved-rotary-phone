export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Il campo password è opzionale per motivi di sicurezza
  userType: 'CLIENT' | 'MANAGER';
}
