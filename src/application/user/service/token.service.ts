export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  roleEnabled: boolean;
}

export interface TokenService {
  generateToken(payload: TokenPayload): Promise<string>;

  verifyToken(token: string): TokenPayload;
}
