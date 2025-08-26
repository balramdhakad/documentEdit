const Document = require("../Models/documentModel");
const DocumentVersion = require("../Models/versionModel");


const rollBack = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    const version = await DocumentVersion.findById(req.params.versionId);

    if (!document || !version)
      return res.status(404).json({ message: "Document or version not found" });

    if (
      req.permission !== "Owner" ||
      req.user._id.toString() !== version.createdBy.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Access Denied You are not Creator of this Version" });
    }

    await DocumentVersion.create({
      documentId: document._id,
      title: document.title,
      content: document.content,
      createdBy: req.user._id,
    });

    // Rollback document to selected version
    document.title = version.title;
    document.content = version.content;
    await document.save();

    res
      .status(200)
      .json({ message: "Document rolled back successfully", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error at rolling back" });
  }
};

const getRollCommit = async (req, res) => {
  try {
    if (req.permission === "Owner") {
      const versions = await DocumentVersion.find({
        documentId: req.params.id,
      }).sort({ createdAt: -1 });
      res.status(200).json(versions);
    }

    const versions = await DocumentVersion.find({
      documentId: req.params.id,
      updatedBy: req.user_id,
    }).sort({ createdAt: -1 });

    res.status(200).json(versions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error While Version Read List",
      Error: error?.message,
    });
  }
};

const versionControllers = { updateDocument, rollBack, getRollCommit };

module.exports = versionControllers;
