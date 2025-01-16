<template>
  <div class="my-20">
    <div class="mb-10"><bloc /></div>
    <form
      @submit.prevent="submitForm"
      class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <!-- Champ Titre -->
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

      <!-- Champ Prix -->
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

      <!-- Champ Chambres -->
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

      <!-- Champ Chambres à coucher -->
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

      <!-- Champ Status -->
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

      <!-- Champ Ville -->
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

      <!-- Champ Thumbnail (Image) -->
      <div class="mb-4">
        <label for="thumbnail" class="block text-sm font-medium text-gray-700">
          Image (Thumbnail)
        </label>
        <input
          id="thumbnail"
          type="file"
          @change="handleFileChange"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Bouton Soumettre -->
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Soumettre
      </button>

      <!-- Messages -->
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
const thumbnailFile = ref(null);

const statusOptions = ref([]);
const cityOptions = ref([]);

const successMessage = ref("");
const errorMessage = ref("");

const { createItems, getItems } = useDirectusItems();

// Gestion du fichier image
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    thumbnailFile.value = file;
  }
};

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
  } catch (error) {
    console.error("Erreur lors de la récupération des options :", error);
  }
};

// Soumettre le formulaire
const submitForm = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    let thumbnailId = null;

    // Téléverser le fichier si sélectionné
    if (thumbnailFile.value) {
      const formData = new FormData();
      formData.append("file", thumbnailFile.value);

      const response = await fetch("http://localhost:8055/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors du téléversement de l'image.");
      }

      const uploadedFile = await response.json();
      thumbnailId = uploadedFile.data.id;
    }

    const product = {
      title: title.value,
      price: parseFloat(price.value),
      rooms: parseInt(rooms.value),
      bedrooms: parseInt(bedrooms.value),
      status: status.value,
      city: city.value,
      thumbnail: thumbnailId,
    };

    await createItems({ collection: "product", items: [product] });
    successMessage.value = "Enregistré avec succès";

    // Réinitialiser les champs
    title.value = "";
    price.value = "";
    rooms.value = "";
    bedrooms.value = "";
    status.value = "";
    city.value = "";
    thumbnailFile.value = null;
  } catch (error) {
    errorMessage.value = "Une erreur s'est produite lors de la soumission.";
    console.error(error);
  }
};

// Charger les options au montage
onMounted(() => {
  fetchOptions();
});
</script>

