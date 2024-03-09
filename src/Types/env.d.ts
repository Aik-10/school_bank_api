declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_RATELIMIT_MAX: number;
            API_PORT: number;
            API_JWT_TOKEN: string;

            REDIS_PASSWORD: string;
            REDIS_HOST: string;
            REDIS_PORT: number;

            MYSQL_POOL_CONNECTION: string;
        }
    }
}

export { };