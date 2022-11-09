/*

Unlike next/head, you can use arbitrary React components 
and data fetching inside of these to create compositions. 
They can also be async functions.

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
