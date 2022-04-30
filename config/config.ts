export const config = {
    PORT: 3001,
    PROJECT_ID: 'wilsons-identity-server',
    KEY_FILE_PATH: './config/service-account.json',
    JWT_LIFE_SPAN: 1800 * 1000,
    CODE_LIFE_SPAN: 600 * 1000,
    ISSUER: "wilsons-identity-server",
    PRIVATE_KEY_PATH: './config/private_key.pem',
    PUBLIC_KEY_PATH: './config/public_key.pem',
    AUTH_TOKEN_ISSUER: "wilsons-identity-server",
}