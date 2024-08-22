"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function InfoPage() {
  return (
    <div className="w-full h-[calc(100svh-92px)] flex flex-col items-center justify-center">
      <div className="flex flex-col flex-1 items-center justify-center">
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, scale: 0}}
          animate={{ opacity: 1, scale: 1.5 }}
          transition={{ duration: 2.0 }}
        >
          <Image
            width={120}
            height={120}
            src="/hanbat-fimo.png"
            alt="hanbat univ. and fimo logo"
          />
          <Image
            width={120}
            height={120}
            src="/logo.png"
            className="rounded-xl overflow-hidden transition-opacity"
            alt="Dietnam logo"
          />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="font-extrabold text-5xl my-10"
        >
          Dietnam
        </motion.h2>

        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="my-10 absolute bottom-0 -translate-x-1/2 left-1/2"
      >
        <div className="font-serif text-lg">Powered by Wemap</div>
        <div className="font-serif text-lg">Developed by Gil, Ha, Park</div>
      </motion.div>

      </div>
    </div>
  );
}
