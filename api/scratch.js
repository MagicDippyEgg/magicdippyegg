export default async function handler(req, res) {
  const response = await fetch("https://api.scratch.mit.edu/users/magicdippyegg");

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to fetch Scratch data" });
  }

  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*"); // optional CORS header if needed
  res.status(200).json(data);
}
