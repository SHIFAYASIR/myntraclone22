const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const mssql = require("./utils/sql.helper.js");

// middleware
const { notFound, errorHandler } = require("./middleware/error.middleware.js");

// user define routes
const usersRoutes= require("./routes/V1/users.routes.js");
const uploadRoutes = require("../job portal/routes/V1/upload.routes.js");
const productRoutes = require("../mayntraclone/routes/V1/product.routes.js")
const orderRoutes = require("./routes/V1/order.routes.js")
const cartRoutes = require("./routes/V1/cart.routes.js")
const wishlistRoutes = require("./routes/V1/widhlist.routes.js")
const adminRoutes  = require("./routes/V1/admin.routes.js")
const productManagerRoutes = require("./routes/V1/productManager.routes.js")


dotenv.config();

const app = express();
mssql.connect();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
// const __dirname3 = path.resolve();
// console.log(__dirname3);
app.use("/uploads", express.static("/uploads"));

// user define routes
app.use("/api/upload", uploadRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/products",productRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/wishlist",wishlistRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/productManager",productManagerRoutes)



app.get("/", (req, res) => {
  res.send("Api is running");
});




app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Server started running on ${colors.green(
      `http://localhost:${process.env.PORT}`
    )} for ${colors.rainbow(process.env.NODE_ENV)}`
  );
});
