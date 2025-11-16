<script>
  let { name, imgSrc, description, place, location, reviews, id } = $props();
  const reviewsCount = reviews.length - 6;
  console.log(reviewsCount);
</script>

<div class="trip">
  <header class="flex-row">
    <button aria-label="back">
      <i class="fa-solid fa-chevron-left text-xl text-slate-100"></i>
    </button>
    <h1>{name}</h1>
  </header>

  <main>
    <div class="trip-image-container">
      <img
        src={imgSrc}
        alt={name}
        class="trip-image"
      />
      <button class="transparent-btn"> Tap to view Image </button>
    </div>
    <div class="trip-name">
      <h2>{name}</h2>
      <p>
        <i class="fa-solid fa-location-dot"></i><span
          >{place} in {location}</span
        >
      </p>
    </div>
    <div class="trip-details">
      <p class="description">{description}</p>
      <div class="flex-row">
        <div class="reviews flex-row">
          {#each [...reviews.slice(0,6)] as review}
            <img
              src={review.reviewImageSrc}
              alt={review.name}
              class="review-user-image"
            />
          {/each}
        </div>
        <div class="reviews-count">
          <p>
            {reviewsCount > 0
              ? `+${reviewsCount} users`
              : `${reviews.length} users`}
          </p>
          <span>visited this place</span>
        </div>
      </div>
      <button class="book-btn">Book a Trip</button>
    </div>
  </main>
</div>

<style>
  header {
    padding: 1rem 2rem;
    background-color: #89b4e3;
  }
  header button {
    background: transparent;
  }
  h1 {
    font-size: 1.2rem;
    text-align: center;
    flex: 1;
    font-weight: 300;
  }
  .trip-image {
    width: 110%;
    height: 230px;
  }
  .trip-image-container {
    position: relative;
  }
  .transparent-btn {
    padding: 0.5rem 1rem;
    position: absolute;
    border-radius: 30px;
    bottom: 2rem;
    right: 2rem;
    background-color: rgba(230, 229, 229, 0.419);
  }
  .trip-name {
    background-color: #29313c;
    padding: 1rem 2rem;
  }
  .trip-name h2 {
    font-size: 1.1rem;
    font-weight: 500;
  }
  .trip-name p {
    font-size: 0.75rem;
    color: rgb(200, 198, 198);
  }
  .trip-details {
    background-color: #303946;
    padding: 1rem 2rem;
  }
  .book-btn {
    padding: 1rem;
    border-radius: 30px;
    background-color: #89b4e3;
    text-transform: uppercase;
    width: 100%;
    margin: 2rem 0 1em;
  }
  .trip-details .description {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  .review-user-image {
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }
  .reviews .review-user-image:not(:first-child) {
    margin-left: -23px;
  }
  .reviews-count {
       margin-left: 0.8rem;
  }
  .reviews-count p{
    font-weight: 600;
    color: #89b4e3;
  }
  
</style>
