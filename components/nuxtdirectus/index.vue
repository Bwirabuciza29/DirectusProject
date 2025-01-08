<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-4xl font-extrabold text-center mb-12 text-blue-600">
      Produits
    </h1>

    <!-- Effet de chargement -->
    <div
      v-if="!products.length && !error"
      class="flex justify-center items-center h-64"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"
      ></div>
    </div>

    <!-- Affichage des produits -->
    <div
      v-if="products.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        <!-- NuxtLink pour rediriger vers la page [id].vue -->
        <nuxt-link :to="`/${product.id}`" class="absolute inset-0"></nuxt-link>

        <!-- Image du produit -->
        <div class="relative h-56 bg-gray-100">
          <img
            :src="`http://localhost:8055/assets/${product.thumbnail}`"
            alt="Image du produit"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
          ></div>
          <h2
            class="absolute bottom-4 left-4 text-white text-lg font-semibold z-10"
          >
            {{ product.title }}
          </h2>
        </div>

        <!-- Détails du produit -->
        <div class="p-6">
          <h2
            class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2"
          >
            <i class="fas fa-tag text-blue-500"></i>
            {{ product.title }}
          </h2>
          <p class="text-gray-600 font-medium text-lg mb-4">
            Prix : <span class="text-green-500">${{ product.price }}</span>
          </p>
          <p class="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <i class="fas fa-calendar-alt text-yellow-500"></i>
            Créé le : {{ formatDate(product.date_created) }}
          </p>
          <p class="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <i class="fas fa-calendar-check text-green-500"></i>
            Mis à jour : {{ formatDate(product.date_updated) }}
          </p>

          <!-- Statut et Ville -->
          <div class="flex items-center justify-between">
            <p
              class="text-sm py-1 px-4 rounded-full font-medium"
              :class="{
                'bg-green-100 text-green-600': product.status === 'published',
                'bg-red-100 text-red-600': product.status === 'draft',
              }"
            >
              {{ product.status }}
            </p>
            <p class="text-sm text-gray-600 flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-red-500"></i>
              {{ product.city }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gestion des erreurs -->
    <div v-if="error" class="text-center mt-12">
      <p class="text-red-600 font-semibold text-lg">
        <i class="fas fa-exclamation-triangle"></i> {{ error }}
      </p>
    </div>
  </div>
</template>
<script setup>
const products = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    const directusUrl = config.public.directus.url;

    // Inclure les données de la relation `city`
    const response = await fetch(
      `${directusUrl}/items/product?fields=*,city.name`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des produits.");
    const data = await response.json();
    products.value = data.data;
  } catch (err) {
    error.value = err.message;
  }
});

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const localeDate = new Date(date).toLocaleDateString("fr-FR", options);
  return localeDate.replace(", ", " à ");
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");
</style>
