import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <Card className={cn("flex h-full flex-col overflow-hidden border bg-background", className)}>
      <Link href={href || "#"} className="relative block h-48 overflow-hidden">
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 400px"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/60" />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-4 text-white">
        <div>
          <div className="text-sm font-semibold opacity-80">{dates}</div>
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
        </div>
        <div className="text-sm text-white/80">
          <Markdown>{description}</Markdown>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/10 text-white text-xs px-2 py-1">
              {tag}
            </Badge>
          ))}
        </div>
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {links.map((link, idx) => (
              <Link key={idx} href={link.href} target="_blank" className="text-xs font-medium text-white/80">
                <Badge className="flex items-center gap-2 bg-white/20 text-white text-xs px-3 py-1">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
