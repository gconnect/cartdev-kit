"use client"
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import cartesi from "../../../public/images/cartesi-logo.png";
import {FaBars} from 'react-icons/fa'
import { IoCloseSharp } from "react-icons/io5";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between h-full bg-black text-white p-4 items-center">
      <Link href={"/"}>
        <p className="py-4">
          <Image src={cartesi} width={120} height={120} alt="logo" />
        </p>
      </Link>
      <div className="flex items-center">
        <div className="hidden md:flex">
          <Link href={"/pages/greetings"}>
            <p className="mx-2 my-4">Greetings</p>
          </Link>
          <Link href={"/pages/payments"}>
            <p className="mx-2 my-4">Payments</p>
          </Link>
          <div className="my-2">
            <ConnectButton />
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
          <div className="flex justify-end">
            <IoCloseSharp onClick={toggleMenu}  color="white"/>
          </div>
          }       
          <div className="flex flex-col mt-16">
            <Link href={"/pages/greetings"}>
              <p className="my-4" onClick={toggleMenu}>Greetings</p>
            </Link>
            <Link href={"/pages/payments"}>
              <p className="my-4" onClick={toggleMenu}>Payments</p>
            </Link>
            <div className="my-4">
            <ConnectButton />
          </div>          
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;