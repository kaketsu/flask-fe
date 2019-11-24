<template>
  <div>
    <property-grid :rows="rows"></property-grid>
  </div>
</template>

<script>
import {
  getReplayByDate,
} from '../../api/replay.js'
import PropertyGrid from '../../components/property-grid'
import moment from 'moment';

export default {
  name: 'replay-detail',
  components: {PropertyGrid},
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      replayDetail: {},
      rows: [
        {
          label: '日期:',
          key: 'date',
          value: '',
          span: 24,
          formatter: this.formatDate,
        },
        {
          label: '大盘热度:',
          key: 'marketFever',
          value: '',
          span: 24,
        },
        {
          label: '涨停个数:',
          key: 'limitUp',
          value: '',
          span: 12,
        },
        {
          label: '跌停个数:',
          key: 'limitDown',
          value: '',
          span: 12,
        },
        {
          label: '概述:',
          key: 'summary',
          value: '',
          span: 24,
        },
      ]
    }
  },
  mounted() {
    this.getReplay();
  },
  methods: {
    async getReplay() {
      const date = this.$route.params.date;
      const res = await getReplayByDate(date)
      console.log(res)
      // if (res.data) {
      //   this.$router.push(`/replay/${moment(date).format('YYYY-MM-DD')}`)
      // }
      this.replayDetail = res.data;
      this.rows.forEach((row) => {
        if (row.formatter) {
          row.value = row.formatter(this.replayDetail[row.key]);
        } else {
          row.value = this.replayDetail[row.key];
        }
      });
    },
    formatDate(val) {
      return moment(val).format(this.dateFormat);
    }
  }
}
</script>