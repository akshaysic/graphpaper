# Deploy the Storybook

The Storybook is a static site. Vercel builds it from `main` and serves it at graphpaper.akshaygite.com. After the first deploy, every push to `main` redeploys it at the same address.

1. Push the local commits, because `main` is ahead of origin:

   ```bash
   git push origin main
   ```

2. Open vercel.com/new and choose Import Git Repository. Pick `akshaysic/graphpaper`. If it is not listed, use Adjust GitHub App Permissions to give Vercel access to the repo.
3. Framework Preset: Other. If Vercel suggests Storybook, switch it to Other so the commands below are the ones that run.
4. Root Directory: leave it as `./`.
5. Under Build and Output Settings, turn on the overrides and set:
   - Build Command: `npm run build-storybook`. This compiles the tokens first and fixes the page title after.
   - Output Directory: `storybook-static`
   - Install Command: `npm ci`
6. Choose Deploy. When it finishes, open the `.vercel.app` address it gives you. It should open on Read me first, and the tab should say Graphpaper.
7. If the build fails on the Node version, go to Settings > Build and Deployment > Node.js Version, choose 24.x and redeploy. The project is built and tested on Node 24.
8. In the project, go to Settings > Domains and add `graphpaper.akshaygite.com`.
9. Vercel shows the DNS record the subdomain needs, usually a CNAME named `graphpaper`. Create that record exactly as shown where the DNS for akshaygite.com is managed. If akshaygite.com already uses Vercel's nameservers, Vercel adds the record itself.
10. Wait until the domain shows Valid Configuration. Vercel issues the certificate on its own.
11. Open https://graphpaper.akshaygite.com on your phone. Send the address to yourself in a message to check the link preview: the cover image, the title Graphpaper and the line "Graphpaper is a design-system study."

## Changing the link preview

The preview image and favicon in `.storybook/public/` are built from `design/components/Cover/preview.html`. After changing the cover, run `npm run share-images` and commit both files. Vercel does not run this step, because its build has no browser.
