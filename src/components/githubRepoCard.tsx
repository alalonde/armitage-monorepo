import { CircleIcon, StarIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { stringToColour } from "@/lib/utils";
import { BookUpIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface GithubRepoCardProps {
  githubRepoDto: GithubRepoDto;
  onSelectRepo: (repo: GithubRepoDto, selected: boolean) => void;
  selected?: boolean;
}

export function GithubRepoCard({
  githubRepoDto,
  onSelectRepo,
  selected = false,
}: GithubRepoCardProps) {
  const [isSelected, setIsSelected] = useState<boolean>(selected);
  return (
    <>
      <Card>
        <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 h-3/4">
          <div className="space-y-1">
            <CardTitle>{githubRepoDto.full_name}</CardTitle>
            <CardDescription className="pt-1 flex justify-between h-full">
              {githubRepoDto.description || "No description detected"}
            </CardDescription>
          </div>
          <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
            <Button
              onClick={() => {
                setIsSelected(!isSelected);
                onSelectRepo(githubRepoDto, !isSelected);
              }}
              variant="secondary"
              className="shadow-none"
            >
              {!isSelected ? (
                <>
                  <BookUpIcon className="mr-2 h-4 w-4" />
                  Select
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Selected
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CircleIcon
                className="mr-1 h-3 w-3"
                style={{ color: stringToColour(githubRepoDto.full_name) }}
              />
              {githubRepoDto.language || "No language detected"}
            </div>
            <div className="flex items-center">
              <StarIcon className="mr-1 h-3 w-3" />
              {githubRepoDto.stargazers_count}
            </div>
            <div>
              {" "}
              Last updated on{" "}
              {new Date(githubRepoDto.updated_at).toLocaleString([], {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
