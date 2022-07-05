<script lang="ts">
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
</script>

<div class="mask">
  <LoadingSpinner />
</div>

<style lang="scss">
  .mask {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;
    background-color: #fff;
    z-index: 99;
  }
</style>
