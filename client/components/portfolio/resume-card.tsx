"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4 py-4">
        <Avatar className="size-12 border bg-background">
          <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
          <AvatarFallback>{altText[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 group">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base flex items-center gap-1">
                  {title}
                  <ChevronRightIcon
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      isExpanded ? "rotate-90" : "rotate-0"
                    )}
                  />
                </h3>
                {badges && (
                  <span className="inline-flex gap-1">
                    {badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {period}
            </span>
          </div>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 text-xs sm:text-sm text-muted-foreground"
            >
              {description}
            </motion.div>
          )}
        </div>
      </div>
    </Link>
  );
};
