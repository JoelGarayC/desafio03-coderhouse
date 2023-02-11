import express from "express";
import path from "path";
import * as url from "url";
import ProductManager from "./ProductManager.js";

//alternativa __dirname de module, para obtener la ruta actual
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const basePath = path.join(`${__dirname}/products.json`);
const product = new ProductManager(basePath);

// app
const app = express();
const PORT = 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (_req, res) => {
  res.json({ res: "Welcome API" });
});

app.get("/products", (req, res) => {
  async function getProduct() {
    const { limit } = req.query;

    try {
      const products = await product.getProducts();

      if (limit) {
        const limitProducts = products.slice(0, limit);
        res.json({
          ok: true,
          message: "Lista de productos filtrada",
          products: limitProducts,
        });
        return;
      }

      res.json({
        ok: true,
        message: "Lista de productos",
        products: products,
      });
    } catch (err) {
      res.json({ error: err.message });
    }
  }

  getProduct();
});

app.get("/products/:pid", (req, res) => {
  async function getProductById() {
    const { pid } = req.params;
    try {
      const productById = await product.getProductById(pid);
      res.json({
        ok: true,
        product: productById,
      });
    } catch (err) {
      res.json({ error: err.message });
    }
  }
  getProductById();
});

// Listening App Server
app.listen(PORT, () => {
  console.log(`Listening in http://localhost:${PORT}`);
});
