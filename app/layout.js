import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Link from "next/link";
import BackButton from "../components/BackButton";
import Image from "next/image";
import RouteName from "../components/RouteName";
import cls from "classnames";
import Info from "../components/icons/Info";

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
  const isStat = pathname?.includes("stat");
  const isInfo = pathname?.includes("info");
  const isHome = !(isMaking || isDetail || isStat || isInfo);
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
            "relative   z-9 flex items-center justify-between w-screen px-2  max-w-md pt-2   top-0 left-0 right-0 bg-white ",
            { "border-solid border-gray-50 border-b-2  pb-2": !isHome },
          ])}
        >
          {isHome ? (
            <Link href="/" className="pl-3.5 flex items-center gap-1">
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
          {isStat && <div className="font-bold text-xl">Stat</div>}
          {isInfo && <div className="font-bold text-xl">Information</div>}
          {isDetail && <RouteName />}

          {(isMaking || isDetail || isStat || isInfo) && (
            <div className="w-8 h-8"></div>
          )}
          {isHome && (
            <a href="/info" className="pt-3 pr-6">
              <Info />
            </a>
          )}
        </nav>
        <div className="max-w-md w-screen flex-1 h-full relative rounded-xl overflow-hidden shadow-2xl">
          {children}
        </div>
        {/* </Content>
        </Layout> */}
      </body>
    </html>
  );
}
