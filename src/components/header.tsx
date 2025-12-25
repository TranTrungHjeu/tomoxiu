"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Music2,
  AtSign,
  Menu,
  Github,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/instagram",
    label: "Instagram",
    icon: Instagram,
    color: "hover:text-pink-500",
  },
  {
    href: "/facebook",
    label: "Facebook",
    icon: Facebook,
    color: "hover:text-blue-500",
  },
  {
    href: "/tiktok",
    label: "TikTok",
    icon: Music2,
    color: "hover:text-gray-400",
  },
  {
    href: "/threads",
    label: "Threads",
    icon: AtSign,
    color: "hover:text-gray-400",
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-border/40 glass"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Image
                src="/logo.png"
                alt="Stalker"
                width={400}
                height={250}
                className="h-10 w-auto dark:invert dark:brightness-90"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-foreground bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                        item.color
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-lg bg-accent -z-10"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xem profile {item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex"
                  asChild
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub Repository</p>
              </TooltipContent>
            </Tooltip>

            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Stalker"
                      width={100}
                      height={28}
                      className="h-7 w-auto dark:invert dark:brightness-90"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
