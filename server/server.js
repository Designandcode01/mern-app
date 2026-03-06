import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors()); // Allows frontend to connect from different port
app.use(express.json()); // Parses JSON request bodies

// A simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});