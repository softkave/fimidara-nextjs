import Link from "next/link";
import endpointsToC from "./endpoints-toc.json";
import { TOCSection } from "./types";

export interface ITableOfContentsProps {
  toc: Array<TOCSection>;
}

export function TableOfContents({ toc }: ITableOfContentsProps) {
  const items = toc.filter(
    (item) =>
      item.id &&
      (item.level === 2 || item.level === 3) &&
      item.title !== "Next steps"
  );

  if (!Array.isArray(endpointsToC)) {
    return null;
  }

  return (
    <nav className="toc">
      {endpointsToC.length > 1 ? (
        <ul className="flex column">
          {endpointsToC.map((item) => {
            const href = `#${item}`;
            const active =
              typeof window !== "undefined" && window.location.hash === href;
            return (
              <li
                key={item}
                className={[
                  active ? "active" : undefined,
                  // item.level === 3 ? "padded" : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Link href={href} passHref>
                  <a>{item}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
      <style jsx>
        {`
          nav {
            position: sticky;
            top: calc(2.5rem + var(--nav-height));
            max-height: calc(100vh - var(--nav-height));
            flex: 0 0 240px;
            /* https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox */
            align-self: flex-start;
            margin-bottom: 1rem;
            padding: 0.25rem 0 0;
            border-left: 1px solid var(--toc-border);
          }
          ul {
            margin: 0;
            padding: 0;
          }
          li {
            list-style-type: none;
            margin: 0 0 1rem 1.5rem;
            font-size: 14px;
            font-weight: 400;
          }
          li a {
            text-decoration: none;
          }
          li a:hover,
          li.active a {
            text-decoration: underline;
          }
          li.padded {
            padding-left: 1rem;
          }
          @media screen and (max-width: 1000px) {
            nav {
              display: none;
            }
          }
        `}
      </style>
    </nav>
  );
}
