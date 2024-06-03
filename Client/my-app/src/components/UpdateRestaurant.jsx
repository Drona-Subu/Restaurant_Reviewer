import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RestaurantFinder from "../api/RestaurantFinder";

const UpdateRestaurant = () => {
  // This is to get id parameter from the url.
  const { id } = useParams();

  // We get forward and back functionality with useNavigate().
  let history = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("Price Range");

  /*  We didn't use useContext to fetch a particular restaurant detail because
   suppose if we go directly to update page(/restaurants/:id/update) without 
   going to home page first , the form won't show any detail of a restaurant 
   because the useContext gets it data when the Home Page is loaded. 
   We solve this by using useEffect to fetch data of a particular restaurant 
   from backend itself. */

  useEffect(() => {
    const fetchData = async () => {
      const response = await RestaurantFinder.get(`/${id}`);

      setName(response.data.data.restaurant.name);
      setLocation(response.data.data.restaurant.location);
      setPriceRange(response.data.data.restaurant.price_range);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await RestaurantFinder.put(`/${id}`, {
      name,
      location,
      price_range: priceRange,
    });

    // This is used to go back to Home Page.
    history("/");
  };

  return (
    <div>
      <form action="">
        <div className="form-group py-2 px-5">
          <label htmlFor="name">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group py-2 px-5">
          <label htmlFor="location">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            id="location"
            className="form-control"
            type="text"
          />
        </div>
        <div className=" form-group py-2 px-5">
          <label htmlFor="priceRange">Price Range</label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            id="priceRange"
            className="form-control"
          >
            <option disabled> Price Range</option>
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
            <option value="4">$$$$</option>
          </select>
        </div>
        <div className="px-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRestaurant;
