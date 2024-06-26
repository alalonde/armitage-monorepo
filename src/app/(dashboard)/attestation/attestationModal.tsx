"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEthersSigner } from "@/lib/ethersUtils";
import { useChainId } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  AttestationPublicDataDto,
  createPrivateAttestation,
  createProofs,
  createPublicAttestation,
} from "./utils/attestation-utils";
import { useSession } from "next-auth/react";
import { chainsConfig } from "./utils/attestation-config";
import { PrivateAttestationDialogContent } from "@/components/attestations/privateAttestationDialogContent";
import { PublicAttestationDialogContent } from "@/components/attestations/publicAttestationDialogContent";
import { ChooseTypeAttestationDialogContent } from "@/components/attestations/chooseTypeAttestationDialogContent";

type GenerateAttestationModalProps = {
  teamId: string;
};

export function GenerateAttestationModal({
  ...props
}: GenerateAttestationModalProps) {
  const account = useAccount();
  const signer = useEthersSigner();
  const session = useSession();
  const chainId = useChainId();
  const [easscanUrl, setEasscanUrl] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const [createTypeAttestation, setCreateTypeAttestation] =
    useState<string>("");
  const [attestationPrivateData, setAttestationPrivateData] = useState<any>();
  const [attestationPublicData, setAttestationPublicData] =
    useState<AttestationPublicDataDto>();
  const [attestationCreationError, setAttestationCreationError] =
    useState<boolean>(false);
  const [registeredAttestationUuid, setRegisteredAttestationUuid] = useState<
    string | undefined
  >(undefined);
  const [userSalt, setUserSalt] = useState<string | undefined>(undefined);
  const [userLogin, setUserLogin] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (account) {
      setUserAddress(account.address);
    }
  }, [account]);

  useEffect(() => {
    if (session.data?.user?.name) {
      setUserLogin(session.data.githubLogin);
    }
  }, [session]);

  useEffect(() => {
    if (chainId) {
      setEasscanUrl(chainsConfig[chainId].easscanUrl);
    }
  }, [chainId]);

  useEffect(() => {
    if (createTypeAttestation == "private") {
      handleFetchAttestationPrivateData();
    } else if (createTypeAttestation == "public") {
      handleFetchAttestationPublicData();
    }
  }, [createTypeAttestation]);

  useEffect(() => {
    if (
      signer &&
      userAddress &&
      attestationPrivateData &&
      userLogin &&
      chainId &&
      userSalt
    ) {
      createPrivateAttestation({
        address: "0xB5E5559C6b85e8e867405bFFf3D15f59693eBE2f",
        privateData: attestationPrivateData,
        signer: signer,
        chainId: chainId,
        salt: userSalt,
      }).then((attestationUuid) => {
        if (attestationUuid != null) {
          handlePostAttestationCreated(
            attestationUuid.attestationUuid,
            chainId,
          );
          const proof = createProofs(
            attestationPrivateData,
            [userLogin],
            userSalt,
          );
          console.log(JSON.stringify(proof));
        } else if (attestationUuid === null) {
          setAttestationCreationError(true);
        }
      });
    }
  }, [signer, userAddress, attestationPrivateData, userSalt, chainId]);

  useEffect(() => {
    if (
      signer &&
      userAddress &&
      attestationPublicData &&
      userLogin &&
      chainId
    ) {
      createPublicAttestation({
        address: "0xB5E5559C6b85e8e867405bFFf3D15f59693eBE2f",
        data: attestationPublicData,
        signer: signer,
        chainId: chainId,
      }).then((attestationUuid) => {
        if (attestationUuid != null) {
          handlePostAttestationCreated(
            attestationUuid.attestationUuid,
            chainId,
          );
        } else if (attestationUuid === null) {
          setAttestationCreationError(true);
        }
      });
    }
  }, [signer, userAddress, attestationPublicData, chainId]);

  const handleFetchAttestationPrivateData = async () => {
    const { data } = await axios.get(
      "/api/attestations?team_id=" + props.teamId,
    );
    if (data.success) {
      setAttestationPrivateData(data.privateAttestationData);
      setUserSalt(data.userSalt);
    }
  };

  const handleFetchAttestationPublicData = async () => {
    const { data } = await axios.get(
      "/api/attestations/user?team_id=" + props.teamId,
    );
    if (data.success) {
      setAttestationPublicData(data.attestationData);
    }
  };

  const handlePostAttestationCreated = async (
    attestationUuid: string,
    chainId: number,
  ) => {
    const { data } = await axios.post("/api/attestations", {
      chain_id: chainId.toString(),
      attestation_uuid: attestationUuid,
      team_id: props.teamId,
    });
    if (data.success) {
      setRegisteredAttestationUuid(attestationUuid);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-2" disabled={!account.isConnected}>
          {account.isConnected ? (
            <>Attestations</>
          ) : account.isConnecting || account.isReconnecting ? (
            <>Connecting...</>
          ) : (
            <>Connect wallet to create attestations</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {createTypeAttestation == "private" ? (
          <PrivateAttestationDialogContent
            registeredAttestationUuid={registeredAttestationUuid}
            easscanUrl={easscanUrl}
            createAttestationError={attestationCreationError}
          />
        ) : createTypeAttestation == "public" ? (
          <PublicAttestationDialogContent
            registeredAttestationUuid={registeredAttestationUuid}
            easscanUrl={easscanUrl}
            createAttestationError={attestationCreationError}
          />
        ) : (
          <ChooseTypeAttestationDialogContent
            setCreateTypeAttestation={setCreateTypeAttestation}
          />
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose
            asChild
            onClick={() => {
              setCreateTypeAttestation("");
            }}
          ></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
