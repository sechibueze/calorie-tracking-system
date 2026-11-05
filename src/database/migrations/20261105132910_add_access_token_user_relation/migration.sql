-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
