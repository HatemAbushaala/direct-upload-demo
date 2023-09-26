export async function onRequest({env}) {
  return env.ASSETS.fetch(`/data.json`)
}