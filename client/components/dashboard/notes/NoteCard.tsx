"use client";

import { Note } from '@/lib/api';
import { getNoteColor } from '@/lib/theme-colors';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Archive, Copy, Edit2, Pin, Trash2 } from 'lucide-react';

const getRelativeTime = (date: string) => {
  const now = new Date();
  const noteDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - noteDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return noteDate.toLocaleDateString();
};

interface NoteCardProps {
  note: Note;
  isDark: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canCreate: boolean;
  onEdit: (note: Note) => void;
  onDuplicate: (noteId: string) => void;
  onTogglePin: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onDeleteRequest: (note: Note) => void;
}

export function NoteCard({
  note,
  isDark,
  canUpdate,
  canDelete,
  canCreate,
  onEdit,
  onDuplicate,
  onTogglePin,
  onToggleArchive,
  onDeleteRequest,
}: NoteCardProps) {
  const noteColor = getNoteColor(note.color || '', isDark);

  return (
    <Card
      style={{ backgroundColor: noteColor }}
      className={`relative group border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
        note.isPinned ? 'ring-2 ring-primary/20 border-primary/30' : ''
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {note.isPinned && <Pin className="h-4 w-4" />}
              {note.title}
            </CardTitle>
            <CardDescription className="mt-2">
              <Badge variant="outline">{note.category}</Badge>
            </CardDescription>
          </div>
          <TooltipProvider>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {canUpdate && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onTogglePin(note)}>
                        <Pin className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{note.isPinned ? 'Unpin' : 'Pin'}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(note)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {canCreate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={() => onDuplicate(note._id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {canUpdate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={() => onToggleArchive(note)}>
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{note.isArchived ? 'Unarchive' : 'Archive'}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {canDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={() => onDeleteRequest(note)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-24 w-full rounded-md">
          {note.content ? (
            <p className="text-sm pr-4">{note.content}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic pr-4">No content</p>
          )}
        </ScrollArea>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{getRelativeTime(note.createdAt)}</span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
        {note.isPinned && (
          <Badge variant="outline" className="text-xs">
            <Pin className="h-3 w-3 mr-1" />
            Pinned
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
