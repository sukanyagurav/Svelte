<script>
  import imgSrc from '$lib/assets/rocket.png';
</script>

<main>
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

<style>
  .logo {
    margin-bottom: 1.2rem;
    background-color: #1d222c;
    padding: 1rem;
    border-radius: 100%;
    width: 100px;
    height: 100px;
    margin-inline: auto;
  }
  .logo_img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  main {
    background-color: #232832;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    color: white;
  }
  .w-sm {
    max-width: 300px;
  }
  .gap-lg {
    gap: 1.5rem;
  }
  .flex-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 1.5rem;
  }
  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: inherit;
  }
  .btn-pro {
    padding: 0.75rem 1rem;
    border-radius: 100px;
    border: none;
    background-color: white;
    color: black;
  }
  .promotion-details {
    background-color: #1d222c;
    padding: 1.5rem;
    border-radius: 5px;
    color: rgb(215, 211, 211);
    margin-top: 1rem;
  }
  .price {
    margin-top: 0.8rem;
  }
  .price,
  p {
    font-size: 0.9rem;
    line-height: 1.4;
    font-weight: normal;
  }
  .cancel:hover {
    color: grey;
  }
</style>
