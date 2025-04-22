var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

var userSchema = new Schema(
    {
        id: objectId,
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        favorites: [{ type: String }], // Array of country codes (e.g., ["US", "GB"])

    }
);

var UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;