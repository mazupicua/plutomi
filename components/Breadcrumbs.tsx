import { HomeIcon } from "@heroicons/react/solid";
import Link from "next/dist/client/link";
export default function Breadcrumbs({ crumbs }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/dashboard">
              <a className="text-light hover:text-normal transition ease-in-out duration-200">
                <HomeIcon
                  className="flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.name}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-5 w-5 text-light"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link href={crumb.href}>
                <a
                  className={`ml-4 text-md  text-normal hover:text-dark transition ease-in-out duration-200 ${
                    crumb.current ? "font-semibold" : "font-normal"
                  }`}
                >
                  {crumb.name}
                </a>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
