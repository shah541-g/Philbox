import mongoose from "mongoose"


const Schema = {
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true},
  phone_number: {type: String},
  category: {
    type: String,
    enum: ["super-admin", "branch-admin"],
    default: "branch-admin"
  },
  profile_img_url: {
    type: String,
    default: function () { return `https://avatar.iran.liara.run/username?username=${this.name}`
    }
  },
  cover_img_url: {
    type: String,
    default: function () {
      return `https://placehold.co/1920x480/EAEAEA/000000?text=${this.name}`
    }
  },
  status: {
    type: String,
    enum: ["active", "suspended", "blocked"],
    default: function () {
      if(this.category === "super-admin"){
        return undefined
      } else{
        return "active"
      }
    }
  },
  addresses: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
  branches_managed: [{type:mongoose.Schema.Types.ObjectId, ref: "Branch"}],
  isTwoFactorEnabled: { type: Boolean, default: false }, // enable/disable 2FA
  otpCode: { type: String }, // temporary OTP if using email/SMS
  otpExpiresAt: { type: Date } // OTP expiration time
}

const Timestamp = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}
const adminSchema = new mongoose.Schema(Schema, Timestamp);

const Admin = mongoose.model("Admin", adminSchema)

export default Admin;