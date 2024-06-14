<script lang='ts'>
    import Header from '$lib/components/Header.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import PlanetTable from '$lib/components/PlanetTable.svelte';
</script>

<div class='container'>
    <Logo />
    <Header
        title='Discover Planets'
    />
    <PlanetTable />
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
</style>