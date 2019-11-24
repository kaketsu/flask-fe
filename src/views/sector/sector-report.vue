<template>
  <div>
    <a-form layout="inline" :form="form">
      <a-form-item>
        <a-range-picker 
          v-decorator="[
            'dateRange',
          ]"
        >
        </a-range-picker>
      </a-form-item>

      <a-form-item>
        <a-select
          mode="multiple"
          v-decorator="[
            'sectorIds',
            { rules: [{ required: true, message: 'Please input your!' }] },
          ]"
          placeholder="选择板块"
          style="min-width: 200px;"
        >
          <a-select-option v-for="s in sectorList" :key="s.id" :value="s.id">
            {{s.sectorName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="text-right" style="float: right;">
        <a-button type="primary" @click="search()">
          查询
        </a-button>
      </a-form-item>
    
    </a-form>
    <!-- <a-row :gutter="16"> 
      <a-col :span="8">
        <a-select
          mode="multiple"
          v-model="sectorIds"
          placeholder="选择板块"
          style="width: 200px;"
        >
          <a-select-option v-for="s in sectorList" :key="s.id" :value="s.id">
            {{s.sectorName}}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8">
        <a-range-picker v-model="dateRange" 
          @change="onChange">
        </a-range-picker>
      </a-col>
    </a-row> -->
    <div id="sector-chart"></div>
  </div>
</template>

<script>
import {getReplaySectorFevers, getReplays, getSectorList} from '../../api/replay.js'
import Highcharts from 'highcharts';
import moment from 'moment';
import _ from 'lodash';

export default {
  name: 'sector-report',
  data() {
    return {
      oneday: 1000 * 60 * 60 * 24,
      dateFormat: 'YYYY-MM-DD',
      form: this.$form.createForm(this, { name: 'form' }),
      startDay: '',
      endDay: '',

      sectorIds: [],
    
      sectorList: [],
      feverList: [],
      marketList: [],
    }
  },
  mounted() {
    this.form.setFieldsValue({
      dateRange: [
        moment(new Date() - 30 * this.oneday),
        moment(new Date()),
      ],
    });
    this.sectorIds = [];

    // const oneday = 1000 * 60 * 60 * 24;
    // this.dateRange = [
    //   moment(new Date() - 7 * oneday),
    //   moment(new Date()),
    // ];
    const dateRange = this.form.getFieldValue('dateRange');
    this.startDay = dateRange[0].format(this.dateFormat);
    this.endDay = dateRange[1].format(this.dateFormat);
    this.getSectorList();
    this.search();
  },
  methods: {
     async getSectorList() {
      const res = await getSectorList();
      this.sectorList = res.data;
    },
    async getFevers() {
      const res = await getReplaySectorFevers({
        startDay: this.startDay,
        endDay: this.endDay,
        sectorIds: this.sectorIds,
      })
      this.feverList = res.data;
    },
    async getMarketReplays() {
      const res = await getReplays({
        startDay: this.startDay,
        endDay: this.endDay,
      })
      this.marketList = res.data;
    },
    async search() {
      const dateRange = this.form.getFieldValue('dateRange');
      this.sectorIds = this.form.getFieldValue('sectorIds') || [];
      this.startDay = dateRange[0].format(this.dateFormat);
      this.endDay = dateRange[1].format(this.dateFormat);
      await this.getFevers();
      await this.getMarketReplays();
     
      const keys = [];
      let start = moment(this.startDay);
      while (start <= moment(this.endDay) ) {
        keys.push(moment(start).format(this.dateFormat));
        start += this.oneday;
      }
      const values = [];

      const marketFever = {
        name: '大盘',
        data: [],
      }
      keys.forEach((date) => {
        const f = this.marketList.find((s) => (moment(s.date).format(this.dateFormat) === date));
        if (f) {
          marketFever.data.push(f.marketFever);
        } else {
          marketFever.data.push(0);
        }
      })
      
      // 大盘热度曲线
      values.push(marketFever)

      

      // 板块热度
      const result = _.groupBy(this.feverList, 'sectorId');

      this.sectorIds.forEach((sector) => {
        const newSector = {
          name: this.formatSectorName(sector),
          data: [],
        }
        keys.forEach((date) => {
          if (result[sector]) {
            const currentSector = result[sector];
            const f = currentSector.find((s) => (moment(s.date).format(this.dateFormat) === date))
            if (f) {
              newSector.data.push(f.fever);
            } else {
              newSector.data.push(0);
            }
          } else {
            newSector.data.push(0);
          }
        })
        values.push(newSector);
      })
      this.initHighcharts(keys, values)
    },
    initHighcharts(keys, values) {
      Highcharts.chart('sector-chart', {
        title: {
          text: '板块热度报表',
        },
        xAxis: {
          categories: keys,
        },
        yAxis: {
          title: {
            text: '热度',
          },
          tickPositions: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10],
        },
        series: values,
        lang: {
          noData: '暂无数据',
        },
        noData: {
          style: {
            fontWeight: 'normal',
            fontSize: '15px',
            color: '#303030',
          },
        },
      });
    },
    formatSectorName(id) {
      const res = this.sectorList.find(s => s.id === id);
      return res.sectorName;
    }
  }
  
}
</script>