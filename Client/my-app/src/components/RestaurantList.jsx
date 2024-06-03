import React, { useEffect, useContext } from "react";
import RestaurantFinder from "../api/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const RestaurantList = () => {

  // useContext is used here so we can store the restaurants that we get using useEffect.
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);

  // useNavigate() is part of "react-router-dom" that gets us the url.
  let history = useNavigate();

  // useEffect is used to get restaurants list from backend using axios.
  
  useEffect(() => {

    // we can't return anything in useEffect that's why to use await we have to create a function and call it instead of using async on the useEffect() directly.This is because async function returns a promise(await).
    const fetchData = async () => {
      try {
        // what this does is adds the part inside the get() to the baseURL.
        const response = await RestaurantFinder.get("/");

        setRestaurants(response.data.data.restaurant);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (e, id) => {
    // this is done so that on clicking on delete button it doesn't trigger the onClick event on <tr>.
    e.stopPropagation();

    try {
      await RestaurantFinder.delete(`/${id}`);
      setRestaurants(
        restaurants.filter((restaurant) => {
          return restaurant.id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e, id) => {
    // this is done so that on clicking on update button it doesn't trigger the onClick event on <tr>.
    e.stopPropagation();

    history(`/restaurants/${id}/update`);
  };

  const handleRestaurantSelect = (e, id) => {
    history(`/restaurants/${id}/detail`);
  };

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };

  return (
    <div className="mx-5">
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr
                  onClick={(e) => handleRestaurantSelect(e, restaurant.id)}
                  key={restaurant.id}
                >
                  <td> {restaurant.name} </td>
                  <td> {restaurant.location} </td>
                  <td> {"$".repeat(restaurant.price_range)} </td>
                  <td> {renderRating(restaurant)} </td>
                  <td>
                    <button
                      onClick={(e) => handleUpdate(e, restaurant.id)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={(e) => handleDelete(e, restaurant.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantList;
