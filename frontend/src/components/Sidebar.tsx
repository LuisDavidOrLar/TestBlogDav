import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuUserCircle2, LuLayoutDashboard, LuPlusCircle } from "react-icons/lu";
import logo from '/src/assets/logo.png'; 

const Sidebar: React.FC = () => {
  const getButtonClassName = ({ isActive }: { isActive: boolean }) => {
    return isActive ? buttonVariants({ variant: "default" }) : buttonVariants({ variant: "secondary" });
  };

  const { user,logout } = useAuth();

  return (
    <div className="bg-white shadow-lg flex flex-col justify-between w-1/6">
      
      <div className="flex flex-col items-center justify-start pt-6">
        <img src={logo}alt="Logo" className="w-1/2 mb-12" />
      </div>

      <div className="flex flex-col items-center flex-grow justify-center">
        <ul className="space-y-12">
          <li className="w-full">
            <NavLink to="/dashboard" className={getButtonClassName}>
            <LuLayoutDashboard size={25} style={{ marginRight: '4px' }} /> Dashboard
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink to="/create-post" className={getButtonClassName}>
            <LuPlusCircle size={25} style={{ marginRight: '5px' }} /> New Post
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink to="/my-posts" className={getButtonClassName}>
              My Posts
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={buttonVariants({ variant: "secondary" })}>
            <LuUserCircle2 size={18} style={{ marginRight: '4px' }}/>Open
            </button>
          </DropdownMenuTrigger>
           <DropdownMenuContent>
            <DropdownMenuLabel>{user ? user.email : "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
