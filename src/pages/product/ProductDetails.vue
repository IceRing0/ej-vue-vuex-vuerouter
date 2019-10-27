<template>
  <div class="product_details">
    <h2>产品详情</h2>
    <el-button type="primary" size="small" @click="backHandler">返回</el-button>
    <div>
      <el-form label-position="left"  class="demo-table-expand">
        <el-row>
          <el-col :span="6" style="margin-left: 500px">
            <el-form-item label="产品编号">
              <span>{{ product.id }}</span>
            </el-form-item>
              <el-form-item label="产品名称">
              <span>{{ product.name }}</span>
            </el-form-item>
              <el-form-item label="产品描述">
              <span>{{ product.description }}</span>
            </el-form-item>
            <!-- <el-form-item label="产品图片">
              <span><img :src="product.photo.icon" alt=""></span>
            </el-form-item> -->
              <el-form-item label="产品价格">
              <span>{{ product.price }}</span>
            </el-form-item>
              <el-form-item label="产品状态">
              <span>{{ product.status }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属栏目">
              <span>{{ product.category.name }}</span>
            </el-form-item>
            <el-form-item label="栏目 ID">
              <span>{{ product.categoryId }}</span>
            </el-form-item>
            <el-form-item label="栏目序号">
              <span>{{ product.category.num }}</span>
            </el-form-item>
            <el-form-item label="栏目图标">
              <span><img :src="product.category.icon" alt=""></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      product:{}
    }
  },
  created(){
    // console.log("当前路由",this.$route);
    this.product = this.$route.query.product;
  },
  methods:{
    backHandler(){
      // this.$router.push('./product')
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
  
</style>