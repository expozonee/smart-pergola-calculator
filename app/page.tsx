import { CardWithForm } from "@/components/SizeForm";
import Image from "next/image";
import LogoWhite from "@/public/Smart Pergola logo white.png";
import logo from "@/public/logo.svg";
import { getPergolaTypes } from "@/utils/readExcelFile";

export default function Home() {
  const types = getPergolaTypes();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <main className="w-full py-10 flex flex-col justify-center items-center">
        <div className="">
          <CardWithForm pergolaTypes={types} />
        </div>
        <div className="mt-16 bottom-8 text-white grid gap-3">
          <Image
            className="mx-auto"
            src={logo}
            alt="logo"
            priority
            width={160}
          />
          <p>כל הזכיות שמורות סמארט פרגולה {currentYear} &copy;</p>
        </div>
      </main>
    </>
  );
}
