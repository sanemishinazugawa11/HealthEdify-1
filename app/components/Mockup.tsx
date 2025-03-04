"use client"
import Image from 'next/image'
import React from 'react'
import mockup from "../Image/mockup.png";
import { motion } from 'framer-motion'
function Mockup() {
  return (
    <section className="w-[90%] mt-10  h-[80vh] rounded-xl flex justify-center items-center bg-gradient-to-r border-[1px] border-slate-700 from-black via-neutral-950 to-black ">
        <div className=" w-[50%] p-5 h-full">
          <Image
            src={mockup}
            alt="mockup"
            className="w-full h-full rounded-lg object-cover "
          />
        </div>
        <motion.div
       whileInView={{
        scale:0.85,
        transition:{
          duration:0.8
        }
       }}
        className="w-[50%] h-full flex flex-col justify-center px-5  items-center ">
          <h1 className="text-end text-6xl leading-[80px] text-transparent bg-clip-text font-semibold bg-gradient-to-t from-white via-slate-300 to-slate-800">
            Your healthcare knowledge assistant.
          </h1>
        </motion.div>
      </section>
  )
}

export default Mockup