export interface JwtPayload {
  userId: number; 
  email: string;
  type: 'passwordReset';
}