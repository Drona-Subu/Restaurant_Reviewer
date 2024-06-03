import express from "express";
import env from "dotenv";
import morgan from "morgan";
import db from "./db/index.js";
import cors from "cors";

const app = express();
env.config();

// cors allows controlled sharing of resources (such as data or assets) between different origins (domains, schemes, or ports).
// since we are using two different ports for server and client side.
app.use(cors());

app.use(express.json());
app.use(morgan("tiny"));

// Get all restaurants and reviews for all of each restaurant.
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const restaurantRatingData = await db.query(
      "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id,COUNT(*),TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id=reviews.restaurant_id;"
    );

    res.json({
      status: "success",
      results: restaurantRatingData.rows.length,
      data: {
        restaurant: restaurantRatingData.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Get a particular restaurant and reviews for a restaurant.
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurants = await db.query(
      "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id,COUNT(*),TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON  restaurants.id=reviews.restaurant_id WHERE id=$1;",
      [req.params.id]
    );
    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [req.params.id]
    );
    res.json({
      status: "success",
      data: {
        restaurant: restaurants.rows[0],
        review: reviews.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Create a restaurant.
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurants(name,location,price_range) VALUES ($1,$2,$3) RETURNING *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    res.json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Create a review.
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id,name,review,rating) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );

    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Update a restaurant.
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range=$3 WHERE id= $4 RETURNING *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    res.json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id]);
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
