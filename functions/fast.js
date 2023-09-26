export async function onRequest({env}) {
  return env.ASSETS.fetch(`${env.CF_PAGES_URL}/data.json`)
}