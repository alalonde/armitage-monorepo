"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { useState } from "react";
import { UserCredDto } from "@/app/api/credmanager/route";
import axios from "axios";
import { LoadingCalculations } from "./calculationLoadingDialog";

interface GenerateCalculationsProps {
  registeredGitRepos: RegisteredGitRepo[];
}

export function GenerateCalculations({
  registeredGitRepos,
}: GenerateCalculationsProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userCredDtos, setUserCredDtos] = useState<UserCredDto[]>([]);

  const handleFetch = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/credmanager`);
    if (data && data.success) {
      setUserCredDtos(data["userCredDtos"] as UserCredDto[]);
    }
    setLoading(false);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Generate Calculations</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col justify-center space-x-2">
          <DrawerHeader>
            <DrawerTitle>Confirm settings</DrawerTitle>
            <DrawerDescription>
              The following repositories will be used to generate the
              contribution graph
            </DrawerDescription>
          </DrawerHeader>
          <div className="items-center pt-6 pb-6">
            <ScrollArea className="h-72 rounded-md border items-center ">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none items-center">
                  Name
                </h4>
                {registeredGitRepos.map((gitRepo) => (
                  <>
                    <div
                      key={gitRepo.full_name}
                      className="text-sm text-center"
                    >
                      {gitRepo.name}
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DrawerFooter>
            <Button onClick={handleFetch}>Submit</Button>
            <LoadingCalculations
              isOpen={isLoading}
              onSubmit={() => {}}
              onClose={() => {}}
            />
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
