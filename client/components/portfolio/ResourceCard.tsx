'use client';

import { Resource } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ExternalLink, Calendar, Tag, Trash2, Edit2, Video, File, Code, Star, MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_BADGE_COLORS } from '@/lib/theme-colors';

interface ResourceCardProps {
  resource: Resource;
  isSelected?: boolean;
  onToggleSelect?: (resourceId: string) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
  canUpdate: boolean;
  canDelete: boolean;
}

const getRelativeTime = (date: string) => {
  const now = new Date();
  const resourceDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - resourceDate.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return resourceDate.toLocaleDateString();
};

const getCategoryIcon = (category: string) => {
  if (category === 'Video' || category === 'Course') return Video;
  if (category === 'Documentation' || category === 'Article') return File;
  return Code;
};

export function ResourceCard({
  resource,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  canUpdate,
  canDelete,
}: ResourceCardProps) {
  const ResourceIcon = getCategoryIcon(resource.category);

  return (
    <Card className={cn(
      'group relative flex flex-col h-full transition-all duration-200 hover:shadow-md border-muted/60',
      isSelected && 'ring-2 ring-primary border-primary'
    )}>
      {/* Selection Checkbox - Visible on hover or when selected */}
      {canDelete && onToggleSelect && (
        <div className={cn(
          "absolute top-3 left-3 z-10 transition-opacity duration-200",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(resource._id)} 
            onClick={(e) => e.stopPropagation()}
            className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-4 px-4 space-y-2">
        <div className="flex items-start justify-between gap-2 pl-6"> {/* Added padding-left for checkbox space */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
                <ResourceIcon className="h-3.5 w-3.5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold line-clamp-1" title={resource.title}>
                {resource.title}
              </CardTitle>
              {resource.isFeatured && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 shrink-0" />}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem onClick={() => onEdit(resource)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(resource._id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge className={cn("text-[10px] px-2 py-0 h-5 font-medium", CATEGORY_BADGE_COLORS[resource.category] || CATEGORY_BADGE_COLORS['Other'])}>
            {resource.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-0 flex-1 flex flex-col gap-4">
        <CardDescription className="line-clamp-2 text-sm min-h-10">
          {resource.description || "No description provided."}
        </CardDescription>

        <div className="space-y-3 mt-auto">
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 h-5 bg-secondary/50 hover:bg-secondary/70">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-secondary/50">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-4 flex items-center justify-between border-t bg-muted/5 mt-4">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {resource.url && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background hover:text-primary"
                    onClick={() => window.open(resource.url, '_blank')}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open Resource</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
          <div title={`Created: ${new Date(resource.createdAt).toLocaleDateString()}`}>
            {getRelativeTime(resource.createdAt)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
