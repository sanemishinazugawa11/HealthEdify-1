import { NextRequest, NextResponse } from "next/server";
import User, { connect, Learning } from "@/db/db";
import jwt from "jsonwebtoken";
export async function POST(req: NextRequest, res: NextResponse) {
  const { body } = await req.json();
  const { prompt, ans } = body;

  await connect();

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({
      message: "Unauthorized",
    });
  }

  const user = jwt.decode(token);
  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
    });
  }

  const userFound = await User.findOne({
    email: user,
  });

  const learning = new Learning({
    user: userFound._id,
    subject: prompt,
    topic: prompt,
    answer: ans,
    quiz: false,
    marksObtained: 0,
    totalMarks: 0,
  });

  await learning.save()



  return NextResponse.json({
    success : true,
    message : "Learning saved successfully"
  });
}


