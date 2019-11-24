import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeComponent from '@/Home.vue'
import ReplayCreateComponent from '@/replay/replay-create.vue'
import ReplayDetailComponent from '@/replay/replay-detail.vue'
import ReplayHistoryComponent from '@/replay/replay-history.vue'
import SectorListComponent from '@/sector/sector-list.vue'
import SectorReportComponent from '@/sector/sector-report.vue'

import RecallCreateComponent from '@/recall/recall-create.vue'

import ModelCreateComponent from '@/model/model-create.vue'
import ModelListComponent from '@/model/model-list.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '/replay/create',
        component: ReplayCreateComponent,
      },
      {
        path: '/replay/:date',
        component: ReplayDetailComponent,
      },
      {
        path: '/replay-history',
        component: ReplayHistoryComponent,
      },

      {
        path: '/sector/report',
        component: SectorReportComponent,
      },
      {
        path: '/sector/list',
        component: SectorListComponent,
      },

      {
        path: '/recall/create',
        component: RecallCreateComponent,
      },
      // models
      {
        path: '/model/create',
        component: ModelCreateComponent,
      },
      {
        path: '/model/list',
        component: ModelListComponent,
      },
      {
        path: '/model/detail/:id',
        component: ModelCreateComponent,
      }
    ]
  },
  // {
  //   path: '',
  //   redirect: 'home',
  // },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: HomeComponent,
  // },
  // {
  //   path: '/replay',
  //   name: 'replay',
  //   component: ReplayComponent,
  // },
]

export default new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});