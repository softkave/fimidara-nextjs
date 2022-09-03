import { Menu } from "antd";
import { useRouter } from "next/router";
import { docsNavItems } from "./navItems";

export function SideNav() {
  const router = useRouter();
  return <Menu items={docsNavItems} defaultSelectedKeys={[router.pathname]} />;
  // return (
  //   <nav className="sidenav">
  //     {docsNavItems.map((item) => (
  //       <div key={item.key}>
  //         <span>{item.label}</span>
  //         <ul className="flex column">
  //           {item.links.map((link) => {
  //             const active = router.pathname === link.href;
  //             return (
  //               <li key={link.href} className={active ? "active" : ""}>
  //                 <Link {...link}>
  //                   <a href={link.href}>{link.children}</a>
  //                 </Link>
  //               </li>
  //             );
  //           })}
  //         </ul>
  //       </div>
  //     ))}
  //     <style jsx>
  //       {`
  //         nav {
  //           position: sticky;
  //           top: var(--top-nav-height);
  //           height: calc(100vh - var(--top-nav-height));
  //           flex: 0 0 auto;
  //           overflow-y: auto;
  //           padding: 16px;
  //           border-right: 1px solid var(--border-color);
  //         }
  //         span {
  //           font-size: larger;
  //           font-weight: 500;
  //           padding: 0.5rem 0 0.5rem;
  //         }
  //         ul {
  //           padding: 0;
  //         }
  //         li {
  //           list-style: none;
  //           margin: 0;
  //         }
  //         li a {
  //           text-decoration: none;
  //         }
  //         li a:hover,
  //         li.active > a {
  //           text-decoration: underline;
  //         }
  //       `}
  //     </style>
  //   </nav>
  // );
}
