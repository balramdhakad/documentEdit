const versionControllers = require("../Controllers/versionController");
const authMiddleware = require("../Middleware/authMiddleware");
const roleCheck = require("../Middleware/rolecheckmiddleware");

router.post(
  "/documents/:id/rollback/:versionId",
  authMiddleware,
  roleCheck("edit"),
  versionControllers.rollBack
);

router.get(
  "/documents/:id/versions",
  authMiddleware,
  roleCheck("edit"),
  versionControllers.getRollCommit
);

router.put(
  "/documents/:id/update",
  authMiddleware,
  roleCheck("edit"),
  versionControllers.updateDocument
);

module.exports = router;
