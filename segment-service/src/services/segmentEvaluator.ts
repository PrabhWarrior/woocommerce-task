import Product from "../models/Product";
import { Product as ProductType } from "../types/product";

const operatorMap = (operator: string): string => {
  const operators: { [key: string]: string } = {
    "=": "$eq",
    ">": "$gt",
    "<": "$lt",
    ">=": "$gte",
    "<=": "$lte",
    "!=": "$ne"
  };
  return operators[operator] || "$eq";
};

const parseCondition = (
  condition: string
): { field: string; query: any } => {
  const trimmed = condition.trim();
  if (!trimmed) {
    throw new Error("Condition cannot be empty");
  }

  const match = trimmed.match(/^(\w+)\s*(=|>|<|>=|<=|!=)\s*(.+)$/);
  if (!match) {
    throw new Error(`Invalid condition format: ${trimmed}`);
  }

  const [, field, operator, value] = match;

  const validFields = [
    "id",
    "title",
    "price",
    "stock_status",
    "stock_quantity",
    "category",
    "tags",
    "on_sale",
    "created_at"
  ];
  if (!validFields.includes(field)) {
    throw new Error(`Invalid field: ${field}`);
  }

  const query: any = {};

  switch (field) {
    case "id": {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue)) {
        throw new Error(`Invalid id value: ${value}`);
      }
      query[field] = { [operatorMap(operator)]: parsedValue };
      break;
    }
    case "price": {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        throw new Error(`Invalid price value: ${value}`);
      }
      query[field] = { [operatorMap(operator)]: parsedValue.toString() }; // Store as string per schema
      break;
    }
    case "stock_quantity": {
      if (value === "null") {
        query[field] = { [operatorMap(operator)]: null };
      } else {
        const parsedValue = parseInt(value);
        if (isNaN(parsedValue)) {
          throw new Error(`Invalid stock_quantity value: ${value}`);
        }
        query[field] = { [operatorMap(operator)]: parsedValue };
      }
      break;
    }
    case "stock_status":
    case "category": {
      query[field] = { [operatorMap(operator)]: value };
      break;
    }
    case "tags": {
      query[field] =
        operator === "=" ? { $in: [value] } : { $in: value.split(",").map((v) => v.trim()) };
      break;
    }
    case "on_sale": {
      const boolValue = value.toLowerCase();
      if (boolValue !== "true" && boolValue !== "false") {
        throw new Error(`Invalid on_sale value: ${value}`);
      }
      query[field] = { [operatorMap(operator)]: boolValue === "true" };
      break;
    }
    case "title": {
      query[field] = operator === "=" ? value : { $regex: value, $options: "i" };
      break;
    }
    case "created_at": {
      if (isNaN(Date.parse(value))) {
        throw new Error(`Invalid created_at value: ${value}`);
      }
      query[field] = { [operatorMap(operator)]: value };
      break;
    }
    default:
      throw new Error(`Unhandled field: ${field}`);
  }

  return { field, query };
};

export const evaluateSegment = async (
  conditions: string[]
): Promise<ProductType[]> => {
  try {
    const errors: string[] = [];
    const queries: { field: string; query: any }[] = [];

    for (const condition of conditions) {
      try {
        const result = parseCondition(condition);
        queries.push(result);
      } catch (error: any) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Invalid conditions: ${errors.join("; ")}`);
    }

    if (queries.length === 0) {
      throw new Error("No valid conditions provided");
    }

    const query = queries.reduce(
      (acc, { query }) => ({ ...acc, ...query }),
      {}
    );
    const products = await Product.find(query, { _id: 0, __v: 0 }).lean();
    return products as ProductType[];
  } catch (error: any) {
    throw new Error(`Failed to evaluate segment: ${error.message}`);
  }
};