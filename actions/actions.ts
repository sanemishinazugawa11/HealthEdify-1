"use server";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { connect, Learning } from "@/db/db";
import { cookies } from "next/headers";
// Adjust the import based on your project structure

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "";

export async function signup({
  name,
  email,
  password,
  grade,
}: {
  name: string;
  email: string;
  password: string;
  grade: number;
}): Promise<string> {
  try {
    await connect();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userFound = await User.findOne({ email });

    if (userFound) {
      return "User already exists";
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      grade,
    });
    await user.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(email, process.env.JWT_SECRET);
    const cookieStore = await cookies();
    cookieStore.set("token", token);

    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Signup failed");
  }
}

export async function signin({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<String | boolean> {
  try {
    await connect();
    const userFound = await User.findOne({
      email,
    });
    console.log(userFound);
    if (!userFound) {
      return false;
    }
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      return false;
    }
    const token = jwt.sign(email, JWT_SECRET);
    const cookieStore = await cookies();
    cookieStore.set("token", token.toString());
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Signin failed");
  }
}

export async function submitLearning(
  prompt: string,
  ans: string,
  token: string
): Promise<boolean> {
  try {
    await connect();
    const user = jwt.decode(token);
    if (!user) {
      return false;
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

    await learning.save();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getLearning(token: string): Promise<any[]> {
  try {
    await connect();
    const user = jwt.decode(token);
    if (!user) {
      return ["Unauthorized"];
    }

    const userFound = await User.findOne({
      email: user,
    });

    const learnings = await Learning.find({
      user: userFound._id,
    });
    const learningsPlain = learnings.map((learning) => ({
      subject: learning.subject,
      quiz: learning.quiz,
    }));

    console.log(learningsPlain);

    return learningsPlain;
  } catch (e) {
    return ["Failed to fetch learning"];
  }
}
