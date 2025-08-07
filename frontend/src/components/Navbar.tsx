import { Link, useLocation } from "react-router";
import ThemeController from "./ThemeController";
import { useEffect, useRef } from "react";
const Navbar = () => {
  const navLinks = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  useEffect(() => {
    const tab = location.pathname.split("/")[1];
    const active = navLinks.current?.querySelector(
      `#${tab || "products"}`
    ) as HTMLDivElement | null;
    if (active) {
      active.classList.add("btn-active");
    }
    return () => {
      if (active) {
        active.classList.remove("btn-active");
      }
    };
  }, [location]);
  return (
    <>
      <div className="navbar outline outline-base-content/40 rounded-xl bg-base-100 justify-between shadow-md px-6 sticky top-8 z-50">
        <div className="flex">
          <div>
            <ThemeController />
          </div>
          <div className="divider divider-horizontal"></div>
          <a className="btn btn-ghost text-2xl font-bold tracking-wide">
            Product Filter Demo
          </a>
        </div>

        <div className="flex-none flex gap-2 items-center" ref={navLinks}>
          <Link to="/products">
            <div className="btn btn-outline btn-accent" id="products">
              Products
            </div>
          </Link>
          <Link to="/segment-editor">
            <div className="btn btn-outline btn-accent" id="segment-editor">
              Segment Editor
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
