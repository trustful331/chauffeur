import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_TITLES, SITE } from "src/config/site";

function metaDescriptionEl() {
  let el = document.querySelector('meta[name="description"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "description");
    document.head.appendChild(el);
  }
  return el;
}

/** Sets document title + meta description from the route map. */
export function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const exact = PAGE_TITLES[pathname];
    const fleetDetail = pathname.startsWith("/fleet/")
      ? {
          title: `Fleet Details | ${SITE.brand}`,
          description: PAGE_TITLES["/fleet"].description,
        }
      : null;
    const entry = exact || fleetDetail || {
      title: `${SITE.brand} | Luxury Chauffeur Saudi Arabia`,
      description: PAGE_TITLES["/"].description,
    };

    document.title = entry.title;
    metaDescriptionEl().setAttribute("content", entry.description);
  }, [pathname]);

  return null;
}
