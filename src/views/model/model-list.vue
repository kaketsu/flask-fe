<template>
  <div>
    <a-table 
      bordered 
      :columns="columns" 
      :dataSource="data"
      :pagination="pagination"
      @change="handleTableChange">

      <template slot="date" slot-scope="text">
        {{moment(text).format(dateFormat)}}
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary" @click="viewDetail(record)">
          查看详情
        </a-button>
      </template>
    </a-table>
  </div>
</template>
<script >
import {getModels} from '../../api/replay.js'
import moment from 'moment'
const columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    width: '5%',
    align: 'center',
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '模型名称',
    dataIndex: 'modelName',
    width: '15%',
  },
  {
    title: '模型描述',
    dataIndex: 'modelDescription',
    // width: '50%',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 185,
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 185,
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '操作',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  data() {
    return {
      moment: moment,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      data: [],
      columns,
      pagination: {
        total: 0,
				pageSize: 10, // 默认每页显示数量
				showSizeChanger: true, // 显示可改变每页数量
				pageSizeOptions: ['10', '20', '30', '40'], // 每页数量选项
				showTotal: total => `共 ${total} 条`, // 显示总数
        showSizeChange: (current, pageSize) => this.pageSize = pageSize, // 改变每页数量时更新显示
        change: this.handleTableChange,
			},
      pageSize: 10,
      page: 1,
      total: 0,
    };
  },
  mounted() {
    this.getModels()
  },
  methods: {
    async getModels() {
      const res = await getModels({
        page: this.page,
        per_page: this.pageSize,
      })
      this.data = res.data;
      this.pagination.total = res._meta.total_items;
    },
    handleTableChange(page) {
      this.page = page.current;
      this.pageSize = page.pageSize;
      this.getModels();
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
    viewDetail(record) {
      this.$router.push(`/model/detail/${record.id}`)
    }
  },
};
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>