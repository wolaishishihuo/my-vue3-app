<template>
    <div class="header-member">
        <el-avatar :size="25" :src="avatarUrl" class="avatar" />
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user';
import { computed } from 'vue';
const userStore = useUserStore();
const avatarUrl = computed(() => userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
</script>
<style scoped lang="scss">
.header-member {
    cursor: pointer;
}
</style>
