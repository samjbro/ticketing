import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

// import mongoose, { Schema, Document } from "mongoose";

// interface TicketAttributes {
//   title: string;
//   price: string;
//   userId: string;
// }

// interface TicketDocument extends Document, TicketAttributes {}

// const TicketSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     userId: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     toJSON: {
//       transform: (doc, ret) => {
//         ret.id = ret._id;
//         delete ret._id;
//       },
//       versionKey: false,
//     },
//   }
// );

// const TicketModel = mongoose.model<TicketDocument>("Ticket", TicketSchema);

// class Ticket extends TicketModel {
//   constructor(attrs: TicketAttributes) {
//     super(attrs);
//   }
// }

// export { Ticket };
