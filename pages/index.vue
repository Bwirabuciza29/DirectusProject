<template>
  <div>
    <form
      @submit.prevent="submitSubscription"
      class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          v-model="title"
          id="title"
          type="text"
          placeholder="Entrez le titre"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="price" class="block text-sm font-medium text-gray-700">
          Prix
        </label>
        <input
          v-model="price"
          id="price"
          type="number"
          placeholder="Entrez le prix"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="rooms" class="block text-sm font-medium text-gray-700">
          Chambres
        </label>
        <input
          v-model="rooms"
          id="rooms"
          type="number"
          placeholder="Entrez le nombre de chambres"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="bedrooms" class="block text-sm font-medium text-gray-700">
          Chambres à coucher
        </label>
        <input
          v-model="bedrooms"
          id="bedrooms"
          type="number"
          placeholder="Entrez le nombre de chambres à coucher"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="status" class="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          v-model="status"
          id="status"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="option in statusOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="city" class="block text-sm font-medium text-gray-700">
          Ville
        </label>
        <select
          v-model="city"
          id="city"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option
            v-for="option in cityOptions"
            :key="option.id"
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Souscrire
      </button>

      <p v-if="successMessage" class="mt-4 text-green-600 font-medium">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="mt-4 text-red-600 font-medium">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup>
const title = ref("");
const price = ref("");
const rooms = ref("");
const bedrooms = ref("");
const status = ref("");
const city = ref("");

const statusOptions = ref([]);
const cityOptions = ref([]);

const successMessage = ref("");
const errorMessage = ref("");
const { createItems, getItems } = useDirectusItems();

// Récupérer les options depuis Directus
const fetchOptions = async () => {
  try {
    // Récupérer les options de statut
    const statusResponse = await getItems({
      collection: "product",
      params: {
        fields: ["status"],
      },
    });
    statusOptions.value = [
      ...new Set(statusResponse.map((item) => item.status)),
    ];

    // Récupérer les villes
    const cityResponse = await getItems({
      collection: "city",
      params: {
        fields: ["id", "name"],
      },
    });
    cityOptions.value = cityResponse;
  } catch (e) {
    console.error("Erreur lors de la récupération des options :", e);
  }
};

// Appeler fetchOptions au montage du composant
onMounted(() => {
  fetchOptions();
});

const submitSubscription = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const items = [
      {
        title: title.value,
        price: parseFloat(price.value),
        rooms: parseInt(rooms.value),
        bedrooms: parseInt(bedrooms.value),
        status: status.value,
        city: city.value,
      },
    ];
    await createItems({ collection: "product", items });
    successMessage.value = "Enregistré avec succès";
    // Réinitialisation des champs
    title.value = "";
    price.value = "";
    rooms.value = "";
    bedrooms.value = "";
    status.value = "";
    city.value = "";
  } catch (e) {
    if (e?.data?.errors?.[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
      errorMessage.value = "Ce titre existe déjà.";
    } else {
      errorMessage.value = "Une erreur s'est produite.";
    }
  }
};
</script>
