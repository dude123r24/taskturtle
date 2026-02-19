-- CreateTable
CREATE TABLE "CalendarAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleEmail" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL DEFAULT 'primary',
    "calendarName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#4285F4',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiresAt" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncedEvent" (
    "id" TEXT NOT NULL,
    "calendarAccountId" TEXT NOT NULL,
    "googleEventId" TEXT NOT NULL,
    "eventFingerprint" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarAccount_userId_idx" ON "CalendarAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarAccount_userId_googleEmail_calendarId_key" ON "CalendarAccount"("userId", "googleEmail", "calendarId");

-- CreateIndex
CREATE INDEX "SyncedEvent_calendarAccountId_idx" ON "SyncedEvent"("calendarAccountId");

-- CreateIndex
CREATE INDEX "SyncedEvent_eventFingerprint_idx" ON "SyncedEvent"("eventFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedEvent_calendarAccountId_googleEventId_key" ON "SyncedEvent"("calendarAccountId", "googleEventId");

-- AddForeignKey
ALTER TABLE "CalendarAccount" ADD CONSTRAINT "CalendarAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncedEvent" ADD CONSTRAINT "SyncedEvent_calendarAccountId_fkey" FOREIGN KEY ("calendarAccountId") REFERENCES "CalendarAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
