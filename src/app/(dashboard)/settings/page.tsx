"use client";

import axios from "axios";
import { Icons } from "@/components/icons";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserWalletComponent } from "@/components/wallets/userWalletComponent";
import { Skeleton } from "@/components/ui/skeleton";

type Settings = {
  githubAppUrl: string;
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    handleFetchSettings();
  }, [session]);

  const handleFetchSettings = async () => {
    const { data } = await axios.get(`/api/settings`);
    if (data.success) {
      setSettings(data.settings);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <div className="flex items-start justify-between">
        <Heading
          title={`Settings`}
          description={`Manage your account settings.`}
        />
      </div>
      <Separator />

      <div>
        <h3 className="text-lg font-medium">Manage Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Manage what access Armitage have on you profile.
        </p>
        <br></br>
        {isLoading ? (
          <Skeleton className="h-[45px] w-[500px] rounded-xl" />
        ) : (
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              router.push(`${settings?.githubAppUrl}`);
            }}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Manage GitHub Access
          </Button>
        )}
      </div>

      <br></br>
      <UserWalletComponent />
    </div>
  );
}
