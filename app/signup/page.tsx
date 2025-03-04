"use client";

import { signup } from "@/actions/actions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface SignupFields {
  name: string;
  email: string;
  password: string;
  grade: number;
}

function Page() {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [grade, setGrade] = React.useState<number>();
  const router = useRouter();

  return (
    <main className="signup max-w-screen h-screen flex justify-center  bg-neutral-900 items-center">
      <section className="form flex flex-col justify-evenly items-center px-6 py-4 border-[0.8px] border-neutral-800  bg-neutral-950 rounded-lg h-[75vh] w-[25vw]">
        <div className=" w-full text-center">
          <h1 className="text-2xl text-slate-300 capitalize font-bold tracking-wider">
            Signup
          </h1>
        </div>
        <div className="flex flex-col justify-evenly mt-5 w-full h-full items-start">
          <label className="font-semibold text-slate-300 " htmlFor="name">
            Enter your name
          </label>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full h-auto bg-neutral-900/80 p-2 border-[0.3px] text-white border-neutral-800 rounded-lg"
            type="text"
            name="name"
            id="name"
          />
          <label className="font-semibold text-slate-300 " htmlFor="email">
            Enter your email
          </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full h-auto bg-neutral-900/80 text-white p-2 border-[0.3px] border-neutral-800 rounded-lg"
            type="email"
            name="email"
            id="email"
          />
          <label className="font-semibold text-slate-300" htmlFor="password">
            Enter your password
          </label>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full h-auto bg-neutral-900/80 text-white p-2 border-[0.3px] border-neutral-800 rounded-lg"
            type="password"
            name="password"
            id="password"
          />
          <label className="font-semibold text-slate-300 " htmlFor="grade">
            Enter your grade
          </label>
          <input
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0) {
                setGrade(value);
              }
            }}
            className="w-full h-auto text-white bg-neutral-900/80 p-2 border-[0.3px] border-neutral-800 rounded-lg"
            type="number"
            name="grade"
            id="grade"
          />
          <h1 className="text-slate-300">
            Already a existing user?{" "}
            <a href="/signin" className="text-sky-500 underline">
              click here
            </a>{" "}
          </h1>
          <button
            onClick={async () => {
            const token =  await signup({
                name,
                email,
                password,
                grade: grade ?? 0,
              });
              if(!token){
                alert('token not found')
              }

              localStorage.setItem("token", token);
              alert("token set successfully");
              router.push("/home");
            }}
            className="w-full text-center bg-green-400 font-semibold border-[0.5px] border-green-950/50 p-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </section>
    </main>
  );
}

export default Page;
