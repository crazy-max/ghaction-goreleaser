import * as httpm from '@actions/http-client';
import * as core from '@actions/core';
import * as semver from 'semver';
import * as pro from './pro';

export interface GitHubRelease {
  id: number;
  tag_name: string;
}

export const getRelease = async (version: string): Promise<GitHubRelease | null> => {
  const resolvedVersion: string = (await resolveVersion(version)) || version;
  const url: string = `https://github.com/goreleaser/${pro.distribution()}/releases/${resolvedVersion}`;
  const http: httpm.HttpClient = new httpm.HttpClient('goreleaser-action');
  return (await http.getJson<GitHubRelease>(url)).result;
};

const resolveVersion = async (version: string): Promise<string | null> => {
  const allTags: Array<string> | null = await getAllTags();
  if (!allTags) {
    throw new Error(`Cannot find GoReleaser tags`);
  }
  core.debug(`Found ${allTags.length} tags in total`);

  if (version === 'latest' || !pro.isPro()) {
    return semver.maxSatisfying(allTags, version);
  }

  const cleanTags: Array<string> = allTags.map(tag => cleanTag(tag));
  const cleanVersion: string = cleanTag(version);
  return semver.maxSatisfying(cleanTags, cleanVersion) + pro.suffix();
};

interface GitHubTag {
  tag_name: string;
}

const getAllTags = async (): Promise<Array<string>> => {
  const http: httpm.HttpClient = new httpm.HttpClient('goreleaser-action');
  const suffix: string = pro.suffix();
  const url: string = `https://goreleaser.com/static/releases${suffix}.json`;
  const getTags = http.getJson<Array<GitHubTag>>(url);

  return getTags.then(response => {
    if (response.result == null) {
      return [];
    }

    return response.result.map(obj => obj.tag_name);
  });
};

const cleanTag = (tag: string): string => {
  return tag.replace(/-pro$/, '');
};
