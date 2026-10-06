import mongoose from 'mongoose';

const edgeSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Edge = mongoose.model('Edge', edgeSchema);

export default Edge;
