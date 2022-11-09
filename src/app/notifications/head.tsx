/*
Warning: Currently, the Head export does not re-render
on client-side transitions, only on initial render. 
To work around this for <title>, you can use a
client component with useEffect that updates document.title. 
This will be fixed soon in a future release.

@see https://beta.nextjs.org/docs/api-reference/file-conventions/head
*/

export default function Head() {
  return (
    <>
      <title>notifications | musker</title>
      <meta name="description" content="you notifications" />
    </>
  );
}
