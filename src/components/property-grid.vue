<template>
  <div class="property-grid">
    <a-row :gutter="16">
      <a-col :span="row.span || 24" v-for="(row, index) of rows" :key="index">
        <div class="data-row">
          <span class="data-label">{{row.label}}</span>
          <span class="data-value">{{row.value}}</span>
        </div>
      </a-col>
      <slot name="endpoint"></slot>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'property-grid',
  props: {
    rows: {
      required: true,
      type: Array,
    },
  },
};
</script>

<style lang="less">
.property-grid {
  .data-row {
    display: flex;
    margin-bottom: 15px;
   
    .data-label {
      margin-right: 15px;
      width: 100px;
      text-align: right;
    }
    .data-value {
      flex: 1;
    }
  }

}
</style>
