<template>
  <div>
    <a-form>
      <a-form-item label="日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-date-picker 
          v-model="date"
        ></a-date-picker>
      </a-form-item>

      <a-divider orientation="left">新建回溯股票</a-divider>
      <a-form-item label="关注股票" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-button @click="addStock()" icon="plus">
          添加
        </a-button>
        <a-list itemLayout="horizontal" :dataSource="stocks">
          <a-list-item slot="renderItem" slot-scope="item">
            <div>
              <div style="display:flex;">
                <div>关注股票: {{item.stockName}}</div>
                <div style="margin-left: 100px;">关注价格: {{item.stockPrice}}</div>
              </div>
              <div>备注: {{item.remark}}</div>
            </div>
          </a-list-item>
        </a-list>
      </a-form-item>
  
      <a-form-item :wrapper-col="{ span: 24, offset: 20 }">
        <a-button type="primary" @click="createNewReplay()">
          新建
        </a-button>
      </a-form-item>
    </a-form>

    <a-modal
      :visible="visible"
      title="关注个股"
      okText="添加"
      cancelText="取消"
      @ok="handleCreate"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form layout='vertical' :form="stockForm">
        <a-form-item label='股票名称'>
          <a-input
            v-decorator="[
              'stockName',
              {
                rules: [{ required: true, message: '输入股票名称' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='关注价格'>
          <a-input-number 
            v-decorator="[
              'stockPrice',
              {
                rules: [{ required: true, message: '输入关注价格' }],
              }
            ]"
            :step="0.01" :min="0" 
            style="width: 150px;"/>
        </a-form-item>

        <a-form-item label='回溯日期'>
          <!-- <a-input-number 
            v-decorator="[
              'recallDate',
              {
                rules: [{ required: true, message: '输入关注价格' }],
              }
            ]"
            :step="0.01" :min="0" 
            style="width: 150px;"/> -->

          <div v-for="(recall, index) of recallDateList" :key="index" style="margin-left: 10px; margin-bottom: 5px;">
            <span>{{moment(recall).format(dateFormat)}}</span>
          </div>
          <a-date-picker 
            :disabledDate="disabledDate"
            v-decorator="[
              'recallDate',
              {
                rules: [{ required: true, message: '输入回溯日期' }],
              }
            ]"
          ></a-date-picker>
          <a-button type="primary" style="margin-left: 10px;" shape="circle" icon="plus" 
            @click="addRecallDate()"/>
        </a-form-item>
        
        <a-form-item label='备注'>
          <a-input
            type='textarea'
            v-decorator="['remark']"
          />
        </a-form-item>
        <!-- <a-form-item class='collection-create-form_last-form-item'>
          <a-radio-group
            v-decorator="[
              'modifier',
              {
                initialValue: 'private',
              }
            ]"
          >
              <a-radio value='public'>Public</a-radio>
              <a-radio value='private'>Private</a-radio>
            </a-radio-group>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  createNewReplay,
  getSectorList,
  getReplayByDate,
} from '../../api/replay.js'
import moment from 'moment';

export default {
  name: 'replay',
  data() {
    return {
      moment: moment,
      dateFormat: 'YYYY-MM-DD',
      date: null,
      stockForm: this.$form.createForm(this, { name: 'stockForm' }),
      stocks: [],
      sectorList: [],


      id: 0,
      visible: false,
      confirmLoading: false,

      recallDateList: [],
    }
  },
  computed: {
    defaultDate() {
      return moment(new Date());
    }
  },
  mounted() {
    this.date = moment(new Date());
    this.getSectorList()
  },
  methods: {
    async getReplay() {
      const date = this.form.getFieldValue('date');
      const res = await getReplayByDate(moment(date).format('YYYY-MM-DD'))
      console.log(res)
      if (res.data) {
        this.$router.push(`/replay/${moment(date).format('YYYY-MM-DD')}`)
      }
    },
    async getSectorList() {
      const res = await getSectorList();
      this.sectorList = res.data;
    },
    async createNewReplay() {
      this.form.validateFields(async (err) => {
        if (!err) {
          const res = this.form.getFieldsValue()
          const submitValue = {
            date: moment(res.date).format('YYYY-MM-DD'),
            summary: res.summary,
            limitUp: res.limitUp,
            limitDown: res.limitDown,
            marketFever: res.marketFever,
            sectorFevers:  res.sectors,
          }
          
          await createNewReplay(submitValue);
          this.$notification.success({
            message: '成功',
            description:
              '保存成功',
          });
        }
      })
    },
    disabledDate(current) {
        // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    async createStockRecall() {
      
    },
    addStock() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      
    },
    handleCreate() {
      this.stockForm.validateFields((err, values) => {
        if (!err) {
          this.recallDateList.push(values.recallDate)
          this.stocks.push({
            ...values,
            recallDate: this.recallDateList
          })
          this.stockForm.resetFields()
          this.recallDateList = []
          this.visible = false
          console.log(this.stocks)
        }
      });
    },
    addRecallDate() {
      const old = this.stockForm.getFieldValue('recallDate');
      if (old) {
        this.recallDateList.push(old);
      }
      this.stockForm.setFieldsValue({
        recallDate: null,
      })
    }
  }
}
</script>

<style lang="less">
/deep/.ant-divider {
  margin-top: 80px;
}

</style>