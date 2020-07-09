var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name: { type: String, required: true, maxlength: 100 },
	last_name: { type: String, required: true, maxlength: 100 },
	email: { type: String, required: true },
	password: { type: String, required: true },
	membership_status: { type: Boolean, default: false },
});

// Virtual for users's full name
UserSchema.virtual('full_name').get(function () {
	var fullname = '';
	if (this.first_name && this.family_name) {
		fullname = this.family_name + ', ' + this.first_name;
	}
	if (!this.first_name || !this.family_name) {
		fullname = '';
	}

	return fullname;
});

//Export model
module.exports = mongoose.model('User', UserSchema);
