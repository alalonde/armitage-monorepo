"use client";

import BreadCrumb from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Team } from "@prisma/client";
import { RepositoryTeamCard } from "@/components/repositoryTeamCard";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const breadcrumbItems = [
  { title: "Repositories", link: "/dashboard/repositories" },
];

export default function TeamsPage() {
  const [repositoryTeams, setRepositoryTeams] = useState<Team[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleQueryRepositoryTeams = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/api/repositories`);
    if (data.success && data.userTeams) {
      setRepositoryTeams(data.userTeams);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleQueryRepositoryTeams();
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Repositories`}
            description={`Manage your repositories or create a new one`}
          />
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/repositories/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        <div>
          {repositoryTeams.length !== 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {repositoryTeams.map((team) => {
                return (
                  <div>
                    <RepositoryTeamCard teamDto={team}></RepositoryTeamCard>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pl-36 pr-36 flex justify-center">
              <TextGenerateEffect words="Seems like there are no github repositories on this team, fix this by clicking on the manage repositories button above." />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
