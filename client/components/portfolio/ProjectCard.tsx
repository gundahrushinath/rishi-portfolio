'use client';

import { Project } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ExternalLink, Calendar, Tag, Trash2, Edit2, Github, Globe, Archive, Star, MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onToggleSelect: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  canUpdate: boolean;
  canDelete: boolean;
}

const getRelativeTime = (date: string) => {
  const now = new Date();
  const projectDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - projectDate.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return projectDate.toLocaleDateString();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'In Progress': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'Active': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    case 'On Hold': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'Cancelled': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'High': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
    case 'Medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'Low': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

export function ProjectCard({
  project,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  canUpdate,
  canDelete,
}: ProjectCardProps) {
  return (
    <Card className={cn(
      'group relative flex flex-col h-full transition-all duration-200 hover:shadow-md border-muted/60',
      isSelected && 'ring-2 ring-primary border-primary'
    )}>
      {/* Selection Checkbox - Visible on hover or when selected */}
      {canDelete && (
        <div className={cn(
          "absolute top-3 left-3 z-10 transition-opacity duration-200",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(project._id)} 
            onClick={(e) => e.stopPropagation()}
            className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-4 px-4 space-y-2">
        <div className="flex items-start justify-between gap-2 pl-6"> {/* Added padding-left for checkbox space */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold line-clamp-1" title={project.title}>
                {project.title}
              </CardTitle>
              {project.isFeatured && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 shrink-0" />}
              {project.isArchived && <Archive className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
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
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(project._id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className={cn("text-[10px] px-2 py-0 h-5 font-medium", getStatusColor(project.status))}>
            {project.status}
          </Badge>
          <Badge variant="outline" className={cn("text-[10px] px-2 py-0 h-5 font-medium", getPriorityColor(project.priority || 'Medium'))}>
            {project.priority || 'Medium'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-0 flex-1 flex flex-col gap-4">
        <CardDescription className="line-clamp-2 text-sm min-h-10">
          {project.description || "No description provided."}
        </CardDescription>

        <div className="space-y-3 mt-auto">
          {(project.progress !== undefined && project.progress >= 0) && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 h-5 bg-secondary/50 hover:bg-secondary/70">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-secondary/50">
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-4 flex items-center justify-between border-t bg-muted/5 mt-4">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {project.githubUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background hover:text-primary"
                    onClick={() => window.open(project.githubUrl, '_blank')}>
                    <Github className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>GitHub</TooltipContent>
              </Tooltip>
            )}
            {project.liveUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background hover:text-primary"
                    onClick={() => window.open(project.liveUrl, '_blank')}>
                    <Globe className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Live Demo</TooltipContent>
              </Tooltip>
            )}
            {project.link && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background hover:text-primary"
                    onClick={() => window.open(project.link, '_blank')}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>External Link</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
          {project.dueDate && (
            <div className="flex items-center gap-1" title="Due Date">
              <Calendar className="h-3 w-3" />
              {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
          <div title={`Created: ${new Date(project.createdAt).toLocaleDateString()}`}>
            {getRelativeTime(project.createdAt)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
