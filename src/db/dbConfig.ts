import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("mongo connected succesfully")
        })

        connection.on('error', (err) => {
            console.log("mongo connection errro. " + err);
            process.exit();
        })
    } catch (error) {
        console.log("error")
    }
}