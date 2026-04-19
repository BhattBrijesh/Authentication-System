import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

connectToDB()

const PORT = 3000


app.listen(PORT, () => {
    console.log(`app is listening http://localhost:${PORT}`);
});