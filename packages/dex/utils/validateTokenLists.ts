import { schema } from "@uniswap/token-lists";
import Ajv from "ajv";
import addFormats from "ajv-formats";

/**
 * Returns TokenList if valid, otherwise throws errors
 * @param {string} list TokenList URL
 * @returns {any}
 */
export async function validateTokenList(list: string) {
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);
  const validator = ajv.compile(schema);
  const response = await fetch(list);
  const data = await response.json();
  const valid = validator(data);

  if (valid) {
    return valid;
  }
  if (validator.errors) {
    throw validator.errors.map((error) => {
      delete error.data;
      return error;
    });
  }
}