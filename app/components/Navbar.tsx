"use client"
import React from 'react'
import { animate, motion } from 'framer-motion'
import {  useRouter } from 'next/navigation'
function Navbar() {
    
    const router = useRouter();

  return (
    <motion.section
    initial={{y:-100}}
    animate={{y:0,
    }}
    transition={{duration:1.1}}
    className="nav border-b-[0.5px] border-neutral-800 bg-gradient-to-r from-black via-neutral-950/20 to-black absolute  left-1/2 -translate-x-[50%] z-50 backdrop-blur-md flex justify-between items-center  w-full px-8 h-[12vh]">
        <div className="logo w-[65%] px-16 flex justify-start items-center h-full">
          <h1 className="text-[35px] text-transparent bg-clip-text bg-gradient-to-t from-slate-500 via-slate-300 to-sky-100  font-extrabold tracking-wide">
            HealthEdify
          </h1>
        </div>

        <div className="flex justify-end gap-4 px-10 items-center w-[25%] h-[100%]">
          <button onClick={()=>{
             const token = localStorage.getItem('token');
              if(token){
                router.push('/home')
              }
            router.push('/signup')
          }} className="font-semibold bg-gradient-to-t from-sky-700 via-sky-400 to-sky-300 border-[0.5px] hover:cursor-pointer tracking-wide border-green-950 px-5 py-2 rounded-lg ">
            {(() => {
              const token = localStorage.getItem('token');
              return token ? 'Dashboard' : 'Sign up';
            })()}
          </button>
          <a
            href="signin"
            onClick={()=>{
              const token = localStorage.getItem('token');
              if(token){
                localStorage.removeItem('token');
                router.push('/')
              }else{
                router.push('/signin')
              }
            }}
            className="font-semibold bg-gradient-to-t from-slate-500 via-slate-300 to-slate-100 border-[0.5px] hover:cursor-pointer tracking-wide border-green-950 px-5 py-2 rounded-lg"
          >
            {(() => {
              const token = localStorage.getItem('token');
              return token ? 'Sign out ' : 'Sign in';
            })()}
          </a>
        </div>
      </motion.section>
  )
}

export default Navbar