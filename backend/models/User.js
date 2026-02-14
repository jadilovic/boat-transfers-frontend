import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["traveler", "operator", "admin"],
      default: "traveler", // 🔒 prevents admin self-signup
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    // Operator-only fields
    boatName: {
      type: String,
      trim: true,
    },

    boatCapacity: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// 🔐 Password hash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
