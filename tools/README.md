# fimidara frontend tools

- Copy generated server content like endpoints, table of content, private js sdk code, etc. `npx tsx tools/copyGeneratedStuffFromServer.ts && npx code-migration-helpers add-ext -f="./lib/api/privateEndpoints.ts" --from=".js" --to=".ts"`
