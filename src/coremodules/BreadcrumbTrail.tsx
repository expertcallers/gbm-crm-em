import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronForwardSharp, IoHomeOutline } from "react-icons/io5";
import Tag from "./Tag";

type Props = {
  extras?: string;
};

const BreadcrumbTrail: React.FC<Props> = React.memo(({ extras = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = useMemo(
    () =>
      `${location.pathname}${extras}`.split("/").filter((p) => p.length > 0),
    [location, extras]
  );

  const { base, routes } = useMemo(() => {
    const [base, module, ...routes] = path;

    const prepare = (current: string, i: number, routes: string[]) => {
      const paths = routes.slice(0, i);
      return `/${module}${paths.length > 0 ? "/" : ""}${paths.join(
        "/"
      )}/${current}`;
    };

    const result = {
      base: base,
      routes: [...routes.flatMap(prepare)],
    };

    if (module) result.routes.unshift(`/${module}`);

    return result;
  }, [extras, path]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => navigate(`/${base}`)}>
        <IoHomeOutline className="text-primary" size={24} />
      </button>
      {routes.map((route) => (
        <Route
          key={`${base}${route}`}
          route={route}
          base={base}
          disabled={`${base}${route}` === path.join("/")}
        />
      ))}
    </div>
  );
});

const Route: React.FC<{ route: string; base: string; disabled?: boolean }> = ({
  route,
  base,
  disabled,
}) => {
  const navigate = useNavigate();

  const tag = useMemo(() => {
    const routes = route.split("/");
    return routes[routes.length - 1].replaceAll("-", " ");
  }, [route, base]);

  return (
    <>
      <IoChevronForwardSharp className="text-gray-light" size={12} />
      <button
        type="button"
        onClick={() => navigate(`/${base}${route}`)}
        disabled={disabled}
      >
        <Tag
          value={tag}
          backgroundColor="bg-primary-background"
          color="text-primary"
        />
      </button>
    </>
  );
};

export default BreadcrumbTrail;
