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
): { field: string; query: any } | null => {
  const trimmed = condition.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\w+)\s*(=|>|<|>=|<=|!=)\s*(.+)$/);
  if (!match) {
    console.warn(`Invalid condition: ${trimmed}`);
    return null;
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
    "created_at",
  ];
  if (!validFields.includes(field)) {
    console.warn(`Invalid field: ${field}`);
    return null;
  }

  const query: any = {};
  if (field === "id") {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
      console.warn(`Invalid id value: ${value}`);
      return null;
    }
    query[field] = { [operatorMap(operator)]: parsedValue };
  } else if (field === "price") {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      console.warn(`Invalid price value: ${value}`);
      return null;
    }
    query[field] = { [operatorMap(operator)]: parsedValue.toString() }; // Store as string per schema
  } else if (field === "stock_quantity") {
    if (value === "null") {
      query[field] = { [operatorMap(operator)]: null };
    } else {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue)) {
        console.warn(`Invalid stock_quantity value: ${value}`);
        return null;
      }
      query[field] = { [operatorMap(operator)]: parsedValue };
    }
  } else if (field === "stock_status" || field === "category") {
    query[field] = { [operatorMap(operator)]: value };
  } else if (field === "tags") {
    query[field] =
      operator === "=" ? { $in: [value] } : { $in: value.split(",") };
  } else if (field === "on_sale") {
    const boolValue = value.toLowerCase() === "true";
    if (value.toLowerCase() !== "true" && value.toLowerCase() !== "false") {
      console.warn(`Invalid on_sale value: ${value}`);
      return null;
    }
    query[field] = { [operatorMap(operator)]: boolValue };
  } else if (field === "title") {
    query[field] = operator === "=" ? value : { $regex: value, $options: "i" };
  } else if (field === "created_at") {
    query[field] = { [operatorMap(operator)]: value };
  }

  return { field, query };
};

export const evaluateSegment = async (
  conditions: string[]
): Promise<ProductType[]> => {
  try {
    const queries = conditions
      .map(parseCondition)
      .filter((q): q is { field: string; query: any } => q !== null);

    if (queries.length === 0) {
      throw new Error("No valid conditions provided");
    }

    const query = queries.reduce(
      (acc, { query }) => ({ ...acc, ...query }),
      {}
    );

    const products = await Product.find(query).lean();
    return products as ProductType[];
  } catch (error: any) {
    console.error("Error evaluating segment:", error.message);
    throw new Error(`Failed to evaluate segment: ${error.message}`);
  }
};
