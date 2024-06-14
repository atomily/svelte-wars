import { getRecord, setRecord } from "./db";
import type { TPlanet, TSwapiApiResponse } from "./types";

const API_URL = 'https://swapi.dev/api';

// this endpoint is used on the actual table page
export const GetPlanets = async (cursor: number = 1): Promise<TSwapiApiResponse<TPlanet>> => {
    try {
        // check to see if the cached version exists already
        const cacheKey = `planets-page-${cursor.toString()}`;
        const cache = await getRecord('planets', cacheKey);

        if (cache) {
            return cache as TSwapiApiResponse<TPlanet>;
        }

        const response = await fetch(`${API_URL}/planets/?page=${cursor.toString()}`, {
            headers: {
                'content-type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        
        const data: TSwapiApiResponse<TPlanet> = await response.json();

        // store it in the cache for future use
        await setRecord('planets', cacheKey, data);

        // this will store each planet into its own key so we can use it to look up later on
        // since we're going to do a multipage app for seo purposes & better ux, we can use this
        // to improve load times
        for (let x = 0; x < data.results.length; x++) {
            const planet = data.results[x];
            const key = `planet-${planet.url.split('/planets/')[1].split('/')[0]}`;
            const planetCache = await getRecord('planets', key);

            if (!planetCache) {
                await setRecord('planets', key, planet);
            }
        };

        return data;
    } catch (error: any) {
        throw new Error(error);
    };
};