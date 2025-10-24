<script lang="ts">
    import TripDetails from "$lib/components/TripDetails.svelte";
    import {trips} from "$lib/constants/tripsData.js";
    const trip = trips[0]
</script>

<TripDetails {...trip}/>