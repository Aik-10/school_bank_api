declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_RATELIMIT_MAX: string | undefined;
            API_PORT: string | undefined;
            API_JWT_TOKEN: string;

            REDIS_PASSWORD: string;
            REDIS_HOST: string;
            REDIS_PORT: string | undefined;

            MYSQL_POOL_CONNECTION: string;
            DB_AUTH: string;
        }
    }
}

export { };