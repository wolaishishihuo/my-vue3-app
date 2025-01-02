<template>
    <template v-for="instance in instances" :key="instance.id">
        <Suspense>
            <component :is="instance.component?.default" v-model:visible="instance.visible" v-bind="processAttributes(instance)" />
            <template #fallback>
                <div class="flex items-center justify-center min-h-[200px]">
                    <el-spinner />
                </div>
            </template>
        </Suspense>
    </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useModal } from '@/hooks/useModal';

defineOptions({
    inheritAttrs: false
});

const { modalInstances, attributeProcessor } = useModal();

const instances = computed(() => Array.from(modalInstances.value.values()));

const processAttributes = instance => {
    const eventAttrs = attributeProcessor.processEvents(instance.component);
    const propAttrs = attributeProcessor.processProps(instance.component);
    return {
        ...eventAttrs,
        ...propAttrs,
        ...instance.attrs
    };
};
</script>

<style scoped lang="scss"></style>
