"use client";
import { submitLearning } from "@/actions/actions";
import { generateQuiz, getDescription } from "@/lib/gemini";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
function Page() {
  const router = useRouter();

  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const formatResponse = (text: string) => {
    return text.split("\n").map((str, index) => (
      <p key={index} className="mb-4">
        {str}
      </p>
    ));
  };

  return (
    <section className="quiz max-w-screen overflow-hidden h-screen">
      <motion.section
      initial={{y:-100}}
      animate={{y:0,
      }}
      transition={{duration:1.1}}
      
      className="nav absolute top-0 w-full px-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b-[0.5px] flex justify-between items-center border-neutral-700 h-[10vh]">
        <div>
          <span className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-t from-white via-slate-300  to-sky-800">Study mode on!</span>
        </div>
        <div>
          <button
            onClick={async () => {
              router.push("/home");
            }}
            className="bg-gradient-to-t text-sm text-black tracking-wide from-sky-500 via-sky-600 to-sky-800 px-3 py-2 rounded-lg font-semibold hover:cursor-pointer "
          >
            Back to home
          </button>
        </div>
      </motion.section>

      <section className="hero mt-18 w-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-4 flex justify-center items-center h-[90%]">
        <section className="generateText bg-neutral-950/70 rounded-xl w-[70%] border-[0.5px] border-neutral-800 p-3 flex flex-col justify-between items-center h-full">
          <div className="w-full h-[85%] overflow-y-scroll overflow-x-hidden px-8 py-5">
           
            {loading ? (
              <div className="text-justify font-semibold w-full h-full flex justify-center items-center text-white select-text break-words">
                <div className="bg-violet-300 h-20 w-20 rounded-full animate-pulse transition-all duration-100 ease-linear"></div>
              </div>
            ) : (
              <p className="text-justify text-lg font-semibold text-white w-full h-full tracking-wider select-text break-words">
                {response !== "" ? formatResponse(response) : "Your response here."}
              </p>
            )}
          </div>
          <div className="w-full flex justify-evenly items-center">
            <input
              onChange={(e) => {
                setQuery(e.target.value);
                setLoading(false);
              }}
              className="w-[70%] h-[10vh]  bg-neutral-900/50  border-2 border-neutral-700  rounded-lg text-slate-50 p-2"
              placeholder="Enter your search here"
              type="text"
              value={query}
            />
            <button
              onClick={async () => {
                if (!query.trim()) {
                  alert("Please enter your search query!");
                  setLoading(false);
                  return;
                }

                setLoading(true);
                const ans = await getDescription(query);
                setResponse(ans);
                setLoading(false);
                // console.log(query, ans);
          
                const token = localStorage.getItem("token");
                if (token) {
                 const success = await  submitLearning(query, ans, token);

                 if(success){
                   alert("Learning saved successfully");
                 }
                 else{
                    alert("Failed to save learning");
                 }
                } else {
                  alert("No token found. Please log in.");
                }
                // if(res.data.success){
                //   setQuery("");
                // }

                await generateQuiz(query);
              }}
              className="bg-gradient-to-t text-sm text-black tracking-wide w-[20%] from-sky-500 via-sky-600 to-sky-700 border-[1px] border-green-950 px-5 py-2 rounded-lg font-semibold"
            >
              Generate
            </button>
          </div>
        </section>
      </section>
    </section>
  );
}

export default Page;
