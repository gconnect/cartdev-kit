import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Greetings from "./pages/Greetings"
import WalletExamples from "./pages/Wallet"

const PageRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={  <Greetings/>}/>
            <Route path="/wallet" element={  <WalletExamples/>}/>
        </Routes>
    </Router>
  )
}

export default PageRoutes