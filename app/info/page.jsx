"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Collaborator from "../../components/icons/Collaborator";

export default function InfoPage() {
  return (
    <div className="w-full h-[calc(100svh-54px)] flex flex-col items-center">
      <div className="flex flex-col flex-1 items-center justify-around">
        <motion.div
          className="flex items-center justify-center gap-4 "
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.0 }}
        >
          <Image
            width={90}
            height={90}
            src="/hanbat-logo.png"
            alt="hanbat univ. and fimo logo"
            className="ml-[60px]"
          />
          <Collaborator />
          <Image
            width={150}
            height={150}
            src="/fimo-logo.png"
            className="rounded-xl overflow-hidden transition-opacity -translate-x-4"
            alt="Dietnam logo"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="relative my-10 w-full h-fit"
        >
          <Image
            src={"/no-bg-logo.png"}
            alt="dietnam logo"
            width={250}
            height={250}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
          />
          <div className="absolute top-1/2 left-1/2 z-5  size-[250px]  bg-white opacity-70 -translate-x-1/2 -translate-y-1/2" />
          <Image
            src={"/dietnam-font.png"}
            alt="dietnam logo"
            width={300}
            height={300}
            className="absolute top-1/2 z-10 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3.5, delay: 2 }}
          className="my-10 w-full flex flex-col items-center justify-center text-center"
        >
          <div className="font-serif text-lg">Powered by Wemap</div>
          <div className="font-serif text-lg">Developed by Gil, Ha, Park</div>
        </motion.div>
      </div>
    </div>
  );
}
