import fs from "fs";

export function validateFields(product) {
  const requiredFields = [
    "title",
    "description",
    "price",
    "thumbnail",
    "code",
    "stock",
  ];

  for (const field of requiredFields) {
    if (!product[field]) throw new Error(`El campo "${field}" es requerido`);
  }
}

export function validateType(product) {
  const validateFieldsNumber = ["price", "stock"];
  const validateFieldsString = ["title", "description", "thumbnail", "code"];

  for (const field of validateFieldsNumber) {
    if (typeof product[field] !== "number")
      throw new Error(`El campo "${field}" deber ser de tipo number`);
  }

  for (const field of validateFieldsString) {
    if (typeof product[field] !== "string")
      throw new Error(`El campo "${field}" deber ser de tipo string`);
  }
}

export function validateOther(product) {
  if (product.price < 0)
    throw new Error(`El campo "price" no puede ser un numero negativo`);

  if (product.stock < 0 || product.stock % 1 !== 0)
    throw new Error(
      `El campo "stock" deber ser un número entero o no puede ser un numero negativo`
    );
}

export function validateExistCode(product, products) {
  if (!products) {
    throw new Error("No se ha encontrado ningún producto");
  }
  const codeExists = products.some((prod) => prod.code === product.code);
  if (codeExists)
    throw new Error(
      `El código "${product.code}" ya existe en la lista de productos, escribe otro!`
    );
}

export function validateFileJson(pathFile) {
  if (!fs.existsSync(pathFile))
    throw new Error(
      `El archivo de products.json no existe en la ruta "${pathFile}"`
    );
}
