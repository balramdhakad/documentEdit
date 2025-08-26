const express = require("express");

const roleCheck = require("../Middleware/rolecheckmiddleware");
const authMiddleware = require("../Middleware/authMiddleware");
const documentControllers = require("../Controllers/documentController");

const router = express.Router();

router.post("/documents", authMiddleware, documentControllers.createDocument);

router.get("/documents", authMiddleware, documentControllers.getAllDocument);

router.get(
  "/documents/:id",
  authMiddleware,
  roleCheck("read"),
  documentControllers.getSingleDocument
);

router.put(
  "/document/:id",
  authMiddleware,
  roleCheck("edit"),
  documentControllers.updateDocument
);

router.delete(
  "/documents/:id",
  authMiddleware,
  roleCheck("edit"),
  documentControllers.deleteDocument
);

// Share a document by Owner
router.put(
  "/documents/:id/share",
  authMiddleware,
  roleCheck("share"),
  documentControllers.shareDocument
);

module.exports = router;
