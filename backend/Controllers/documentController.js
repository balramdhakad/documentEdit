const Document = require("../Models/documentModel");
const DocumentVersion = require("../Models/versionModel");

const deleteDocument = async (req, res) => {
  try {
    // Only Owner can delete
    if (req.permission !== "Owner") {
      return res
        .status(403)
        .json({ message: "Only Owner can delete this document" });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error While delete document" });
  }
}

const getAllDocument = async (req, res) => {
  try {
    const userId = req.user._id;

    const documents = await Document.find({
      $or: [{ createdBy: userId }, { "sharedUsers.userId": userId }],
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error at read", Error: error?.message });
  }
}


const shareDocument = async (req, res) => {

    try {
    if (req.permission !== "Owner") {
      return res
        .status(403)
        .json({ message: "Only the owner can share this document" });
    }

    // sharedUsers = [{ userId: "id1", role: "Editor" }, { userId: "id2", role: "Viewer" }]
    const { sharedUsers } = req.body;

    if (!sharedUsers || !Array.isArray(sharedUsers)) {
      return res
        .status(400)
        .json({ message: "Please select to share with roles" });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // check if Already exist
    sharedUsers.forEach((newUser) => {
      const existingUserIndex = document.sharedUsers.findIndex(
        (u) => u.userId.toString() === newUser.userId
      );

      if (existingUserIndex > -1) {
        // Update role if user already exists
        document.sharedUsers[existingUserIndex].role = newUser.role;
      } else {
        // Add new user
        document.sharedUsers.push(newUser);
      }
    });

    await document.save();
    res
      .status(200)
      .json({
        message: "Document shared successfully",
        sharedUsers: document.sharedUsers,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Server error while share User",
        message: error?.message,
      });
  }
}

const getSingleDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.status(200).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error at Document" });
  }
}

const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;

    if(!title){
        return res.status(404).json({message : "Must Enter Title"})
    }

    const document = new Document({
      title,
      content,
      createdBy: req.user._id,
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while create document" ,Error : error?.message });
  }
}



//update 



const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // Save current state as a version
    await DocumentVersion.create({
      documentId: document._id,
      title: document.title,
      content: document.content,
      createdBy: req.user._id,
    });

    // Update document
    document.title = title;
    document.content = content;
    await document.save();

    res.status(200).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const documentControllers = {deleteDocument,shareDocument,getAllDocument,getSingleDocument,createDocument,updateDocument}

module.exports = documentControllers