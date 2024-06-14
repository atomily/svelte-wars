<script lang='ts'>
    import { onMount } from 'svelte';
    import { GetPlanets } from '$lib/utility/api';
    import type { TPlanet } from '$lib/utility/types';

    let planets: TPlanet[] = [];
    let cursor: number = 1;
    let total: number = 1;
    let error: string | null = null;

    const getPlanets = async (page: number) => {
        try {
            const data = await GetPlanets(page);

            planets = data.results;
            cursor = page;
            total = Math.ceil(data.count / 10);
        } catch (err: any) {
            error = err.message;
        } 
    };

    onMount(() => {
        getPlanets(cursor);
    });

    $: console.log(planets);
</script>

<p>planet todo</p>