# Deploy the Storybook

The Storybook is a static site. Vercel builds it from `main` and serves it at https://graphpaper.akshaygite.com. Every push to `main` redeploys it at the same address. It is live: the Vercel project is `graphpaper` under akshaysic-s-projects, and its production alias is https://graphpaper-alpha.vercel.app.

## Build settings

The build settings live in the repo, so the Vercel dashboard needs no overrides:

- `vercel.json`: no framework preset, install `npm ci`, build `npm run build-storybook`, output `storybook-static`. The build command compiles the tokens first and fixes the page title after.
- `package.json` `engines`: Node 24.x. The project is built and tested on Node 24.

## How it was set up

These steps are done. Repeat them only to rebuild the project from scratch.

1. Push `main`: `git push origin main`.
2. Create the project and connect the repo: `vercel link --yes --project graphpaper`. This also connects `akshaysic/graphpaper` on GitHub, so pushes to `main` deploy. `vercel git connect` confirms it.
3. Deploy: `vercel deploy --prod`. The deployment's own `.vercel.app` address asks for a Vercel login, because Deployment Protection covers it. The production alias and the custom domain are public.
4. Add the domain: `vercel domains add graphpaper.akshaygite.com graphpaper`. A subdomain needs the project name.
5. Check it: `vercel domains verify graphpaper.akshaygite.com`.

## DNS

The DNS for akshaygite.com is managed at WordPress.com (ns1 to ns3.wordpress.com), not at Vercel. No record had to be added: a wildcard `*` CNAME there points every subdomain at akshaygite.com, whose A record already points at Vercel, so Vercel verified the subdomain and issued its certificate.

That works only while the wildcard and the apex A record stay as they are. To make the subdomain independent of them, add this record in the WordPress.com DNS settings for akshaygite.com:

| Type | Name | Value |
|---|---|---|
| CNAME | `graphpaper` | `66aa95101210308d.vercel-dns-017.com.` |

## Check the live site

Open https://graphpaper.akshaygite.com on your phone. It should open on Read me first, and the tab should say Graphpaper. Send the address to yourself in a message to check the link preview: the cover image, the title Graphpaper and the line "Graphpaper is a design-system study."

## Changing the link preview

The preview image and favicon in `.storybook/public/` are built from `design/components/Cover/preview.html`. After changing the cover, run `npm run share-images` and commit both files. Vercel does not run this step, because its build has no browser.
