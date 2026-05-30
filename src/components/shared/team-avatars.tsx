import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TEAM = [
  { initials: "AK", color: "bg-indigo-500" },
  { initials: "JM", color: "bg-violet-500" },
  { initials: "SR", color: "bg-purple-500" },
  { initials: "DL", color: "bg-blue-500" },
];

export function TeamAvatars() {
  return (
    <div className="flex -space-x-2">
      {TEAM.map((member) => (
        <Avatar key={member.initials} className="h-8 w-8 border-2 border-background">
          <AvatarFallback className={`${member.color} text-white text-[10px]`}>
            {member.initials}
          </AvatarFallback>
        </Avatar>
      ))}
      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
        +2
      </div>
    </div>
  );
}
