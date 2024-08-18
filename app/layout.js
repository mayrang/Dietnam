import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dietnam",
  description: "Find walking and running routes in Vietnam",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://wemap-project.github.io/WeMap-Web-SDK-Release/assets/css/wemap.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} w-screen h-screen overflow-x-hidden flex items-center justify-center`}
      >
        <div className=" max-w-md w-full h-full relative ">{children}</div>
        {/* </Content>
        </Layout> */}
      </body>
    </html>
  );
}
