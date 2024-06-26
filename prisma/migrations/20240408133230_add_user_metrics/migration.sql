-- CreateTable
CREATE TABLE "UserTeamMetric" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "contribution_calculation_id" TEXT NOT NULL,
    "repo_name" VARCHAR(1000) NOT NULL,
    "metric_name" VARCHAR(1000) NOT NULL,
    "metric_count" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTeamMetric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTeamMetric" ADD CONSTRAINT "UserTeamMetric_contribution_calculation_id_fkey" FOREIGN KEY ("contribution_calculation_id") REFERENCES "ContributionCalculation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
