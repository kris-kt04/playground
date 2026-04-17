import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";



export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

      const handleLogout = async () => {
          try {
              await authClient.signOut();
              navigate({ to: '/login' });
          } catch (err) {
              console.error('Logout error:', err);
          }
      }

  return (
    <header className="relative z-50 flex items-center justify-between p-4 text-white bg-black">

      <a href="/" className="flex-shrink-0 px-2 md:px-16"> 
        <img src="/images/logo.png" alt="MySite Logo" className=" md:h-10 h-10 w-auto md:w-auto" />
      </a>

      <div className="flex items-center ml-auto px-2 md:px-16 ">
        <nav className="hidden md:flex items-center space-x-6 ">
            <NavigationMenu className="text-base">
            <NavigationMenuList>
              <NavigationMenuItem>
              <NavigationMenuLink href="/pricing" className="text-base">Pricing</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
              <NavigationMenuLink
                onClick={(e) => {
                  e.preventDefault();
                  setOpen((prev) => !prev);
                }}
                className="text-base cursor-pointer"
              >
                <div className="flex items-center gap-1">
                   Resources <ChevronDown />                
                </div>
             
              </NavigationMenuLink>
              {open && (
                <div className="absolute mt-2 bg-black text-white rounded shadow-lg border-l border-r border-b border-gray-700">
                  <a href="https://news.h010.com/" className="block px-4 py-2 hover:bg-white hover:text-black">News</a>
                  <a href="https://help.h010.com/support/home" className="block px-4 py-2 hover:bg-white hover:text-black">FAQs</a>
                  <a href="/contact" className="block px-3 py-2 hover:bg-white hover:text-black">Contact Us</a>
                </div>
              )}
              </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
        
            <Button onClick={() => handleLogout()} className="text-black cursor-pointer hover:bg-gray-200 bg-white text-base">Logout</Button>
        </nav>

        {/* Mobile hamburger */}
        <Menu
          className="md:hidden p-2 h-12 w-12 cursor-pointer text-white"
          onClick={() => setIsMobile(!isMobile)}
          aria-label="Toggle menu"
        ></Menu>

      </div>

      {/* Mobile menu */}
      {isMobile && (
        <div className="absolute top-full left-0 w-full  p-3  md:hidden flex flex-col space-y-4 text-white bg-black">
          <a href="https://features.h010.com">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="https://news.h010.com/">News</a>
          <a href="https://help.h010.com/support/home">FAQs</a>
          <a href="/contact">Contact Us</a>
          <Button onClick={() => handleLogout()} className="text-black z-30">Logout</Button>
        </div>
      )}
    </header>
  )
}
