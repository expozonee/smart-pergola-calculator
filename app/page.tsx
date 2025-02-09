import { CardWithForm } from "@/components/SizeForm";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { getPergolaTypes } from "@/utils/readExcelFile";

export default function Home() {
  const types = getPergolaTypes();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <main className="w-full py-10 flex flex-col lg:justify-evenly items-center">
        <section className="">
          <CardWithForm pergolaTypes={types} />
        </section>
        <section className="w-[350px] text-center mt-4 text-white flex lg:grid gap-1">
          <div className="flex-grow">
            <Image
              className="mx-auto"
              src={logo}
              alt="logo"
              priority
              width={100}
            />
          </div>
          <p className="flex-grow-[5]">
            כל הזכיות שמורות סמארט פרגולה {currentYear} &copy;
          </p>
        </section>
      </main>
    </>
  );
}
