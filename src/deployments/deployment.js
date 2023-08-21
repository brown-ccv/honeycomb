/**
 *
 * @param {string} deployment The name of a given deployment
 * @returns
 */
// TODO: Logic for if isElectron()
// TODO: Logic for internet access when needed
export async function getDeployment(deployment) {
  try {
    return await import(`./${deployment}`);
  } catch (e) {
    console.error("Unable to load the given deployment: " + deployment);
    throw e; // Honeycomb cannot proceed with an invalid deployment, halt execution
  }
}
