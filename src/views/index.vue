<template>
  <Layout class="layout">
    <Header>
      <TopBar></TopBar>
    </Header>
    <Layout class="meunbar">
      <keep-alive>
        <Content>
          <draw></draw>
        </Content>
      </keep-alive>
    </Layout>
  </Layout>
</template>
<script>
import TopBar from "../components/TopBar";
import Menubar from "../components/Menubar";
import draw from "./draw/draw";
export default {
  name: "index",
  components: { TopBar, Menubar, draw }
};
</script>
<style>
.meunbar {
  margin-top: 1px;
}
</style>

