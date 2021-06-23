const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(_ => console.log('Connected to MongoDB'))
	.catch(error => console.error('Error connecting to MongoDB', error));

const numberValidator = {
	validator: numberString => {
		const numberArr = Array.from(numberString).filter(char => Number(char));
		return numberArr.length >= 8;
	},
	message: props => `${props.value} is not a valid phone number! Number must have minimum 8 digits!`
};

const personSchema = new mongoose.Schema({
	name: { type: String, minLength: 3, required: true, unique: true },
	number: { type: String, validate: numberValidator, required: true, unique: true }
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Person', personSchema);
