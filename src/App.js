import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./Pages/register";
import Summary from './Pages/summary'

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Register/>}/>
                    <Route exact path="/summary" element={<Summary/>}/>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
