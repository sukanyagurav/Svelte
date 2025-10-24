<script>
  let { name, imgSrc, description, place, location, reviews, id } = $props();
  const reviewsCount = reviews.length - 6
</script>

<div class="trip-details">
  <header>
    <button aria-label="back">
      <i class="fa-solid fa-chevron-left text-xl text-slate-100"></i>
    </button>
    <h1>{name}</h1>
  </header>

  <main>
    <div>
      <img
        src={imgSrc}
        alt={name}
      />
      <button> Tap to view Image </button>
    </div>
    <div>
      <h2>{name}</h2>
      <p><span>{place} in {location}</span></p>
    </div>

    <p>{description}</p>
    <div>
        <div>
            {#each reviews as review}
               <img src={review.imgSrc} alt={review.name}>
            {/each}
        </div>
        <div>
           <p> {reviewsCount > 0 ? `+${reviewsCount} users` : `${reviews.length} users`} </p>
           <span>visited this place</span>
        </div>
    </div>
    <button>Book a Trip</button>
  </main>
</div>
