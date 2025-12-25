"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PlatformCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  stats?: string;
  delay?: number;
}

export function PlatformCard({
  name,
  description,
  icon: Icon,
  href,
  gradient,
  stats,
  delay = 0,
}: PlatformCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group h-full"
    >
      <Link href={href} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-2xl glass-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
          {/* Gradient background effect */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
              gradient
            )}
          />

          {/* Icon */}
          <div
            className={cn(
              "mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
              gradient
            )}
          >
            <Icon className="h-7 w-7" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{name}</h3>
              {stats && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {stats}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-6 right-6 flex items-center gap-1 text-muted-foreground opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <span className="text-sm font-medium">Xem ngay</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
