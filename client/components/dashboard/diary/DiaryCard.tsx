'use client';

import { Diary } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar, Tag, Trash2, Edit2, Star, MoreVertical, Smile, Frown, Meh, Zap, Coffee, AlertCircle, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiaryCardProps {
  entry: Diary;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (entry: Diary) => void;
  onDelete: (id: string) => void;
  canUpdate: boolean;
  canDelete: boolean;
}

const getRelativeTime = (date: string) => {
  const now = new Date();
  const entryDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - entryDate.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return entryDate.toLocaleDateString();
};

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case 'Happy': return <Smile className="h-4 w-4 text-green-500" />;
    case 'Sad': return <Frown className="h-4 w-4 text-blue-500" />;
    case 'Neutral': return <Meh className="h-4 w-4 text-gray-500" />;
    case 'Excited': return <Zap className="h-4 w-4 text-yellow-500" />;
    case 'Tired': return <Coffee className="h-4 w-4 text-brown-500" />;
    case 'Stressed': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'Grateful': return <Heart className="h-4 w-4 text-pink-500" />;
    default: return <Meh className="h-4 w-4 text-gray-500" />;
  }
};

const getMoodColor = (mood: string) => {
  switch (mood) {
    case 'Happy': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'Sad': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'Neutral': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    case 'Excited': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'Tired': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
    case 'Stressed': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'Grateful': return 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

export function DiaryCard({
  entry,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  canUpdate,
  canDelete,
}: DiaryCardProps) {
  return (
    <Card className={cn(
      'group relative flex flex-col h-full transition-all duration-200 hover:shadow-md border-muted/60',
      isSelected && 'ring-2 ring-primary border-primary'
    )}>
      {/* Selection Checkbox */}
      {canDelete && (
        <div className={cn(
          "absolute top-3 left-3 z-10 transition-opacity duration-200",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(entry._id)} 
            onClick={(e) => e.stopPropagation()}
            className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-4 px-4 space-y-2">
        <div className="flex items-start justify-between gap-2 pl-6">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold line-clamp-1" title={entry.title}>
                {entry.title}
              </CardTitle>
              {entry.isFavorite && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 shrink-0" />}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem onClick={() => onEdit(entry)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(entry._id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={cn("gap-1.5 font-normal", getMoodColor(entry.mood))}>
            {getMoodIcon(entry.mood)}
            {entry.mood}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {entry.content}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {entry.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal px-1.5 py-0 h-5">
              <Tag className="mr-1 h-2.5 w-2.5 opacity-70" />
              {tag}
            </Badge>
          ))}
          {entry.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs font-normal px-1.5 py-0 h-5">
              +{entry.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1.5" title={`Created: ${new Date(entry.date).toLocaleString()}`}>
          <Calendar className="h-3.5 w-3.5" />
          {new Date(entry.date).toLocaleDateString()}
        </div>
        <span title={`Updated: ${new Date(entry.updatedAt).toLocaleString()}`}>
          {getRelativeTime(entry.updatedAt)}
        </span>
      </CardFooter>
    </Card>
  );
}
