"use client";

import { useEffect } from "react";

export default function DetailLayout({ children }) {
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    if (isIOS) {
      const setProperty = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      };
      setProperty();
    }
  }, []);

  return <>{children}</>;
}
