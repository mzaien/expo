const fs = require('fs/promises');
const path = require('path');

const { initAsync } = require('./project');

const repoRoot = process.env.EXPO_REPO_ROOT;
const workingDir = path.resolve(repoRoot, '..');
const runtimeVersion = '1.0.0';

/**
 *
 * This generates a project at the location TEST_PROJECT_ROOT,
 * set up to use the latest bits from the current repo source,
 * and set up to test different expo-updates and EAS updates workflows.
 *
 */

function transformAppJson(appJson, projectName, runtimeVersion) {
  return {
    expo: {
      ...appJson.expo,
      name: projectName,
      runtimeVersion,
      updates: {
        ...appJson.expo.updates,
        requestHeaders: {
          'expo-channel-name': 'main',
        },
      },
      android: {
        ...appJson.expo.android,
        package: `com.douglowderexpo.${projectName}`,
      },
      ios: {
        ...appJson.expo.ios,
        bundleIdentifier: `com.douglowderexpo.${projectName}`,
      },
    },
  }
}

(async function () {
  if (
    !process.env.ARTIFACTS_DEST ||
    !process.env.EXPO_REPO_ROOT ||
    !process.env.UPDATES_HOST ||
    !process.env.UPDATES_PORT
  ) {
    throw new Error(
      'Missing one or more environment variables; see instructions in e2e/__tests__/setup/index.js'
    );
  }
  const projectRoot = process.env.TEST_PROJECT_ROOT || path.join(workingDir, 'updates-e2e');
  const localCliBin = path.join(repoRoot, 'packages/@expo/cli/build/bin/cli');
  const runtimeVersion = '1.0.0';
  await initAsync(projectRoot, {
    repoRoot,
    runtimeVersion,
    localCliBin,
    configureE2E: false,
    transformAppJson,
  });
})();
