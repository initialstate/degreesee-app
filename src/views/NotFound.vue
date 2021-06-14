<template>
  <div class="NotFound">
    <h1>{{ title }}</h1>
    <p> {{ msg }}

    </p>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data: function () {
    return {
      title: 'Hmmm... something went wrong.',
      msg: 'This is not the page you were looking for.'
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}
</style>
