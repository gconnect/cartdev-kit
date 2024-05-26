import Link from "next/link"

type FooterProps = {
  title: string,
  content?: string,
  contentItems?: string[]
}

const footerItems : FooterProps[] = [
  {
    title: "Supported Templates",
    contentItems: [
      "Reactjs & Nextjs",
      "Cartesify Reactjs & Nextjs",
      // "Javascript & Typescript"
    ]
  },
  // {
  //   title: "How to Use",
  //   contentItems: [
  //     "Documentation",
  //   ]
  // },
  {
    title: "Follow Us",
    contentItems: [
      "Twitter",
      "Linkedln",
      "Github"
    ]
  },

  {
    title: "Contribute",
    contentItems: [
      "Github",
      "Documentation"
    ]
  },
]


const FooterItems: React.FC = () => {
  return(
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:mx-16 lg:mx-36">
      {footerItems.map((item: FooterProps, index: any)=> 
        (<div className="mx-4" key={index}>
        <p className="font-bold lg:text-lg md:text-md text-sm">{item.title}</p>
        <ul>
          <li className="text-left">
          {item.contentItems?.map((item, index)=> (<p key={index}>{item}</p>))}
          </li>
        </ul>
      </div>))}
    </div>
  )
}

export default FooterItems