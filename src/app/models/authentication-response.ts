export interface AuthenticationResponse {
  token?: string;
  tfaEnabled?: string;
  secretImageUri?: string;
  role?: string;
}
