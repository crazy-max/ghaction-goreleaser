import * as os from 'os';
import * as core from '@actions/core';

export const osPlat: string = os.platform();
export const osArch: string = os.arch();

export interface Inputs {
  distribution: string;
  version: string;
  args: string;
  workdir: string;
  installOnly: boolean;
}

export async function getInputs(): Promise<Inputs> {
  return {
    distribution: core.getInput('distribution') || 'goreleaser',
    version: core.getInput('version') || 'latest',
    args: core.getInput('args'),
    workdir: core.getInput('workdir') || '.',
    installOnly: core.getBooleanInput('install-only')
  };
}
