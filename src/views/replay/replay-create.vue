<template>
  <div>
    <a-form :form="form">
      <a-form-item label="日期" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-date-picker 
          v-decorator="['date']"
        ></a-date-picker>
      </a-form-item>
      <!-- <a-form-item label="Gender" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-select
          placeholder=""
        >
          <a-select-option value="male">
            male
          </a-select-option>
          <a-select-option value="female">
            female
          </a-select-option>
        </a-select>
      </a-form-item> -->
      

      <!-- <a-form-item label="当日热度" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-slider :min="-10" :max="10" :marks="marks" :step="1" :defaultValue="0" />
      </a-form-item> -->

      <a-divider orientation="left">大盘走势</a-divider>

      <a-form-item label="大盘热度" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-slider :min="-10" :max="10" :marks="marks" :step="1"
          v-decorator="[
            'marketFever'
          ]"
          style="width: 68%;"/>
      </a-form-item>

      <a-form-item label='涨停个数' :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-input-number 
          v-decorator="[
            'limitUp',
            {
              rules: [{ required: true, message: '涨停个数' }],
            }
          ]"
          :step="1" :min="0" 
          style="width: 150px;"/>
      </a-form-item>

      <a-form-item label='跌停个数' :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-input-number 
          v-decorator="[
            'limitDown',
            {
              rules: [{ required: true, message: '跌停个数' }],
            }
          ]"
          :step="1" :min="0" 
          style="width: 150px;"/>
      </a-form-item>

      <a-form-item label="大盘概述" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-textarea
          v-decorator="['summary']"
          placeholder="当日大盘概述"
          :autosize="{ minRows: 4, maxRows: 16 }"
        />
      </a-form-item>

      <a-divider orientation="left">热点板块</a-divider>

      <a-form-item label="关注板块热度" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-button @click="addSector()" icon="plus">
          添加
        </a-button>
      </a-form-item>

      <div v-for="(k, index) in form.getFieldValue('sectorKeys')"
        :key="k">
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }"
        :label="`板块${index+1}:`"
        :required="false"
        >
          <a-select
            v-decorator="[
              `sectors[${k}].sectorId`,{
                rules: [{ required: true, message: '请选择板块!' }],
              }
            ]"
            placeholder="板块名称"
            style="width: 70%;"
          >
            <a-select-option v-for="s in sectorList" :key="s.id" :value="s.id">
              {{s.sectorName}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="`热度${index+1}:`" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-slider :min="-10" :max="10" :marks="marks" :step="1" :defaultValue="0"
            v-decorator="[
              `sectors[${k}].fever`,
            ]"
           style="width: 68%;"/>
        </a-form-item>

        <a-form-item :label="`备注${index+1}:`" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-input
            type='textarea'
            v-decorator="[
              `sectors[${k}].remark`,
            ]"
          />
        </a-form-item>
        <a-divider></a-divider>

      </div>

      <!-- <a-divider orientation="left">当日操作股票</a-divider>

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
      </a-form-item> -->
  
      <a-form-item :wrapper-col="{ span: 24, offset: 20 }">
        <a-button type="primary" @click="createNewReplay()">
          新建
        </a-button>
      </a-form-item>
    </a-form>
    
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
      marks: {
        '-2': '-2',
        '-4': '-4',
        '-6': '-6',
        '-8': '-8',
        0: '0',
        2: '2',
        4: '4',
        6: '6',
        8: '8',
        '-10': {
          style: {
            color: '#91bfff',
          },
          label: <strong>-10</strong>,
        },
        10: {
          style: {
            color: '#f50',
          },
          label: <strong>10</strong>,
        },
      },

      form: this.$form.createForm(this, { name: 'newForm' }),
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
    this.form.setFieldsValue({
      date: moment(new Date()),
      marketFever: 0,
      sectors: [],
    });
    this.form.getFieldDecorator('sectorKeys', { initialValue: [], preserve: true });

    // this.getReplay()
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
    addSector() {
      const keys = this.form.getFieldValue('sectorKeys');
      const nextKeys = keys.concat(this.id++);
      this.form.setFieldsValue({
        sectorKeys: nextKeys,
      });

      console.log(this.form.getFieldsValue())
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