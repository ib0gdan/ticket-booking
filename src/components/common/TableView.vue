<script setup lang="ts" generic="T">
import Loader from './Loader.vue';

export interface Column<T> {
  header?: string;
  key?: keyof T;
  span?: number;
  type?: 'text' | 'image';
  align?: 'left' | 'center' | 'right';
}

defineProps<{
  data: T extends { id: number } ? T[] : never;
  columns: Column<T>[];
  isLoading?: boolean;
  error?: string | null;
}>();
</script>

<template>
  <div class="w-full min-w-2xl">
    <div
      class="grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 mb-6 text-sm font-medium text-gray-500 uppercase tracking-wider"
    >
      <div
        v-for="(col, index) in columns"
        :key="index"
        class="flex items-center"
        :style="{ gridColumn: `span ${col.span || 1} / span ${col.span || 1}` }"
        :class="{
          'text-left': !col.align || col.align === 'left',
          'text-center': col.align === 'center',
          'text-right': col.align === 'right',
        }"
      >
        {{ col.header }}
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader />
    </div>

    <div v-else-if="error" class="text-red-500 py-4">Ошибка: {{ error }}</div>

    <div v-else-if="data.length === 0" class="text-gray-500 py-4 text-center">Нет данных</div>

    <div v-else class="space-y-6">
      <div v-for="item in data" :key="item.id" class="grid grid-cols-12 gap-4 items-center group">
        <div
          v-for="(col, colIndex) in columns"
          :key="colIndex"
          class="flex items-center"
          :style="{ gridColumn: `span ${col.span || 1} / span ${col.span || 1}` }"
          :class="{
            'text-left': !col.align || col.align === 'left',
            'text-center': col.align === 'center',
            'text-right': col.align === 'right',
          }"
        >
          <slot
            v-if="$slots[`cell-${String(col.key)}`]"
            :name="`cell-${String(col.key)}`"
            :item="item"
            :value="col.key ? item[col.key] : undefined"
          />

          <template v-else>
            <div
              v-if="col.type === 'image'"
              class="h-16 w-12 overflow-hidden rounded-md bg-gray-100 shrink-0 justify-center"
            >
              <img
                v-if="col.key && item[col.key]"
                :src="String(item[col.key])"
                :alt="String(col.header)"
                class="h-full w-full object-cover object-center"
              />
            </div>
            <span
              v-else
              :class="colIndex === 0 ? 'text-lg font-medium text-gray-900' : 'text-gray-600'"
            >
              {{ col.key ? item[col.key] : '' }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
