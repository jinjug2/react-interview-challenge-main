import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";

/* resolve the path of the .env file since it is in the very root dir
of this challenge. The reasoning is that .env was not move is to maintain structure
of the files in this challenge
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: envPath });

const { Pool } = pkg;
const pool = new Pool({
  user: `${process.env.POSTGRES_USER}`,
  host: "localhost",
  database: `${process.env.POSTGRES_DB}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  port: "5432",
});

const app = express();
const PORT = 3001;

// temporary; to prevent CORS blocking by the browser
app.use(cors());
app.use(bodyParser.json());

// app.get("/", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("Select * FROM accounts");
//     res.json(result.rows);
//     client.release();
//   } catch (err) {
//     console.error("Error in executing query", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/api/accounts/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM ACCOUNTS WHERE ACCOUNT_NUMBER = $1",
      [req.params.id]
    );
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error("Error during account retrieval", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/updateBalance", async (req, res) => {
  try {
    const { account_number, amount } = req.body;

    const client = await pool.connect();
    await client.query(
      "UPDATE ACCOUNTS SET AMOUNT = $1 WHERE ACCOUNT_NUMBER = $2",
      [amount, account_number]
    );
    res.json(req.body);
    client.release();
  } catch (err) {
    console.error("Error during update operation", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
