<template>
  <div>
    <div class="mb-3 text-right">
      <a-button type="primary" @click="addSector()">新增板块</a-button>
    </div>
    <a-table 
      :columns="columns" 
      :rowKey="row => row.id"
      :dataSource="tableData">
      <!-- <template
        v-for="col in ['sectorName', 'stocks', 'description']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
          />
          <template v-else
            >{{text}}
          </template>
        </div>
      </template> -->

      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
           <a @click="getRecordItem(record.id)">Edit</a>
          <!-- <span v-if="record.editable">
            <a @click="() => save(record.key)">Save</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">Edit</a>
          </span> -->
        </div>
      </template>
    </a-table>

    <a-modal
      :visible="visible"
      title="添加板块"
      okText="添加"
      cancelText="取消"
      @ok="handleCreate"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form layout='vertical' :form="newSectorForm">
        <a-form-item label='板块名称'>
          <a-input
            v-decorator="[
              'sectorName',
              {
                rules: [{ required: true, message: '输入板块名称' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='板块描述'>
          <a-input
            type='textarea'
            v-decorator="[
              'description',
            ]"
          />
        </a-form-item>

        <a-form-item
          v-for="(k, index) in newSectorForm.getFieldValue('keys')"
          :key="k"
          :label="index === 0 ? '关注个股' : ''"
          :required="false"
        >
          <a-input
            v-decorator="[
              `stocks[${k}]`,
            ]"
            placeholder="个股名称"
            style="width: 60%; margin-right: 8px"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="dashed" style="width: 60%" @click="addSectorStock">
            <a-icon type="plus" /> 添加个股
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script >
import {
  createNewSector,
  getSectorList,
  getSector,
} from '../../api/replay.js'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '板块名称',
    dataIndex: 'sectorName',
    width: '20%',
    scopedSlots: { customRender: 'sectorName' },
  },
  {
    title: '板块描述',
    dataIndex: 'description',
    width: '30%',
    scopedSlots: { customRender: 'description' },
  },
  {
    title: '板块关注个股',
    dataIndex: 'stocks',
    width: '30%',
    scopedSlots: { customRender: 'stocks' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];


export default {
  data() {
    return {
      tableData: [],
      columns,

      visible: false,
      confirmLoading: false,

      id: 0,
      newSectorForm: this.$form.createForm(this, { name: 'newSectorForm' }),
    };
  },
  mounted() {
    this.newSectorForm.getFieldDecorator('keys', { initialValue: [], preserve: true });
    this.getSectorList();
  },
  methods: {
    // handleChange(value, key, column) {
    //   const newData = [...this.data];
    //   const target = newData.filter(item => key === item.key)[0];
    //   if (target) {
    //     target[column] = value;
    //     this.data = newData;
    //   }
    // },
    // edit(key) {
    //   const newData = [...this.data];
    //   const target = newData.filter(item => key === item.key)[0];
    //   if (target) {
    //     target.editable = true;
    //     this.data = newData;
    //   }
    // },
    // save(key) {
    //   const newData = [...this.data];
    //   const target = newData.filter(item => key === item.key)[0];
    //   if (target) {
    //     delete target.editable;
    //     this.data = newData;
    //     this.cacheData = newData.map(item => ({ ...item }));
    //   }
    // },
    // cancel(key) {
    //   const newData = [...this.data];
    //   const target = newData.filter(item => key === item.key)[0];
    //   if (target) {
    //     Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
    //     delete target.editable;
    //     this.data = newData;
    //   }
    // },
    addSector() {
      this.visible = true
      this.id = 0
    },
    async getSectorList() {
      const res = await getSectorList();
      this.tableData = res.data;
    },
    addSectorStock() {
      const keys = this.newSectorForm.getFieldValue('keys');
      const nextKeys = keys.concat(this.id++);
      this.newSectorForm.setFieldsValue({
        keys: nextKeys,
      });
      console.log(this.newSectorForm.getFieldsValue())
    },
    async getRecordItem(id) {
      console.log(id)
      await getSector(id);
    },
    handleCancel() {
      this.visible = false;
    },
    handleCreate() {
      this.newSectorForm.validateFields((err, values) => {
        if (!err) {
          this.newSectorForm.resetFields()
          const request = {
            sectorName: values.sectorName,
            description: values.description,
            stocks: values.stocks.join(',')
          }

          createNewSector(request);
          this.visible = false;
          setTimeout(() => {
            this.getSectorList();
          }, 200)
        }
      });
    },
  },
};
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>