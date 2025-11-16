<script lang="ts">
    import TripDetails from "$lib/components/TripDetails.svelte";
    import {trips} from "$lib/constants/tripsData.js";
    const trip = trips[0]
</script>

<main>

    <TripDetails {...trip}/>
</main>
<style>
    main{
        max-width:400px;
        margin-top: 2rem;
        border-radius: 20px;
        overflow: hidden;
        width: 100%;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }
   
</style>