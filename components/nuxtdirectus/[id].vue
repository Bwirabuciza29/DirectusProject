<template>
  <div class="container mx-auto py-8">
    <div v-if="!product && !error" class="flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"
      ></div>
    </div>

    <div v-if="product" class="bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Image du produit -->
      <div class="relative h-64">
        <img
          :src="`http://localhost:8055/assets/${product.thumbnail}`"
          alt="Image du produit"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
        ></div>
        <h2
          class="absolute bottom-4 left-4 text-white text-2xl font-semibold z-10"
        >
          {{ product.title }}
        </h2>
      </div>

      <!-- Détails du produit -->
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ product.title }}</h2>
        <p class="text-gray-600 font-bold mt-4">
          Prix : <span class="text-green-500">${{ product.price }}</span>
        </p>
        <p class="text-sm text-gray-500 mt-2">
          <i class="fas fa-calendar-alt text-yellow-500"></i>
          Créé le : {{ formatDate(product.date_created) }}
        </p>
        <p class="text-sm text-gray-500 mt-2">
          <i class="fas fa-calendar-check text-green-500"></i>
          Mis à jour : {{ formatDate(product.date_updated) }}
        </p>
        <p
          class="text-sm mt-4 py-1 px-3 rounded-full inline-block"
          :class="{
            'bg-green-100 text-green-600': product.status === 'active',
            'bg-red-100 text-red-600': product.status === 'inactive',
          }"
        >
          Status : {{ product.status }}
        </p>

        <!-- Description -->
        <p class="text-gray-700 mt-6">{{ product.description }}</p>
      </div>
    </div>

    <!-- Gestion des erreurs -->
    <p v-if="error" class="text-center text-red-600 font-semibold mt-8">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </p>
  </div>
</template>

<script setup>
const product = ref(null);
const error = ref(null);
const route = useRoute();

onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    const directusUrl = config.public.directus.url;
    const productId = route.params.id;

    const response = await fetch(`${directusUrl}/items/product/${productId}`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération du produit.");
    const data = await response.json();
    product.value = data.data;
  } catch (err) {
    error.value = err.message;
  }
});

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");
</style>
