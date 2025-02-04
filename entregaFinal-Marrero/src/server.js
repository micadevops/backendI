import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { ProductService } from "./services/product.service.js"
import { viewsRouter } from "./routes/views.routes.js";
import handlebars from "express-handlebars";
import morgan from "morgan";
import { __dirname } from "./utils/path.js";
import { Server } from "socket.io";
import { cartRouter } from "./routes/carts.routes.js";
import path from "path";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

dotenv.config();

//Configuracion de express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, "../public")));


//Configuracion de Mongo DB
const uri = process.env.MONGO_URL;
if (!uri) {
    console.error('ERROR: La variable de entorno MONGO_URL no está definida');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error(error));


//Configuracion de handlebars

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),

}));

app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));


//Rutas
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//Configuracion de websocket
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado", socket.id);
    socket.emit("init", productService.products);
});