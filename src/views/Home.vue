<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo" />
      <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
        
        <a-menu-item key="replay">
          <router-link to="/replay/create">
            <a-icon type="pie-chart" />
            <span>当日复盘</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="replay-history">
          <router-link to="/replay-history">
            <a-icon type="desktop" />
            <span>复盘历史</span>
          </router-link>
        </a-menu-item>

        <a-sub-menu key="recall">
          <span slot="title">
            <a-icon type="user" />
            <span>股票回溯</span>
          </span>
          
          <a-menu-item key="sector-report">
            <router-link to="/recall/create">
              <span>新建回溯</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="recall-list">
            <router-link to="/recall/list">
              <span>其他</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="model">
          <span slot="title">
            <a-icon type="user" />
            <span>选股模型</span>
          </span>
          
          <a-menu-item key="model-create">
            <router-link to="/model/create">
              <span>新建模型</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="model-list">
            <router-link to="/model/list">
              <span>模型列表</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sector">
          <span slot="title">
            <a-icon type="user" />
            <span>板块管理</span>
          </span>
          
          <a-menu-item key="sector-report">
            <router-link to="/sector/report">
              <span>板块报表</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="sector-all">
            <router-link to="/sector/list">
              <span>板块列表</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>

        

        

        <!-- <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="team" /><span>Team</span></span>
          <a-menu-item key="6">Team 1</a-menu-item>
          <a-menu-item key="8">Team 2</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <a-icon type="file" />
          <span>File</span>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">

      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  export default {
    data() {
      return {
        collapsed: false,
      };
    },
  };
</script>

<style>
  #components-layout-demo-side .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.2s;
  }
  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-10px);
  }
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
</style>