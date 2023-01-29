import {describe, expect, it} from '@jest/globals';
import * as github from '../src/github';

describe('getRelease', () => {
  it('returns latest GoReleaser GitHub release', async () => {
    const release = await github.getRelease('goreleaser', 'latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v0.182.0 GoReleaser GitHub release', async () => {
    const release = await github.getRelease('goreleaser', 'v0.182.0');
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v0.182.0');
  });

  it('returns v0.182.1 GoReleaser GitHub release', async () => {
    const release = await github.getRelease('goreleaser', '~> 0.182');
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v0.182.1');
  });

  it('unknown GoReleaser release', async () => {
    await expect(github.getRelease('goreleaser', 'foo')).rejects.toThrowError(
      new Error('Cannot find GoReleaser release foo in https://goreleaser.com/static/releases.json')
    );
  });

  it('returns latest GoReleaser Pro GitHub release', async () => {
    const release = await github.getRelease('goreleaser-pro', 'latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v0.182.0 GoReleaser Pro GitHub release', async () => {
    const release = await github.getRelease('goreleaser-pro', 'v0.182.0');
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v0.182.0-pro');
  });

  it('returns v0.182.1 GoReleaser Pro GitHub release', async () => {
    const release = await github.getRelease('goreleaser-pro', '~> 0.182');
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v0.182.1-pro');
  });

  it('unknown GoReleaser Pro release', async () => {
    await expect(github.getRelease('goreleaser-pro', 'foo')).rejects.toThrowError(
      new Error('Cannot find GoReleaser release foo-pro in https://goreleaser.com/static/releases-pro.json')
    );
  });
});
