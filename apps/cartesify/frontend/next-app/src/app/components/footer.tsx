import Link from "next/link"

const Footer: React.FC = () => {
  return(
    <div className="p-8 bg-black text-white">
      <span className="">This template was built with 💟 for the Cartesi community by: 
      <Link className="text-cyan-500 mouse ml-2" href={"https://github.com/gconnect"}>
         gconnect
      </Link>
      </span>
    </div>
  )
}

export default Footer