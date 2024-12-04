"use strict";
const { Collection } = require("mongoose");
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const passwordEncrypt = require("../helpers/passwordEncrypt");
/* ------------------------------------------------------- */

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isStaff: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

/*---------------------------------------------------------*/

userSchema.pre(["save", "update"], function (next) {
  const data = this?._update ?? this;

  //EmailControl

  const isEmailValidated = data.email
    ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
    : true;

  if (!isEmailValidated) {
    next(new Error("Email is not validated"));
  }

  // password Control

  const isPasswordValidated = data.password
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/.test(
        data.password
      )
    : true;

  if (!isPasswordValidated) {
    next(
      new Error(
        "Password must be at least 8 characters long and contain at least one special character and  at least one uppercase character."
      )
    );
  }

  if (data.password) {
    if (this?._update) {
      //update
      this._update.password = passwordEncrypt(data.password);
    } else {
      //create

      this.password = passwordEncrypt(data.password);
    }
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
