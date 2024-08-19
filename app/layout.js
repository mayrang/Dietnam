import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Link from "next/link";
import BackButton from "../components/BackButton";
import Image from "next/image";

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
  const pathname = headersList.get("referer");
  const isMaking = pathname?.includes("making");
  const isDetail = pathname?.includes("detail");
  const isHome = !(isMaking || isMaking);

  return (
    <html lang="en">
      <head>
        <link
          href="https://wemap-project.github.io/WeMap-Web-SDK-Release/assets/css/wemap.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} relative w-screen h-screen overflow-x-hidden flex items-center justify-center flex-col`}
      >
        <nav className="relative border-b-2 border-black border-solid   z-9 flex items-center justify-between w-full px-2  max-w-md py-3   top-0 left-0 right-0 bg-white ">
          {isHome ? (
            <div className="flex items-center gap-2">
              <Image
                src={"/logo.png"}
                alt="dietnam logo image"
                className="rounded-md overflow-hidden"
                width={24}
                height={24}
              />
              <h1 className="font-extrabold text-xl ">Dietnam</h1>
            </div>
          ) : (
            <BackButton />
          )}
          {isMaking && <div className="font-bold text-xl">making route</div>}
          {isDetail && <div className="font-bold text-xl">route detail</div>}

          {(isMaking || isDetail) && <div className="w-8 h-8"></div>}
          {isHome && (
            <svg
              className="pt-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              class="main-grid-item-icon"
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
          )}
        </nav>
        <div className=" max-w-md w-full h-full relative ">{children}</div>
        {/* </Content>
        </Layout> */}
      </body>
    </html>
  );
}
