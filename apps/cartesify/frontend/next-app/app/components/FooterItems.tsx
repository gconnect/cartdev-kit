import Link from "next/link"
interface IContent {
  title: string
  link: string
}
interface IFooter {
  title: string,
  content?: string,
  contentItems?: IContent[]
}

const footerItems : IFooter[] = [
  {
    title: "Cartesi",
    contentItems: [
      {
        title: "Cartesi Doc",
        link: "https://docs.cartesi.io/cartesi-rollups/1.3/"
      },
      {
        title: "Cartesi Discord",
        link: "https://discord.com/invite/cartesi"
      },

    ]
  },
  {
    title: "Follow Us",
    contentItems: [
      {
        title:  "Twitter",
        link: "https://twitter.com/africinnovate"
      },
      {
        title:  "Linkedln",
        link: "https://www.linkedin.com/company/africinnovate"
      },
    ]
  },
  {
    title: "Resources",
    contentItems: [
      {
        title: "Github",
        link: "https://github.com/gconnect/cartdev-kit"
      },
      {
        title: "Youtube",
        link: "https://www.youtube.com/playlist?list=PLvrAcVH0nwP8EyBrIwdL5wC6PZwPy6vXE"
      },
      {
        title: "Documentation",
        link: "https://africlab.gitbook.io/cartdevkit"
      }, 
    ]
  },
]


const FooterItems: React.FC = () => {
  return(
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:mx-16 lg:mx-36">
      {footerItems.map((item: IFooter, index: number)=> 
        (<div className="mx-4" key={index}>
        <p className="font-bold lg:text-lg md:text-md text-sm">{item.title}</p>
        <ul>
          <li className="text-left">
          {item.contentItems?.map((item, index)=> (
            <Link key={index} className="hover:text-purple-500" href={item.link}>
            <p>{item.title}</p>
          </Link>))}
          </li>
        </ul>
      </div>))}
    </div>
  )
}

export default FooterItems