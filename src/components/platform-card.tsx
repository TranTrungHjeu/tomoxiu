"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface PlatformCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  delay?: number;
}

export function PlatformCard({
  name,
  description,
  icon: Icon,
  href,
  gradient,
  delay = 0,
}: PlatformCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Link href={href}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-border hover:shadow-xl hover:shadow-violet-500/10">
          {/* Gradient background effect */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}
          />
          
          {/* Icon */}
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${gradient} text-white shadow-lg`}
          >
            <Icon className="h-7 w-7" />
          </div>

          {/* Content */}
          <h3 className="mb-2 text-xl font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>

          {/* Arrow indicator */}
          <motion.div
            className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
