"use client";
import { signin } from "@/actions/actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();

  return (
    <main className="signup max-w-screen h-screen flex justify-center bg-neutral-900 items-center">
      <section className="form flex flex-col justify-evenly items-center px-6 py-4 border-[0.8px] border-neutral-800  bg-neutral-950 rounded-lg h-[55vh] w-[23vw]">
        <div className=" w-full text-center">
          <h1 className="text-2xl capitalize font-bold text-white tracking-wider">
            Signin
          </h1>
        </div>
        <div className="flex flex-col  text-white justify-evenly mt-5 w-full h-full items-start">
          <label className="font-semibold " htmlFor="email">
            Enter your email
          </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full h-auto text-white border-[0.3px] bg-neutral-800/50 border-neutral-700 p-2 rounded-lg"
            type="email"
            name="email"
            id="email"
          />
          <label className="font-semibold " htmlFor="password">
            Enter your password
          </label>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full h-auto bg-neutral-800/50 border-neutral-700 p-2 border-[0.3px]  rounded-lg"
            type="password"
            name="password"
            id="password"
          />
          <h1>
            New user?{" "}
            <a href="/signup" className="text-sky-300 underline">
              click here
            </a>{" "}
          </h1>
          <button
            onClick={async () => {
              try {
               const res = await  signin({ email, password });
                if (res == false){
                  alert("Invalid credentials")
                }else{
                 await localStorage.setItem('token', res.toString());
                 alert("token set successfully")
                  router.push("/home")
                }


              } catch (error) {
                console.error("An error occurred during login:", error);
                alert("An error occurred. Please try again.");
              }
            }}
            className="w-full mt-5 text-center bg-green-400 font-semibold border-[0.5px] border-green-950/50 p-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </section>
    </main>
  );
}

export default Page;
