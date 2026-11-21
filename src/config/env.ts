
try {
    process.loadEnvFile()

} catch (error) {
    
}


const str= (key: string, fallback: string):string=> process.env[key] || fallback;
const port = Number(str("PORT", "8001"));

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}`);
}

export const env={
    nodeEnv:str("NODE_ENV","development"),
    port,
    host:str("HOST","127.0.0.1"),
    logLevel:str("LOG_LEVEL","info"),
    corsOrigins:str("CORS_ORIGINS","").split(",").map((origin) => origin.trim()).filter(Boolean),
    mongoUrl:str("DB_URL",""),
    redisUrl:str("REDIS_URL",""),
     email:str("EMAIL",""),
     passkey:str("PASSKEY",""),
     jwtSecret:str("JWTSECRET","")
}