import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Link from "next/link";
import BackButton from "../components/BackButton";
import Image from "next/image";
import RouteName from "../components/RouteName";
import cls from "classnames";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dietnam",
  description: "Find walking and running routes in Vietnam",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  const headersList = headers();
  const pathname = headersList.get("x-next-pathname");
  const isMaking = pathname?.includes("making");
  const isDetail = pathname?.includes("detail");
  const isHome = !(isMaking || isDetail);
  console.log("isHome", isHome, isDetail, isMaking, pathname);

  return (
    <html lang="en">
      <head>
        <link
          href="https://wemap-project.github.io/WeMap-Web-SDK-Release/assets/css/wemap.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} relative h-[100svh]  overflow-x-hidden flex items-center justify-center flex-col`}
      >
        <nav
          className={cls([
            "relative   z-9 flex items-center justify-between w-screen px-2  max-w-md pt-3   top-0 left-0 right-0 bg-white ",
            { "border-b-2 border-solid": !isHome },
          ])}
        >
          {isHome ? (
            <Link href="/" className="pl-3.5 flex items-center gap-1 pt-5">
              <Image
                src={"/no-bg-logo.png"}
                alt="dietnam logo image"
                className="rounded-md overflow-hidden"
                width={80}
                height={80}
              />
              <h1 className="font-extrabold text-3xl pt-3 ">Dietnam</h1>
            </Link>
          ) : (
            <BackButton />
          )}
          {isMaking && <div className="font-bold text-xl">Making Route</div>}
          {isDetail && <RouteName />}

          {(isMaking || isDetail) && <div className="w-8 h-8"></div>}
          {isHome && (
            <Link href="/info" className="pt-8" >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </Link>
          )}
        </nav>
        <div className=" max-w-md w-screen flex-1 h-full relative ">
          {children}
        </div>
        {/* </Content>
        </Layout> */}
      </body>
    </html>
  );
}
