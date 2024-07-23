import FooterItems from "./FooterItems"
import devkit from "../assets/CartDevKit.png";

const Footer: React.FC = () => {
  return(
    <div className="flex flex-col lg:flex-row bg-dark-blue text-slate-400 p-2 lg:p-16 md:p-8">
      <div className="w-full lg:w-auto mb-4 lg:mb-0 text-center lg:text-left lg:mr-4">
      <img className="mb-4 mx-auto lg:mx-0" src={devkit} width={100} height={80} alt="logo" />
        <span className="">This template was built with 💟 for the Cartesi community by: 
        <a className="text-custom-purple mouse ml-2" href={"https://africinnovate.com"}>
            Africinnovate Team
        </a>
        </span>
      </div>
      <FooterItems/>
    </div>
  )
}

export default Footer