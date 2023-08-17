import dotenv from 'dotenv'
dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT
    },
    mongo: {
        uri: process.env.MONGO_URI,
        dbname: process.env.MONGO_DB_NAME,
        secret: process.env.SECRET,
        collectionName: process.env.COLECTION_NAME
    }
}