import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./routes/Home";
import UpdatePage from "./routes/UpdatePage";
import RestaurantDetail from "./routes/RestaurantDetail";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";

const App = () => {
  return (
    <RestaurantsContextProvider>
      <Router>
         <Routes> 
          <Route exact path="/" Component={Home} />
          <Route exact path="/restaurants/:id/update" Component={UpdatePage} />
          <Route exact path="/restaurants/:id/detail" Component={RestaurantDetail} />
         </Routes> 
      </Router>
    </RestaurantsContextProvider>
  );
};

export default App;
