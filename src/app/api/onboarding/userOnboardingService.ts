import { UserOnboarding } from "@prisma/client";

export enum OnboardingFlow {
  UNKNOWN,
  PRIVATE,
  PUBLIC,
}

export enum OnboardingStep {
  NOT_STARTED,
  WELCOME,
  REPO_TYPE_SELECT,
  REPO_SELECT,
  COMPLETED,
}

export async function getOnboardingStatusForUser(
  userId: string,
): Promise<UserOnboarding | null> {
  const userOnboarding = await prisma.userOnboarding.findFirst({
    where: {
      user_id: userId,
    },
  });
  return userOnboarding;
}

export async function saveCreateOnboardingStatusForUser(
  userId: string,
  flow: OnboardingFlow,
  flowStep: OnboardingStep,
): Promise<UserOnboarding> {
  let userOnboarding: UserOnboarding | null =
    await getOnboardingStatusForUser(userId);
  if (userOnboarding == null) {
    userOnboarding = await prisma.userOnboarding.create({
      data: {
        user_id: userId,
        flow: OnboardingFlow[flow],
        flow_step: OnboardingStep[flowStep],
      },
    });
  } else {
    await prisma.userOnboarding.update({
      where: {
        id: userOnboarding.id,
      },
      data: {
        flow: OnboardingFlow[flow],
        flow_step: OnboardingStep[flowStep],
        updated_at: new Date(),
      },
    });
  }
  return userOnboarding;
}