const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'need a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'maxlength 40 characters'],
      minLength: [8, 'minlength 8 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'need a duration'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['easy', 'medium', 'difficul'],
        message: "must be 'easy', 'medium', 'difficul'",
      },
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      message: 'dddddddd',
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'need a price'],
    },
    priDiscount: {
      type: Number,
      validate: {
        validator(val) {
          return val < this.price;
        },
        message: 'discount price ({VALUE}) is not a invalid',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'need a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'need a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secreatTour: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeek').get(function () {
  return Math.ceil(this.duration / 7);
});

// middleware in mongoose
// tourSchema.pre('save', function (next) {
//   console.log(this.createdAt);
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   console.log(doc.name);
//   console.log(this);
//   next();
// });

// middleware in mongoose query
tourSchema.pre(/^find/, function (next) {
  this.find({ secreatTour: { $ne: true } });

  next();
});

// // middleware in mongoose aggregation
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { $nq: true } });
  next();
});

module.exports = mongoose.model('tour', tourSchema);
//                                ^ collection name
