<script lang='ts'>
	import { onMount } from "svelte";
    import type { TResident } from "$lib/utility/types";
	import { GetResident } from "$lib/utility/api";

    export let population: string[];
	let residents: TResident[] = [];

	const getResident = async (id: string): Promise<TResident | null> => {
		try {
			const result = await GetResident(id);

			return result;
		} catch (err) {
			return null;
		}
	};

	onMount(async () => {
    	const newResidents: TResident[] = [];

		for (let i = 0; i < population.length; i++) {
			const result = await getResident(population[i].split('/people/')[1].split('/')[0]);

			if (result !== null) {
				newResidents.push(result);
			}
   		}

    	residents = newResidents;
	});
</script>

<div class='table-container'>
	<div class='residents'>
		{#each residents as resident}
			<div class='citizen'>
				<p>{resident.name}</p>
			</div>
		{/each}
	</div>
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

	.residents {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
    }

	.residents .citizen {
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
    }
</style>