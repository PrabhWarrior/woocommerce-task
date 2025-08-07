import { useState } from "react";
import JsonViewer from "../components/JsonViewer";
import Product from "../components/Product";
import { segmentService } from "../utils/axios";
import type { ProductProps } from "../types";
const SegmentEditor = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);

  const Evaluate = async () => {
    try {
      const response = await segmentService.post("/segments/evaluate", {
        segment: query,
      });
      setProducts(response.data);
      console.log("Evaluation Response:", response.data);
    } catch (error: any) {
      setProducts([]);
      setToast({
        message:
          error?.response?.data?.error ||
          error?.message ||
          "An error occurred during evaluation.",
        type: "error",
      });
      setTimeout(() => setToast(null), 2000);
      console.error("Evaluation Error:", error);
    }
  };

  return (
    <>
      {toast && (
        <div className="toast">
          <div className={`alert alert-error`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      <div className="p-4 rounded-xl flex justify-between mt-10">
        <h1 className="text-5xl font-bold">Segment Editor</h1>
      </div>
      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          Evaluate();
        }}
      >
        <fieldset className="fieldset ">
          <legend className="fieldset-legend w-full  flex justify-between">
            <p>
              Enter Filter Rules {"("}One Per Line{")"} :
            </p>
            <div className="flex items-center space-x-2">
              <span>Supported Operators (Click to Insert) :</span>
              {["=", "!=", ">", "<", ">=", "<="].map((op) => (
                <div
                  key={op}
                  className="badge badge-outline hover:badge-primary px-2 py-1 text-sm cursor-pointer"
                  onClick={() => setQuery((prev: any) => `${prev} ${op} `)}
                >
                  {op}
                </div>
              ))}
            </div>
          </legend>
          <textarea
            className="textarea h-40 w-full"
            placeholder={
              "Example: \nprice > 1000 \ncategory = Electronics \nstock_status = instock"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
        </fieldset>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-success btn-outline flex-2">
            <span className="material-symbols-outlined">filter_alt</span>
            {"Evaluate"}
          </button>
          <button
            className="btn btn-error btn-outline flex-1"
            onClick={(e) => {
              e.preventDefault();
              setQuery("");
            }}
          >
            <span className="material-symbols-outlined">reset_wrench</span>{" "}
            Reset
          </button>
        </div>
      </form>

      <div className="divider"></div>
      <h1 className="text-4xl font-bold">Results</h1>

      <div className="result flex gap-2 outline rounded-xl py-4 mt-4">
        <div className="flex-1 max-h-screen overflow-y-scroll text-left px-2">
          <h1 className="text-2xl font-bold mb-4 sticky top-0 bg-base-100 p-2 z-10 text-center">
            JSON View
          </h1>

          <JsonViewer jsonData={JSON.parse(JSON.stringify({ products }))} />
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="flex-1 max-h-screen overflow-y-scroll text-left ">
          <h1 className="text-2xl font-bold mb-4 sticky top-0 bg-base-100 p-2 z-10 text-center">
            UI View
          </h1>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(25em,1fr))] mt-5 flex-1 mx-2">
            {products.length === 0 && (
              <div className="col-span-full text-center text-xl font-semibold">
                No Products Found Matching The Current Filter
              </div>
            )}
            {products.map((product) => (
              <Product key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SegmentEditor;
