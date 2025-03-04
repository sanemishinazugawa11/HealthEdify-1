"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
function Page() {
 

  const router = useRouter();

  return (
    <section className="home bg-neutral-950 max-w-screen h-screen ">
      <section className="nav absolute bg-neutral-950 top-0 w-full px-6 border-b-[0.5px] flex justify-between items-center border-neutral-800 h-[10vh]">
        <div>
          <span className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-t from-white via-slate-300 to-slate-700">Welcome back, Cheif!</span>
        </div>
        <div>
          <button
            onClick={async () => {
              router.push("/");
            }}
            className="bg-gradient-to-t text-sm text-black tracking-wide from-sky-700 via-sky-600 to-sky-400 border-[0.5px] border-neutral-800 px-3 py-2 rounded-lg font-semibold hover:cursor-pointer "
          >
            Back to home
          </button>
        </div>
      </section>

      <section className="w-full bg-neutral-950 h-full grid grid-cols-4 mt-18  gap-2">
        <section className="history  flex flex-col items-center gap-5 col-span-1 border-r-[0.5px] border-r-neutral-800 h-screen w-full">  
          <motion.button onClick={()=>{
            router.push('/home/quiz')
          }}
          initial={{x:-500}}
          animate={{x:0}}
          transition={{duration:1.1}}
          className="bg-gradient-to-t text-black from-sky-900 via-sky-700 to-sky-400 px-3 py-4 text-lg mt-10 w-[80%] rounded-md border-[0.5px]  border-green-950 font-semibold hover:cursor-pointer tracking-wide">
            Quizzes
          </motion.button>
          <motion.button onClick={()=>{
            router.push('/home/modules')
          }}
          initial={{x:-500}}
          animate={{x:0}}
          transition={{duration:1.1}}
          className="bg-gradient-to-t text-black from-sky-900 via-sky-700 to-sky-400 px-3 hover:cursor-pointer py-4 text-lg mt-10 w-[80%] rounded-md border-[0.5px] border-green-950 font-semibold tracking-wide">
            Modules
          </motion.button>
          <motion.button onClick={()=>{
            router.push('/home/videos')
          }}
          initial={{x:-500}}
          animate={{x:0}}
          transition={{duration:1.1}}
          className="bg-gradient-to-t hover:cursor-pointer text-black from-sky-900 via-sky-700 to-sky-400 px-3 py-4 text-lg mt-10 w-[80%] rounded-md border-[0.5px] border-green-950 font-semibold tracking-wide">
            Videos
          </motion.button>
         
         
        </section>
        <section className="query bg-transparent h-full justify-start items-center flex flex-col col-span-3">
            <motion.h2
            initial={{y:-100}}
            animate={{y:0}}
            transition={{duration:1.1}}

            className="text-transparent mt-40 text-6xl px-10 text-center  leading-[75px] bg-clip-text bg-gradient-to-t from-white via-slate-400 to-slate-700  font-extrabold  " 
            >"Invest in your health today, for every step forward fuels both body and mind on the journey to progress"</motion.h2>
        </section>
      </section>
    </section>
  );
}

export default Page;
