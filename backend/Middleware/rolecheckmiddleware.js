
const Document = require("../Models/documentModel");

const roleCheck = (action) => {
  return async (req, res, next) => {
    try {
      const docId = req.params.id;
      const userId = req.user._id;

      const document = await Document.findById(docId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Owner has all permissions
      if (document.createdBy.toString() === userId.toString()) {
        req.permission = "Owner";
        return next();
      }


      const sharedUser = document.sharedUsers.find(
        (u) => u.userId.toString() === userId.toString()
      );

      if (!sharedUser) {
        return res.status(403).json({ message: "You do not have access to this document" });
      }


      if (action === "edit" && sharedUser.role !== "Editor") {
        return res.status(403).json({ message: "You do not have edit permission" });
      }

      req.permission = sharedUser.role;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error at role check" ,Error : error?.message });
    }
  };
};

module.exports = roleCheck;
