const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require('cors');

const serviceAccount = require("./firebase.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'rena-pushnoti'
});

const tokens = [];

const app = new express();

const router = express.Router();

app.use(bodyParser.json());
app.use(cors({ origin: "*", }));
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use("/", router);

app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});

router.get('/', (req, res) => {
  res.json({ message: "This is a NodeJS Push Notification"});
});

router.post("/register", (req, res) => {
  try {
    tokens.push(req.body.token);
    console.log("tokens", tokens);
    res.status(200).json({ message: "Successfully registerted FCM token!" });
  } catch (err) {
    console.error("Error registering token:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/approval", async (req, res) => {
  const message = {
    token: tokens[0],
    notification: {
      body: 'You have a transaction to approve',
      title: 'Approval'
    },
    data: {
      screen: 'Approval Screen'
    }
  };
  await admin.messaging().send(message).then(response => {
    console.log('Successfully sent approval message:', response);
    res.status(200).json({ message: "Successfully sent approval notifications!" });
  })
  .catch (error => {
    console.log('Error sending message:', error);
    res.status(500).json({ message: "Internal server error!" });
  })
});