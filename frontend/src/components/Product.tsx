import type { ProductProps } from "../types";

const Product = (product: ProductProps) => {
  return (
    <>
      <div className=" bg-base-100 outline rounded-xl min-w-96">
        <div className="">
          <div className="flex justify-between">
            {product.stock_status === "instock" ? (
              <div className="flex items-center gap-2 p-4">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span className="text-success">Available</span>
                {product.stock_quantity && (
                  <span className="text-content font-semibold badge badge-success">
                    {product.stock_quantity}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                <span className="text-error">Out of Stock</span>
              </div>
            )}
            {product.on_sale && (
              <div className="bg-success text-success-content font-bold rounded-xl rounded-tl-none rounded-br-none ml-2 h-12 w-36 flex gap-2 items-center justify-center">
                <span className="material-symbols-outlined">loyalty</span>
                <p>On Sale</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start pl-4">
            {product.title && (
              <p className="text-2xl font-semibold text-left">
                {product.title}
              </p>
            )}
            {product.category && (
              <p className="text-xl text-base-content/70 font-semibold text-left">
                {product.category}
              </p>
            )}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2  flex flex-wrap gap-2">
                {product.tags.map((tag, index) => {
                  return (
                    tag && (
                      <span
                        key={index}
                        className="badge badge-outline badge-sm text-base-content/70 p-3"
                      >
                        {tag}
                      </span>
                    )
                  );
                })}
              </div>
            )}
          </div>

          <div className=" mt-8 flex items-stretch justify-between p-4">
            <div className="mr-2 outline text-xl flex items-center justify-center rounded-2xl w-32">
              ${product.price || "0.00"}
            </div>

            <button className="btn btn-secondary rounded-xl flex-1">
              <span className="material-symbols-outlined">
                shopping_bag_speed
              </span>{" "}
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
