<template>
  <div>
    <a-table 
      bordered 
      :columns="columns" 
      :dataSource="data"
      :pagination="pagination"
      @change="handleTableChange">
      <!-- <template
        v-for="col in ['date', 'limitUp', 'limitDown', 'marketFever', 'summary']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
          />
          <template v-else>{{text}}</template
          >
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">Save</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">Edit</a>
          </span>
        </div>
      </template> -->
      <template slot="date" slot-scope="text">
        {{moment(text).format(dateFormat)}}
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary" @click="viewDetail(record)">
          查看详情
        </a-button>
      </template>
    </a-table>
    <!-- <a-pagination
      showSizeChanger
      :pageSize.sync="pageSize"
      :defaultCurrent="1"
      :total="total"
      v-model="page"
    /> -->
  </div>
</template>
<script >
import {getReplays} from '../../api/replay.js'
import moment from 'moment'
const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    width: '15%',
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '涨停个数',
    dataIndex: 'limitUp',
    width: '10%',
    scopedSlots: { customRender: 'limitUp' },
  },
  {
    title: '跌停个数',
    dataIndex: 'limitDown',
    width: '10%',
    scopedSlots: { customRender: 'limitDown' },
  },
  {
    title: '市场热度',
    dataIndex: 'marketFever',
    width: '10%',
    scopedSlots: { customRender: 'marketFever' },
  },
  {
    title: '概述',
    dataIndex: 'summary',
    width: '40%',
    scopedSlots: { customRender: 'summary' },
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  data() {
    return {
      moment: moment,
      dateFormat: 'YYYY-MM-DD',
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
    this.getReplays()
  },
  methods: {
    async getReplays() {
      const res = await getReplays({
        startDay: this.startDay,
        endDay: this.endDay,
        page: this.page,
        per_page: this.pageSize,
      })
      this.data = res.data;
      this.pagination.total = res._meta.total_items;
    },
    handleTableChange(page) {
      this.page = page.current;
      this.pageSize = page.pageSize;
      this.getReplays();
    },
    // handleChange(value, key, column) {
    //   const newData = [...this.data];
    //   const target = newData.filter(item => key === item.key)[0];
    //   if (target) {
    //     target[column] = value;
    //     this.data = newData;
    //   }
    // },
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
      this.$router.push(`/replay/${moment(record.date).format(this.dateFormat)}`)
    }
  },
};
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>