-- AlterTable Task: add parentId
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "parentId" TEXT;

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "Task_parentId_idx" ON "Task"("parentId");

-- AddForeignKey (idempotent: only add if not already present)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Task_parentId_fkey'
    ) THEN
        ALTER TABLE "Task" ADD CONSTRAINT "Task_parentId_fkey"
            FOREIGN KEY ("parentId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AlterTable UserSettings: add onboardingCompletedAt
ALTER TABLE "UserSettings" ADD COLUMN IF NOT EXISTS "onboardingCompletedAt" TIMESTAMP(3);
