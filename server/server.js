// ===== Imports =====
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ===== MongoDB Connect =====
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_attendance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("✅ MongoDB connected");

// ===== Multer Config =====
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ===== OpenAI Config =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== Schemas =====
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  passwordHash: String,
});

userSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await bcrypt.hash(pw, 10);
};
userSchema.methods.verifyPassword = function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  progress: { type: Number, default: 0 },
});
const Task = mongoose.model("Task", taskSchema);

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  status: { type: String, enum: ["present", "absent", "pending"], default: "pending" },
  source: { type: String, enum: ["ai", "hr"], default: "ai" },
  aiDecision: String,
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

// ===== Middleware Auth =====
function auth(requiredRole = null) {
  return (req, res, next) => {
    try {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "No token" });
      const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
      if (requiredRole && payload.role !== requiredRole)
        return res.status(403).json({ message: "Forbidden" });
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

// ===== Auth Routes =====
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, role });
    await user.setPassword(password);
    await user.save();
    res.json({ message: "User registered" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
});

// ===== Task Routes =====
app.post("/api/tasks", auth(), async (req, res) => {
  const { title, description, deadline } = req.body;
  const task = await Task.create({
    title,
    description,
    deadline,
    assignee: req.user.id,
  });
  res.json(task);
});

app.get("/api/tasks", auth(), async (req, res) => {
  const tasks = await Task.find({ assignee: req.user.id }).sort("-createdAt");
  res.json(tasks);
});

app.patch("/api/tasks/:id", auth(), async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.assignee.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

// ===== Attendance Routes =====
app.get("/api/attendance/mine", auth(), async (req, res) => {
  const rows = await Attendance.find({ user: req.user.id }).sort("-date");
  res.json(rows);
});

app.patch("/api/attendance/:id/override", auth("admin"), async (req, res) => {
  const { status } = req.body;
  const att = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status, source: "hr" },
    { new: true }
  );
  res.json(att);
});

// ===== Upload Proof + AI Analysis =====
app.post("/api/evidence/:taskId/upload", auth(), upload.single("file"), async (req, res) => {
  try {
    const { filename } = req.file;

    // Call OpenAI for analysis
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI that verifies employee work evidence." },
        { role: "user", content: `A file named "${filename}" has been uploaded. Decide if this should mark the employee as PRESENT or PENDING.` }
      ],
    });

    const aiDecision = aiResponse.choices[0].message.content;

    // Save to Attendance
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const attendance = await Attendance.findOneAndUpdate(
      { user: req.user.id, date: today },
      { user: req.user.id, date: today, status: aiDecision.toLowerCase().includes("present") ? "present" : "pending", source: "ai", aiDecision },
      { upsert: true, new: true }
    );

    res.json({ message: "File uploaded & analyzed", file: filename, attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI analysis failed" });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
