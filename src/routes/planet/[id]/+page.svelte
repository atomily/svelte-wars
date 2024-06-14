<script lang='ts'>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { TPlanet } from '$lib/utility/types';
    import { GetPlanet } from '$lib/utility/api';
    import Header from '$lib/components/Header.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import ResidentTable from '$lib/components/ResidentTable.svelte';

    let planet: TPlanet | undefined = undefined;
    let error: string | null = null;
    let displayError: boolean = false;

    const getPlanet = async () => {
        try {
            const data = await GetPlanet($page.url.pathname.split('/planet/')[1]);

            planet = data;
        } catch (err: any) {
            error = err.message;
        }
    }

    const goBack = () => goto('/');
    
    const toggleErrorDisplay = () => displayError = !displayError;

    onMount(() => getPlanet());
</script>

<div class='container'>
    <Logo />
    {#if error}
        {#if displayError}
            <p class='error-text'>{error}</p>
            <button class='error' on:click={toggleErrorDisplay}>Hide Error</button>
        {:else}
            <p class='error-text'>Uh Oh, the API blew up...</p>
            <button class='error' on:click={toggleErrorDisplay}>Show Error</button>
        {/if}
    {:else}
        {#if planet === undefined}
            <Header title='Loading' />
        {:else}
            <Header title={`${planet.name} (${planet.residents.length ?? 0})`} />
            <ResidentTable population={planet.residents} />
        {/if}
    {/if}
    <button on:click={goBack}>Go Back</button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 60rem;
        align-items: center;
        justify-content: center;
        margin: 1rem auto;
    }

    @media screen and (max-width: 48rem) {
        .container {
            max-width: 90%;
        }
    }

    .container button {
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
        margin-top: 1rem;
    }

    .container button:hover {
        opacity: .8;
        transition: .2s ease opacity;
    }

    .container button:active {
        opacity: .6;
        transition: .2s ease opacity;
    }

    .container button:disabled {
        opacity: .4;
        cursor: not-allowed;
    }
</style>