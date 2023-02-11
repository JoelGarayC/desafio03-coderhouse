import fs from "fs";
import {
  validateExistCode,
  validateFields,
  validateFileJson,
  validateOther,
  validateType,
} from "./validations.js";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    const product = { title, description, price, thumbnail, code, stock };

    try {
      // validacion de los campos y tipos
      validateFields(product);
      validateType(product);
      validateOther(product);

      // obtencion de la BD de products
      const products = await this.getProducts();

      // validacion si existe el codigo en la lista
      validateExistCode(product, products);

      // creacion de un id autoincrementable para el producto
      const id =
        products.length === 0 ? 1 : products[products.length - 1].id + 1;

      // agregacion del producto a la lista de productos
      await fs.promises.writeFile(
        this.path,
        JSON.stringify([...products, { id, ...product }]),
        "utf-8"
      );
      console.log("Producto agregado a products.json con éxito");
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock }
  ) {
    const newProduct = { title, description, price, thumbnail, code, stock };

    try {
      // validacion de los campos y tipos
      validateFields(newProduct);
      validateType(newProduct);
      validateOther(newProduct);

      if (!id) throw new Error("Falta el Id del producto");

      // obtencion de la BD de products
      const products = await this.getProducts();

      // validacion si existe el codigo en la lista
      let updateProd = products.find((prod) => prod.id === id);
      if (!updateProd)
        throw new Error(
          `Producto con ID: ${id} no se encontró en la lista, no se pudo actualizar!`
        );

      // obtencion del indice del producto
      const productIndex = products.findIndex((prod) => prod.id === id);
      products[productIndex] = { ...updateProd, ...newProduct };

      //actualizando la lista de productos
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log(`Producto con ID: ${id} actualizado con éxito!`);
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) throw new Error("Falta el Id del producto");
      // obtencion de la BD de products
      const products = await this.getProducts();

      // validacion si existe el codigo en la lista
      let idProd = products.some((prod) => prod.id === id);
      if (!idProd)
        throw new Error(
          `Producto con ID: ${id} no se encontró en la lista, no se pudo eliminarlo!`
        );

      // filtrando la lista de productos
      const productsF = products.filter((prod) => prod.id !== id);

      //actualizando la lista de productos
      await fs.promises.writeFile(this.path, JSON.stringify(productsF));
      console.log(`Producto con ID: ${id} eliminado correctamente`);
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

  async getProducts() {
    try {
      // validacion si existe el archivo products.json
      validateFileJson(this.path);

      let data = await fs.promises.readFile(this.path, "utf-8");
      if (!data) return [];
      return JSON.parse(data);
    } catch (err) {
      return err.message;
    }
  }

  async getProductById(id) {
    try {
      if (!id) throw new Error("Falta el Id del producto");

      const products = await this.getProducts();

      const newId = Number(id);

      const productById = products.find((product) => product.id === newId);
      if (!productById) return `Producto con ID: ${id} no encontrado`;
      return productById;
    } catch (err) {
      return err.message;
    }
  }
}

export default ProductManager;
