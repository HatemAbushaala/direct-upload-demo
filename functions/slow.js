export async function onRequest({env}) {
  return fetch(`${env.CF_PAGES_URL}/data.json`)
}