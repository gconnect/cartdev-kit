"use client"
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import devkit from "../../public/images/CartDevKit.png";
import {FaBars} from 'react-icons/fa'
import { IoCloseSharp } from "react-icons/io5";
import CustomButton from "./CustomButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between h-full bg-dark-blue text-white items-center px-8 py-4">
      <Link href={"/"}>
        <p className="py-4">
          <Image src={devkit} width={120} height={80} alt="logo" />
        </p>
      </Link>
      <div className="flex items-center">
        <div className="hidden md:flex">
          <Link href={"/cartesi/examples/wallet"}>
            <p className="mx-2 my-4 text-slate-400">Wallet</p>
          </Link>
          <div className="my-2">
            <CustomButton />
          </div>
        </div>
        <div className="md:hidden w-full z-50">
          <button onClick={toggleMenu}>
            {!isMenuOpen &&
              <FaBars/>
            }
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black p-8 z-50">
          {isMenuOpen && 
          <div className="flex justify-between">
            <Image src={devkit} width={80} height={50} alt="logo" />
            <IoCloseSharp onClick={toggleMenu}  color="white"/>
          </div>
          }       
          <div className="flex flex-col mt-16">
            <Link href={"/cartesi/examples/wallet"}>
              <p className="my-4 text-slate-400" onClick={toggleMenu}>Wallet</p>
            </Link>
            <div className="my-4">
            <CustomButton />
          </div>          
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;