import Link from "next/link"
import FooterItems from "./FooterItems"
import devkit from "../../public/images/devkit-logo.png";
import Image from "next/image";

const Footer: React.FC = () => {
  return(
    <div className="flex flex-col lg:flex-row bg-dark-blue text-slate-400 p-2 lg:p-16 md:p-8">
      <div className="w-full lg:w-auto mb-4 lg:mb-0 text-center lg:text-left lg:mr-4">
      <Image className="mb-4 mx-auto lg:mx-0" src={devkit} width={80} height={50} alt="logo" />
        <span className="">This template was built with 💟 for the Cartesi community by: 
        <Link className="text-custom-purple mouse ml-2" href={"https://africinnovate.com"}>
            Africinnovate Team
        </Link>
        </span>
      </div>
      <FooterItems/>
    </div>
  )
}

export default Footer