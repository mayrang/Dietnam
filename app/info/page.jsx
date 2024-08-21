"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function InfoPage() {
  return (
    <div className="w-full h-[calc(100svh-92px)] flex flex-col items-center justify-center">
      <div className="flex flex-col flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            width={120}
            height={120}
            src="/hanbat-fimo.png"
            alt="hanbat univ. and fimo logo"
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
          transition={{ duration: 0.5 }}
        >
          <Image
            width={120}
            height={120}
            src="/logo.png"
            className="rounded-xl overflow-hidden transition-opacity"
            alt="Dietnam logo"
          />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="my-10"
      >
        <div className="font-medium text-2xl">Developed by Gil, Ha, Park</div>
        <div className="font-medium text-2xl">Powered by Wemap</div>
      </motion.div>
    </div>
  );
}
