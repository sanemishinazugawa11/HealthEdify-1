import mongoose, { Schema, Document } from 'mongoose';

const connect = async (): Promise<void> => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Already connected');
        return;
      }
        try{
            await mongoose.connect('mongodb+srv://ksbhuvi2004:0HWE4DwK4HxrXi5K@cluster0.rfv5q.mongodb.net/healthEdify')
            console.log('Connected to the database')
        }
        catch(e){
            console.error(e)
        }
}



const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    grade : { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const LearningSchema:Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    answer: { type: String, required: true },
    quiz: { type: Boolean, required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

interface ILearning extends Document {
    user: string;
    subject: string;
    topic: string;
    answer: string;
    createdAt: Date;
}

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    grade : number;
    createdAt: Date;
}

// Create the User model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Learning = mongoose.models.Learning || mongoose.model<ILearning>('Learning', LearningSchema);


export default User;
export { connect , Learning };