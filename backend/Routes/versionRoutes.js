const express = require("express")
const versionControllers = require("../Controllers/versionController");
const authMiddleware = require("../Middleware/authMiddleware");
const roleCheck = require("../Middleware/rolecheckmiddleware");
const router = express.Router()

router.post(
  "/documents/:id/rollback/:versionId",
  authMiddleware,
  roleCheck("edit"),
  versionControllers.rollBack
);

router.get(
  "/documents/:id",
  authMiddleware,
  roleCheck("edit"),
  versionControllers.getRollCommit
);

// router.put(
//   "/documents/:id/update",
//   authMiddleware,
//   roleCheck("edit"),
//   versionControllers.updateDocument
// );

module.exports = router;
