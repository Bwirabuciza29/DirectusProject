<template>
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
      @click="submitSubscription"
      class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Souscrire
    </button>
  </form>
</template>
<script setup>
const email = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const { createItems } = useDirectusItems();

const submitSubscription = async () => {
  try {
    var items = [
      {
        email: email.value,
      },
    ];
    await createItems({ collection: "subscription", items });
  } catch (e) {
    if (e.data.errors[0].extensions.code == "RECORD_NOT_UNIQUE") {
      console.log("Not unique");
    }
  }
};
</script>
