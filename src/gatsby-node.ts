import fetch from 'node-fetch';
import { createFileNodeFromBuffer } from 'gatsby-source-filesystem';
import { FitbitNode } from './nodes';
import { PluginOptions } from './types/plugin-options';
import { fitbitGetUserData } from './fitbit-api';

const referenceRemoteFile = async (
    id: string,
    url: string,
    { cache, createNode, createNodeId, touchNode, store },
) => {
    const cachedResult = await cache.get(url);

    if (cachedResult) {
        touchNode({ nodeId: cachedResult });
        return { localFile___NODE: cachedResult };
    }

    const testRes = await fetch(url);

    if (!testRes.ok) {
        console.warn(`[${id}] Image could not be loaded. Skipping...`);
        return null;
    }

    const fileNode = await createFileNodeFromBuffer({
        buffer: await testRes.buffer(),
        store,
        cache,
        createNode,
        createNodeId,
        name: id.replace(/[^a-z0-9]+/gi, '-'),
        ext: '.jpg',
    });

    if (fileNode) {
        cache.set(url, fileNode.id);
        return { localFile___NODE: fileNode.id };
    }

    return null;
};

export const sourceNodes = async (
    { actions, createNodeId, store, cache },
    pluginOptions: PluginOptions,
) => {
    const { createNode, touchNode } = actions;
    const helpers = { cache, createNode, createNodeId, store, touchNode };

    const fitbitResults = await fitbitGetUserData(
        pluginOptions
    );

    await createNode(
                FitbitNode({
                    imdbId: `${fitbitResults.imdbId}`,
                    title: `${fitbitResults.title}`,
                    plot: `${fitbitResults.plot}`,
                    type: `${fitbitResults.type}`,
                    imdbRating: `${fitbitResults.imdbRating}`,
                    poster:
                        fitbitResults.poster
                            ? await referenceRemoteFile(
                                fitbitResults.poster.toString(),
                                fitbitResults.poster.toString(),
                                helpers,
                            )
                            : null,
                }),
            );
            return;
        };
