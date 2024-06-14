<script lang='ts'>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { GetPlanets } from '$lib/utility/api';
    import type { TPlanet } from '$lib/utility/types';

    const skeletonItems = Array(10).fill(0).map((_, i) => i + 1);

    let planets: TPlanet[] = [];
    let cursor: number = 1;
    let total: number = 1;
    let error: string | null = null;
    let displayError: boolean = false;

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

    const redirect = (id: string) => {        
        goto(`/planet/${id}`);
    }

    const next = () => {
        if (cursor >= total) {
            return;
        };

        getPlanets(cursor + 1);
    };

    const prev = () => {
        if (cursor < 1) {
            return;
        };

        getPlanets(cursor - 1);
    };

    const toggleErrorDisplay = () => displayError = !displayError;

    onMount(() => {
        getPlanets(cursor);
    });
</script>

<div class='table-container'>
    {#if error}
        {#if displayError}
            <p class='error-text'>{error}</p>
            <button class='error' on:click={toggleErrorDisplay}>Hide Error</button>
        {:else}
            <p class='error-text'>Uh Oh, the API blew up...</p>
            <button class='error' on:click={toggleErrorDisplay}>Show Error</button>
        {/if}
    {:else if planets.length === 0}
        <div class='skeleton'>
            {#each skeletonItems as _}
                <div class='skeleton-item' />
            {/each}
        </div>
    {:else}
        <div class='planets'>
            {#each planets as planet}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class='planet' on:click={() => redirect(planet.url.split('/planets/')[1].split('/')[0])}>
                    <p class='name'>{planet.name} <span class='population'>(Population: {planet.residents.length})</span></p>
                    <p class='link'>View More</p>
                </div>
            {/each}
        </div>
        <div class='controls'>
            <button on:click={prev} disabled={cursor === 1}>Previous</button>
            <p class='page'>{cursor}/{total}</p>
            <button on:click={next} disabled={cursor === total}>Next</button>
        </div>
    {/if}
</div>

<style>
    .table-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 2rem auto;
        justify-content: center;
        align-items: center;
        justify-items: center;
        background: #0a0a0a;
        border: 1px solid #202020;
        padding: 1rem;
        border-radius: .5rem;
    }

    .table-container .error-text {
        color: #fff;
        font-weight: bold;
        margin-bottom: 1rem;
        letter-spacing: 0.05rem;
    }

    .table-container .error {
        color: #f7575a;
        background: rgba(247, 87, 90, .15);
        padding: .5rem 1rem;
        border-radius: .5rem;
        font-weight: bold;
        outline: none;
        border: none;
        cursor: pointer;
    }

    .skeleton {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
    }

    .skeleton .skeleton-item {
        background: #202020;
        width: 100%;
        height: 3rem;
        border-radius: .5rem;
    }

    .planets {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
    }

    .planets .planet {
        display: flex;
        width: calc(100% - 2rem);
        flex-direction: row;
        justify-content: start;
        align-items: center;
        justify-items: center;
        color: white;
        background: #202020;
        border: 1px solid #202020;
        border-radius: .5rem;
        padding: .5rem 1rem;
        cursor: pointer;
        opacity: 1;
        transition: .2s ease opacity;
    }

    .planets .planet:hover {
        opacity: .8;
        transition: .2s ease opacity;
    }

    .planets .planet:active {
        opacity: .6;
        transition: .2s ease opacity;
    }

    .planets .planet .name {
        color: white;
        font-weight: bold;
        letter-spacing: 0.05rem;
        font-size: 1rem;
        user-select: none;
    }

    .planets .planet .population {
        color: #e5e5e5;
        font-size: .75rem;
    }

    .planets .planet .link {
        margin-left: auto;
        font-weight: medium;
        color: #FFE81F;
        font-size: .75rem;
        background: rgb(255, 232, 31, .15);
        padding: .5rem 1rem;
        border-radius: .5rem;
        user-select: none;
    }

    .controls {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        width: 100%;
        margin-top: 1rem;
        justify-items: center;
        align-items: center;
        gap: 1rem;
    }

    .controls button {
        background: white;
        outline: none;
        border: 0;
        border-radius: .5rem;
        padding: .5rem 1rem;
        font-weight: bold;
        letter-spacing: 0.05rem;
        font-size: .85rem;
        opacity: 1;
        transition: .2s ease opacity;
    }

    .controls button:hover {
        opacity: .8;
        transition: .2s ease opacity;
    }

    .controls button:active {
        opacity: .6;
        transition: .2s ease opacity;
    }

    .controls button:disabled {
        opacity: .4;
        cursor: not-allowed;
    }

    .controls .page {
        text-align: center;
        font-size: 1rem;
        color: white;
        letter-spacing: 0.05rem;
    }
</style>