# Musker

A Twitter clone built with experimental nextjs 13 features.

```sh
yarn install
#yarn prisma generate
yarn prisma db push
yarn tsnode scripts/seed-db.ts
yarn build
yarn start
```

###### friendly reminder so self:

- goal **is not** some sort of feature complete twitter clone.
- goal **is** get comfortable with latest/experimental/beta nextjs stuff

###### cool things used

- app dir
- vercel/og image generation for any tweet/profile url (with tailwind and svg)
- nested layouts,
- server components (more or less everywhere except for infinite scroll components)
- trpc v10
- planetscale database querys in edge functions

###### todo / find out / wait for stable

- `<title>` does not update on client navigation
- `head.tsx` datafetching... how to configure, revalidate etc
- having comments in head.tsx breaks build unless the comment is on its own line?
- how to test `@planetscale/database` driver (http protocol) on a local mysql server?
- is there a way to pass data from a layout.tsx to a page.tsx?
