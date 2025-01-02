<template>
    <div class="externalLinkIcon" :style="externalIconStyle">
        <span class="svgContainer" @click="goToLink(iconlink)">
            <SvgIcon :name="iconName" :icon-style="iconStyle"></SvgIcon>
        </span>
        <span class="svgBG"></span>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
defineProps({
    iconStyle: {
        type: Object,
        default: () => {
            return {
                width: '25px',
                height: '25px'
            };
        }
    },
    iconName: {
        type: String,
        default: () => {
            return '';
        }
    },
    iconlink: {
        type: String,
        default: () => {
            return '';
        }
    },
    externalIconStyle: {
        type: Object,
        default: () => {
            return {
                width: '45px',
                height: '45px'
            };
        }
    }
});
const goToLink = (link: string) => {
    window.open(link);
};
</script>
<style scoped lang="scss">
@import './index';
</style>
