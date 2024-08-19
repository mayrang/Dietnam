"use client";
import Link from "next/link";

export default function Home() {
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

  return (
    <div>
      <Link href="/making">route 만들기</Link>
      <Link href="/list">route 리스트</Link>
    </div>
  );
}
