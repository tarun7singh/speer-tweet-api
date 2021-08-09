import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
    username: string;
    hash: string;
    firstName: string;
    lastName: string;
    sessionId?: string;
}

const schema = new Schema<IUser>({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    sessionId: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    },
});

const UserModel = mongoose.model<IUser>('User', schema);
export default UserModel;
