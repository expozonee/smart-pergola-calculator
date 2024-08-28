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
        <section className="">
          <CardWithForm pergolaTypes={types} />
        </section>
      </main>
      <section className="mt-16 bottom-8 text-white grid gap-3 fixed inset-x-1/2 min-w-[300px] translate-x-2/4">
        <Image className="mx-auto" src={logo} alt="logo" priority width={100} />
        <p>כל הזכיות שמורות סמארט פרגולה {currentYear} &copy;</p>
      </section>
    </>
  );
}
