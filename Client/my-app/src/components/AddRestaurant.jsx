import React, { useState, useContext } from "react";
import RestaurantFinder from "../api/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";

const AddRestaurant = () => {
  const { addRestaurants } = useContext(RestaurantsContext);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("Price Range");

  const handleSubmit = async (event) => {

    // This is done so our page doesn't reload when the button is clicked.
    event.preventDefault();
    
    try {
      const response = await RestaurantFinder.post("/", {
        // When the name of key and value is same, just puting either of it will do.
        name,
        location,
        price_range: priceRange,
      });
      addRestaurants(response.data.data.restaurant);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-5 mb-4">
      <form action="">
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="name"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="location"
            />
          </div>
          <div className="col">
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option disabled>Price Range</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </select>
          </div>
          <div className="col">
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
