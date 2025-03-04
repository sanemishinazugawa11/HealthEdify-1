"use client"
import React from 'react'
import  { motion } from 'framer-motion'
export default function Hero() {
  return (
    <section className="hero mt-48 px-8 flex flex-col justify-center w-full h-[80vh]">
        <div
         className="relative w-full h-[60%] mt-20 flex  justify-start items-center">
            <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[70px] text-transparent text-center font-extrabold bg-clip-text bg-gradient-to-t from-white via-slate-300 to-slate-600 leading-[100px]"
            >
            Empowering Young Minds with Essential Healthcare Knowledge
            </motion.h1>
          <div className='absolute w-full h-full flex justify-evenly items-center'>
            <div className=' bg-violet-800/40 w-[20%] h-[40%] blur-[100px] '></div>
            <div className='  bg-sky-800/40 w-[20%] h-[40%]   blur-[100px] '></div>
            <div className=' bg-violet-800/40 w-[20%] h-[40%] blur-[100px] '></div>
          </div>
        </div>

        <div className="w-full mt-32 h-[35%]">
          <motion.h2
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[32px] text-transparent bg-clip-text bg-gradient-to-t from-violet-500 via-violet-300 to-slate-50 leading-normal font-semibold  text-center">
            Integrating healthcare education into the school curriculum through
            interactive modules, personalized learning, and AI-powered insights
            — fostering a generation that prioritizes physical, mental, and
            emotional well-being.
          </motion.h2>
        </div>
      </section>
  )
}

