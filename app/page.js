import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/making">route 만들기</Link>
      <Link href="/list">route 리스트</Link>
    </div>
  );
}
