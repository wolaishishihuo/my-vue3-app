<template>
    <div>
        <el-button type="primary" round>添加课件</el-button>
        <el-button round @click="addFolder">新建文件夹</el-button>
    </div>
    <div>全部文件</div>
    <section>
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="item of breadList">
                <span @click="toPath(item)">{{ item.name }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="data" @cell-dblclick="handleCellEnter" @cell-mouse-leave="handleCellLeave" @row-click="rowClick">
            <el-table-column type="selection" width="55" />
            <el-table-column label="文件名" prop="projectname">
                <template #default="scope">
                    <el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.projectname" />
                    <el-link v-else>{{ scope.row.projectname }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="创建者" prop="username"> </el-table-column>
        </el-table>
    </section>
</template>

<script setup lang="ts" name="courseware">
import { ArrowRight } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/modules/auth';
import { useRoute, useRouter } from 'vue-router';

import { onMounted, reactive, ref, watch } from 'vue';
const route = useRoute();
const router = useRouter();
//面包屑逻辑，初始为全部，点击哪个就把点击及其后面的全部删除
const breadList = ref([
    {
        id: 'all',
        name: '全部',
        path: '/courseware/all/全部',
        disabled: true
    }
]);
const toPath = target => {
    if (target.disabled) return;
    router.push({ path: `/courseware/${target.id}/${target.name}` });
};
const processBreadList = clickedNode => {
    debugger;
    let temp = breadList.value.filter(elem => {
        return elem.id == clickedNode.id;
    });
    if (temp && temp.length > 0) {
        //先查有没有，有说明就删除他后面的
        let i;
        for (i = 0; i < breadList.value.length; i++) {
            if (breadList.value[i].id == clickedNode.id) {
                breadList.value[i].disabled = true;
                break;
            }
        }
        breadList.value.splice(i + 1);
    } else {
        breadList.value[breadList.value.length - 1].disabled = false;
        breadList.value.push({
            id: clickedNode.id,
            name: clickedNode.path,
            path: '/courseware/' + clickedNode.id,
            disabled: true
        });
    }
};

onMounted(() => {
    let id = route.params.id;
    data.value = auth.getFolderList(id);
});

watch(
    () => route.params,
    newPath => {
        data.value = auth.getFolderList(newPath.id);
        //查看路由里的路径，然后push进去，为了防止名称重复，使用id来区分
        processBreadList(newPath);
    }
);

const data = ref([]);
const auth = useAuthStore();

const handleCellEnter = (row: any, column: any, cell: any, event: any) => {
    row.isEdit = true;
};

const handleCellLeave = (row: any, column: any, cell: any, event: any) => {
    row.isEdit = false;
};

const rowClick = (row: any, column: any, cell: any, event: any) => {
    router.push({ path: `/courseware/${row.id}/${row.projectname}` });
};

//都能用一个hooks来处理
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
