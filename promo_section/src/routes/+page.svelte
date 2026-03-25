<script>
  import imgSrc from '$lib/assets/rocket.png';
  import './+page.css';
</script>

<main class="promo">
  <div class="card">
    <div class="logo">
      <img
        src={imgSrc}
        alt=""
        class="logo_img"
      />
    </div>
    <div class="card-content flex-col gap-lg">
      <h1 class="title">Ready to start?</h1>
      <p class="w-sm">
        Start learning React and Swift with zero coding experience.
      </p>
      <button class="btn-pro"> Get pro for 50% </button>
      <div class="promotion-details flex-col">
        <span>Special promotion price</span>
        <h2 class="price">$4.50 per month billed annually.</h2>
        <p>
          Over 70 hours of course content. <button class="cancel"
            >Cancel anytime</button
          >
        </p>
      </div>
    </div>
  </div>
</main>