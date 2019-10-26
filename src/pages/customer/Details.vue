<template>
  <div class="customer_details">
    <h2>顾客详情</h2>
    <el-button type="primary" size="small" @click="backHandler">返回</el-button><br>
    姓名{{customer.realname}} <br>
    手机{{customer.telephone}}
  </div>
</template>
<script>
export default {
  data:{
    return(){
      customer:{}
    }
  },
  created(){
    console.log(this.$route);
    this.customer = this.$route.query.customer;
  },
  methods:{
    backHandler(){
      this.$router.go(-1);
    }
  }
}
</script>
<style scoped>

</style>