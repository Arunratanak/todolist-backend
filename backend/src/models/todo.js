import mongoose from "mongoose"

const todoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    },
    { timestamps: true }   // NEW
)

export default mongoose.model("list", todoSchema)