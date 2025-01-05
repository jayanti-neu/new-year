const express = require("express");

const router = express.Router();

// Mock data
let gifts = [
  { id: 1, name: "Toy Car", description: "A small toy car" },
  { id: 2, name: "Doll", description: "A beautiful doll" },
];

// GET /registry: Render the registry page with gifts
router.get("/registry", (req, res) => {
    res.render("registry", { gifts });
});

// GET /api/gifts: Get all gifts
router.get("/api/gifts", (req, res) => {
  res.json(gifts);
});

// GET /api/gifts/:id: Get a specific gift by ID
router.get("/api/gifts/:id", (req, res) => {
  const gift = gifts.find((g) => g.id === parseInt(req.params.id));
  if (!gift) return res.status(404).send("Gift not found");
  res.json(gift);
});

// POST /api/gifts: Add a new gift
router.post("/api/gifts", (req, res) => {
  const newGift = {
    id: gifts.length + 1,
    name: req.body.name,
    description: req.body.description,
  };
  gifts.push(newGift);
  res.status(201).json(newGift);
});

// PUT /api/gifts/:id: Update an existing gift by ID
router.put("/api/gifts/:id", (req, res) => {
  const gift = gifts.find((g) => g.id === parseInt(req.params.id));
  if (!gift) return res.status(404).send("Gift not found");

  gift.name = req.body.name;
  gift.description = req.body.description;
  res.json(gift);
});

// DELETE /api/gifts/:id: Delete a gift by ID
router.delete("/api/gifts/:id", (req, res) => {
  const giftIndex = gifts.findIndex((g) => g.id === parseInt(req.params.id));
  if (giftIndex === -1) return res.status(404).send("Gift not found");

  const deletedGift = gifts.splice(giftIndex, 1);
  res.json(deletedGift);
});

module.exports = router;
