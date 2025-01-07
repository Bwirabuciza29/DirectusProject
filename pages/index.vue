<template>
  <div>
    <Nuxtdirectus />
    <form
      @submit.prevent="submitSubscription"
      class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">
          Adresse email
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Entrez votre email"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
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
import { ref } from "vue";
const email = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const { createItems } = useDirectusItems();

const submitSubscription = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!validateEmail(email.value)) {
    errorMessage.value = "Veuillez entrer une adresse email valide.";
    return;
  }

  try {
    const items = [{ email: email.value }];
    await createItems({ collection: "subscription", items });
    successMessage.value = "Vous êtes bien inscrit à la newsletter !";
    // Réinitialise le champ email
    email.value = "";
  } catch (e) {
    if (e?.data?.errors?.[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
      errorMessage.value = "Cet email est déjà enregistré.";
    } else {
      errorMessage.value =
        "Une erreur inattendue est survenue. Veuillez réessayer plus tard.";
      console.error("Erreur : ", e);
    }
  }
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
</script>
