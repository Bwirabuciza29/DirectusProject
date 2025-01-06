<template>
  <div class="max-w-4xl mx-auto p-7 rounded-lg shadow-lg">
    <!-- Titre principal -->
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
      Liste des produits
    </h1>

    <!-- Liste des produits en grille -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="relative p-6 border transform transition-transform duration-300"
      >
        <!-- Image du produit -->
        <div class="mb-4">
          <img
            :src="`http://localhost:8055/assets/${produit.thumbnail}`"
            alt="Image du produit"
            class="w-full h-48 object-cover"
          />
        </div>

        <!-- Détails du produit -->
        <h2 class="text-lg font-semibold text-gray-800 mb-2">
          {{ produit.title }}
        </h2>
        <p class="text-gray-500 text-sm mb-4">{{ produit.city.name }}</p>

        <!-- Bloc des détails sous forme d'icônes -->
        <div class="space-y-4 mt-4">
          <div class="flex items-center">
            <i class="fas fa-tag text-blue-500 mr-2 text-xl"></i>
            <span class="font-semibold text-gray-900"
              >{{ produit.price }} $</span
            >
          </div>

          <div class="flex items-center">
            <i class="fas fa-bed text-green-500 mr-2 text-xl"></i>
            <span class="text-sm">{{ produit.bedrooms }} chambres</span>
          </div>

          <div class="flex items-center">
            <i class="fas fa-cogs text-yellow-500 mr-2 text-xl"></i>
            <span class="text-sm">{{ produit.rooms }} pièces</span>
          </div>

          <div class="flex items-center">
            <i class="fas fa-calendar-alt text-purple-500 mr-2 text-xl"></i>
            <span class="text-sm"
              >Créé le : {{ formatDate(produit.date_created) }}</span
            >
          </div>

          <div class="flex items-center">
            <i class="fas fa-flag-checkered text-gray-500 mr-2 text-xl"></i>
            <span class="text-sm">{{ produit.status }}</span>
          </div>
        </div>

        <!-- Icône flottante en arrière-plan -->
        <i
          class="fa-solid fa-box text-6xl text-gray-200 opacity-20 absolute bottom-4 right-4"
        ></i>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import apiClient from "~/utils/axios";
// Reactive variables
const produits = ref([]);
const loading = ref(true);
// Function to format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
// Fetch data
onMounted(async () => {
  try {
    const response = await apiClient.get("/items/product");
    produits.value = response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");
</style>