import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET=process.env.JWT_SECRET

if (!MONGO_URI) {
    throw new Error('MONGO_URI is  not defined in environment variables')
}
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is noe defined in environment variables')
}

const config = {
    MONGO_URI: MONGO_URI,
    JWT_SECRET: JWT_SECRET
}

export default config